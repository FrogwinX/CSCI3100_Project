package project.flowchat.backend.Repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.TestPropertySource;
import project.flowchat.backend.Model.ImageModel; // Assuming ImageModel exists
import project.flowchat.backend.Model.MessageModel;
import project.flowchat.backend.Model.UserAccountModel; // Assuming UserAccountModel exists

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.assertj.core.api.Assertions.assertThat; // Using AssertJ for better list assertions

@DataJpaTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb_chat;MODE=MSSQLServer;DATABASE_TO_UPPER=FALSE;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=none",
})
public class MessageRepositoryTest {

    @Autowired
    private TestEntityManager testEntityManager;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private MessageRepository messageRepository;

    private UserAccountModel user1, user2, user3;
    private ImageModel image1, image2, image3;
    private MessageModel message1, message2, message3, message4;
    private ZonedDateTime now;

    private UserAccountModel createUser(String username) {
        UserAccountModel user = new UserAccountModel();
        user.setUsername(username);
        user.setEmail(username + "@test.com");
        user.setPasswordHash("hash");
        user.setIsActive(true);
        user.setRoleId(1);
        user.setCreatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        user.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        testEntityManager.persist(user);
        return user;
    }

    private ImageModel createImage(String name) {
        ImageModel image = new ImageModel();
        image.setImageName(name);
        image.setImageFormat("image/jpeg");
        image.setImageData(new byte[]{1, 2, 3});
        testEntityManager.persist(image);
        return image;
    }

    private MessageModel createMessageEntity(UserAccountModel from, UserAccountModel to, String content, ZonedDateTime sentAt, ZonedDateTime readAt, boolean isActive) {
        MessageModel message = new MessageModel();
        message.setUserIdFrom(from.getUserId());
        message.setUserIdTo(to.getUserId());
        message.setContent(content);
        message.setSentAt(sentAt);
        message.setReadAt(readAt);
        message.setIsActive(isActive);
        testEntityManager.persist(message);
        return message;
    }

    @Transactional
    void linkMessageImage(Integer messageId, Integer imageId) {
        entityManager.createNativeQuery("CREATE TABLE IF NOT EXISTS CHAT.Message_Image (message_id INT, image_id INT, PRIMARY KEY (message_id, image_id))").executeUpdate();
        entityManager.createNativeQuery("INSERT INTO CHAT.Message_Image (message_id, image_id) VALUES (?, ?)")
                .setParameter(1, messageId)
                .setParameter(2, imageId)
                .executeUpdate();
    }

    @Transactional
    void linkPostImage(Integer postId, Integer imageId) {
        entityManager.createNativeQuery("INSERT INTO FORUM.Post_Image (post_id, image_id) VALUES (?, ?)")
                .setParameter(1, postId)
                .setParameter(2, imageId)
                .executeUpdate();
    }

    @BeforeEach
    @Transactional
    void setUp() {
        entityManager.createNativeQuery("DELETE FROM CHAT.Message_Image").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM FORUM.Post_Image").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM CHAT.Message").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM FORUM.Post").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM Image.Image_Data").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM ACCOUNT.User_Account").executeUpdate();

        entityManager.createNativeQuery("CREATE SCHEMA IF NOT EXISTS ACCOUNT").executeUpdate();
        entityManager.createNativeQuery("CREATE SCHEMA IF NOT EXISTS CHAT").executeUpdate();
        entityManager.createNativeQuery("CREATE SCHEMA IF NOT EXISTS Image").executeUpdate();
        entityManager.createNativeQuery("CREATE SCHEMA IF NOT EXISTS FORUM").executeUpdate();

        entityManager.createNativeQuery("CREATE TABLE IF NOT EXISTS ACCOUNT.User_Account (user_id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(255), email VARCHAR(255), password_hash VARCHAR(255), is_active BOOLEAN, role_id INT, created_at TIMESTAMP, updated_at TIMESTAMP)").executeUpdate();
        entityManager.createNativeQuery("CREATE TABLE IF NOT EXISTS Image.Image_Data (image_id INT PRIMARY KEY AUTO_INCREMENT, image_name VARCHAR(255), image_format VARCHAR(50), image_data BLOB)").executeUpdate();
        entityManager.createNativeQuery("CREATE TABLE IF NOT EXISTS CHAT.Message (message_id INT PRIMARY KEY AUTO_INCREMENT, user_id_from INT, user_id_to INT, content VARCHAR(MAX), attach_to INT, is_active BOOLEAN, sent_at TIMESTAMP, read_at TIMESTAMP)").executeUpdate();
        entityManager.createNativeQuery("CREATE TABLE IF NOT EXISTS FORUM.Post (post_id INT PRIMARY KEY, title VARCHAR(255) DEFAULT 'Test Post', content VARCHAR(MAX) DEFAULT 'Test Content', user_id INT DEFAULT 1, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, is_active BOOLEAN DEFAULT TRUE)").executeUpdate();
        entityManager.createNativeQuery("CREATE TABLE IF NOT EXISTS FORUM.Post_Image (post_id INT, image_id INT, PRIMARY KEY (post_id, image_id), CONSTRAINT FK_POSTIMG_POST FOREIGN KEY (post_id) REFERENCES FORUM.Post(post_id), CONSTRAINT FK_POSTIMG_IMG FOREIGN KEY (image_id) REFERENCES Image.Image_Data(image_id))").executeUpdate();
        entityManager.createNativeQuery("CREATE TABLE IF NOT EXISTS CHAT.Message_Image (message_id INT, image_id INT, PRIMARY KEY (message_id, image_id))").executeUpdate();

        try {
            entityManager.createNativeQuery(
                "CREATE OR REPLACE VIEW UNCONNECTED_IMAGES AS " +
                "SELECT i.image_id FROM Image.Image_Data i " +
                "WHERE NOT EXISTS (" +
                "    SELECT 1 FROM CHAT.Message_Image mi WHERE mi.image_id = i.image_id" +
                "    UNION ALL " +
                "    SELECT 1 FROM FORUM.Post_Image pi WHERE pi.image_id = i.image_id" +
                ")"
            ).executeUpdate();
        } catch (Exception e) {
            System.out.println("View creation failed: " + e.getMessage());
        }

        now = ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")).withNano(0);

        user1 = createUser("user1");
        user2 = createUser("user2");
        user3 = createUser("user3");

        image1 = createImage("image1.jpg");
        image2 = createImage("image2.png");
        image3 = createImage("image3.gif");

        entityManager.createNativeQuery("INSERT INTO FORUM.Post (post_id, user_id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)")
                .setParameter(1, 999)
                .setParameter(2, user1.getUserId())
                .setParameter(3, "Test Post for Setup")
                .setParameter(4, "Test Content for Setup")
                .setParameter(5, now)
                .setParameter(6, now)
                .executeUpdate();

        message1 = createMessageEntity(user1, user2, "Hello User2", now.minusMinutes(10), null, true);
        message2 = createMessageEntity(user2, user1, "Hi User1", now.minusMinutes(5), now.minusMinutes(1), true);
        message3 = createMessageEntity(user1, user3, "Hey User3", now.minusMinutes(15), null, true);
        message4 = createMessageEntity(user3, user1, "Yo User1", now.minusMinutes(20), null, false);

        testEntityManager.flush();

        linkMessageImage(message1.getMessageId(), image1.getImageId());
        linkPostImage(999, image3.getImageId());

        testEntityManager.flush();
        testEntityManager.clear();
    }

    @Test
    void getUnconnectImageList_ShouldReturnOnlyUnusedImages() {
        List<Integer> unconnectImageList = entityManager.createNativeQuery(
            "SELECT image_id FROM UNCONNECTED_IMAGES"
        ).getResultList();

        assertNotNull(unconnectImageList);
        assertThat(unconnectImageList).containsExactly(image2.getImageId());

        List<Integer> allImages = entityManager.createNativeQuery(
            "SELECT image_id FROM Image.Image_Data"
        ).getResultList();
        assertThat(allImages).hasSize(3);
    }

    @Test
    @Transactional
    void connectMessageWithImage_ShouldInsertRecord() {
        messageRepository.connectMessageWithImage(message2.getMessageId(), image2.getImageId());
        testEntityManager.flush();
        testEntityManager.clear();

        List<Integer> imageIds = messageRepository.findImageIdByMessageId(message2.getMessageId());
        assertNotNull(imageIds);
        assertThat(imageIds).contains(image2.getImageId());
    }

    @Test
    void findImageIdByMessageId_WhenLinked_ShouldReturnImageIds() {
        List<Integer> imageIds = messageRepository.findImageIdByMessageId(message1.getMessageId());
        assertNotNull(imageIds);
        assertThat(imageIds).containsExactly(image1.getImageId());
    }

    @Test
    void findImageIdByMessageId_WhenNotLinked_ShouldReturnEmptyList() {
        List<Integer> imageIds = messageRepository.findImageIdByMessageId(message2.getMessageId());
        assertNotNull(imageIds);
        assertTrue(imageIds.isEmpty());
    }

    @Test
    @Transactional
    void deleteInMessageImage_ShouldRemoveRecord() {
        assertTrue(messageRepository.findImageIdByMessageId(message1.getMessageId()).contains(image1.getImageId()));

        messageRepository.deleteInMessageImage(image1.getImageId());
        testEntityManager.flush();
        testEntityManager.clear();

        List<Integer> imageIds = messageRepository.findImageIdByMessageId(message1.getMessageId());
        assertTrue(imageIds.isEmpty());
    }

    @Test
    @Transactional
    void findAllContactUsers_WithExclusion_ShouldExcludeUsers() {
        UserAccountModel currentUser1 = testEntityManager.find(UserAccountModel.class, user1.getUserId());
        UserAccountModel currentUser2 = testEntityManager.find(UserAccountModel.class, user2.getUserId());
        UserAccountModel currentUser3 = testEntityManager.find(UserAccountModel.class, user3.getUserId());
        MessageModel originalMessage3 = testEntityManager.find(MessageModel.class, message3.getMessageId());
        assertNotNull(currentUser1, "User1 not found in test transaction");
        assertNotNull(currentUser2, "User2 not found in test transaction");
        assertNotNull(currentUser3, "User3 not found in test transaction");
        assertNotNull(originalMessage3, "Original Message3 not found in test transaction");

        createMessageEntity(currentUser2, currentUser1, "Another one", now.minusMinutes(1), null, true);

        entityManager.flush();
        entityManager.clear();

        Integer userIdToQuery = currentUser1.getUserId();
        List<Integer> exclusionList = Collections.singletonList(currentUser2.getUserId());
        Integer limit = 10;

        List<MessageModel> contacts = messageRepository.findAllContactUsers(userIdToQuery, exclusionList, limit);

        assertNotNull(contacts);
        assertEquals(1, contacts.size(), "Should find only 1 contact (user3) after excluding user2.");

        assertEquals(originalMessage3.getMessageId(), contacts.get(0).getMessageId(), "The only remaining contact should be the message with user3.");
        assertEquals(currentUser1.getUserId(), contacts.get(0).getUserIdFrom());
        assertEquals(currentUser3.getUserId(), contacts.get(0).getUserIdTo());
        assertEquals("Hey User3", contacts.get(0).getContent());
    }

    @Test
    @Transactional
    void getUnreadMessageCountByUserPair_ShouldReturnCorrectCount() {
        UserAccountModel currentUser1 = testEntityManager.find(UserAccountModel.class, user1.getUserId());
        UserAccountModel currentUser2 = testEntityManager.find(UserAccountModel.class, user2.getUserId());
        assertNotNull(currentUser1);
        assertNotNull(currentUser2);

        createMessageEntity(currentUser1, currentUser2, "Another unread", now.minusMinutes(2), null, true);
        entityManager.flush();

        Integer countUser1ToUser2 = messageRepository.getUnreadMessageCountByUserPair(user1.getUserId(), user2.getUserId());
        Integer countUser2ToUser1 = messageRepository.getUnreadMessageCountByUserPair(user2.getUserId(), user1.getUserId());
        Integer countUser1ToUser3 = messageRepository.getUnreadMessageCountByUserPair(user1.getUserId(), user3.getUserId());
        Integer countUser3ToUser1 = messageRepository.getUnreadMessageCountByUserPair(user3.getUserId(), user1.getUserId());

        assertEquals(2, countUser1ToUser2);
        assertEquals(0, countUser2ToUser1);
        assertEquals(1, countUser1ToUser3);
        assertEquals(0, countUser3ToUser1);
    }

    @Test
    @Transactional
    void getTotalUnreadMessageCount_ShouldReturnCorrectTotal() {
        UserAccountModel currentUser1 = testEntityManager.find(UserAccountModel.class, user1.getUserId());
        UserAccountModel currentUser2 = testEntityManager.find(UserAccountModel.class, user2.getUserId());
        assertNotNull(currentUser1);
        assertNotNull(currentUser2);

        createMessageEntity(currentUser1, currentUser2, "Another unread", now.minusMinutes(2), null, true);
        entityManager.flush();

        Integer unreadForUser1 = messageRepository.getTotalUnreadMessageCount(user1.getUserId());
        Integer unreadForUser2 = messageRepository.getTotalUnreadMessageCount(user2.getUserId());
        Integer unreadForUser3 = messageRepository.getTotalUnreadMessageCount(user3.getUserId());

        assertEquals(0, unreadForUser1);
        assertEquals(2, unreadForUser2);
        assertEquals(1, unreadForUser3);
    }

    @Test
    @Transactional
    void findAllMessageByUserPair_WithExclusionAndLimit_ShouldApply() {
        UserAccountModel currentUser1 = testEntityManager.find(UserAccountModel.class, user1.getUserId());
        UserAccountModel currentUser2 = testEntityManager.find(UserAccountModel.class, user2.getUserId());
        assertNotNull(currentUser1);
        assertNotNull(currentUser2);

        MessageModel foundMessage1 = testEntityManager.find(MessageModel.class, message1.getMessageId());
        MessageModel foundMessage2 = testEntityManager.find(MessageModel.class, message2.getMessageId());
        assertNotNull(foundMessage1);
        assertNotNull(foundMessage2);

        List<MessageModel> messages = messageRepository.findAllMessageByUserPair(
            currentUser1.getUserId(),
            currentUser2.getUserId(),
            Collections.singletonList(foundMessage2.getMessageId()),
            1
        );

        assertNotNull(messages);
        assertEquals(1, messages.size(), "Should find only 1 message after excluding message2");
        assertEquals(foundMessage1.getMessageId(), messages.get(0).getMessageId(), "The remaining message should be message1");
    }
}