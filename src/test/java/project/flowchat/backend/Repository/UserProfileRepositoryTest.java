package project.flowchat.backend.Repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.TestPropertySource;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Model.UserProfileModel;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat; // Using AssertJ for better list assertions
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=MSSQLServer;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=none"
})
public class UserProfileRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserProfileRepository userProfileRepository;

    // Keep UserAccountRepository for creating prerequisite accounts if needed
    @Autowired
    private UserAccountRepository userAccountRepository;

    private UserAccountModel user1Account, user2Account, user3Account, inactiveAccount;
    private UserProfileModel user1Profile, user2Profile, user3Profile, inactiveProfile;

    // Helper to create UserAccount (needed for UserProfile foreign key and search tests)
    private UserAccountModel createUserAccount(String username, String email, boolean isActive) {
        UserAccountModel account = new UserAccountModel();
        account.setUsername(username);
        account.setEmail(email);
        account.setPasswordHash("dummyHash"); // Required field
        account.setIsActive(isActive);
        account.setRoleId(1); // Default role
        account.setCreatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        account.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        return entityManager.persist(account); // Persist account first
    }

    // Helper to create UserProfile linked to a UserAccount
    private UserProfileModel createUserProfile(UserAccountModel account, String description, Integer avatarId) {
        UserProfileModel profile = new UserProfileModel();
        profile.setUserId(account.getUserId()); // Link to account
        profile.setUsername(account.getUsername()); // Keep username consistent
        profile.setDescription(description);
        profile.setAvatarId(avatarId);
        profile.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        // Assuming UserProfileModel might have a reference back to UserAccountModel
        // profile.setUserAccount(account); // Uncomment if you have this mapping
        return entityManager.persistAndFlush(profile);
    }

    // Helper to create a follow relationship
    private void createFollow(Integer followerId, Integer followedId) {
        entityManager.getEntityManager().createNativeQuery("INSERT INTO PROFILE.Follow (user_id_from, user_id_to) VALUES (?, ?)")
                .setParameter(1, followerId)
                .setParameter(2, followedId)
                .executeUpdate();
    }

    // Helper to create a block relationship
    private void createBlock(Integer blockerId, Integer blockedId) {
        entityManager.getEntityManager().createNativeQuery("INSERT INTO PROFILE.Block (user_id_from, user_id_to) VALUES (?, ?)")
                .setParameter(1, blockerId)
                .setParameter(2, blockedId)
                .executeUpdate();
    }

    // Helper to create prerequisite image data
    // NOTE: Adjust column names (image_data, content_type) and dummy data as needed
    // based on your actual IMAGE.IMAGE_DATA table schema.
    private void createImageData(Integer imageId) {
        entityManager.getEntityManager().createNativeQuery(
                "INSERT INTO IMAGE.IMAGE_DATA (image_id, image_name, image_data, image_format) VALUES (?, ?, ?, ?)")
                .setParameter(1, imageId)
                .setParameter(2, "dummyImageName") // Dummy image name
                .setParameter(3, new byte[]{1}) // Minimal dummy data for VARBINARY/BLOB
                .setParameter(4, "image/png")   // Dummy content type
                .executeUpdate();
    }

    @BeforeEach
    void setUp() {
        // Create prerequisite image data first to satisfy foreign key constraints
        createImageData(101);
        createImageData(102);
        createImageData(103);
        createImageData(104);
        // It might be good practice to flush here if accounts depend on images somehow,
        // but likely not necessary just for the profile FK.

        // Create accounts first due to potential foreign key constraints
        user1Account = createUserAccount("userOne", "one@example.com", true);
        user2Account = createUserAccount("userTwo", "two@example.com", true);
        user3Account = createUserAccount("userThree", "three@example.com", true);
        inactiveAccount = createUserAccount("inactiveUser", "inactive@example.com", false);
        // Flush accounts to ensure they have IDs before profiles are created
        entityManager.flush();

        // Create profiles linked to accounts, now that avatar images exist
        user1Profile = createUserProfile(user1Account, "Profile One", 101);
        user2Profile = createUserProfile(user2Account, "Profile Two", 102);
        user3Profile = createUserProfile(user3Account, "Profile Three", 103);
        // Create profile for inactive user as well, might be needed for some tests
        inactiveProfile = createUserProfile(inactiveAccount, "Inactive Profile", 104);

        // Flush to ensure profile IDs are generated and data is persisted before tests run
        entityManager.flush();
        entityManager.clear(); // Clear persistence context to ensure fresh reads
    }

    @Test
    void findAvatarIdByUserId_WhenUserExists_ShouldReturnAvatarId() {
        Integer avatarId = userProfileRepository.findAvatarIdByUserId(user1Profile.getUserId());
        assertEquals(101, avatarId);
    }

    @Test
    void findAvatarIdByUserId_WhenUserDoesNotExist_ShouldReturnNull() {
        Integer avatarId = userProfileRepository.findAvatarIdByUserId(9999);
        assertNull(avatarId);
    }

    @Test
    void checkIfUserFollowed_WhenFollowExists_ShouldReturnUserIdFrom() {
        createFollow(user1Profile.getUserId(), user2Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        Integer result = userProfileRepository.checkIfUserFollowed(user1Profile.getUserId(), user2Profile.getUserId());
        assertEquals(user1Profile.getUserId(), result);
    }

    @Test
    void checkIfUserFollowed_WhenFollowDoesNotExist_ShouldReturnNull() {
        // No follow created between user1 and user3
        Integer result = userProfileRepository.checkIfUserFollowed(user1Profile.getUserId(), user3Profile.getUserId());
        assertNull(result);
    }

    @Test
    void followUser_ShouldInsertRecord() {
        userProfileRepository.followUser(user2Profile.getUserId(), user3Profile.getUserId());
        entityManager.flush(); // Make sure the insert happens via @Modifying
        entityManager.clear();

        Integer result = userProfileRepository.checkIfUserFollowed(user2Profile.getUserId(), user3Profile.getUserId());
        assertEquals(user2Profile.getUserId(), result);
    }

    @Test
    void unfollowUser_WhenFollowExists_ShouldDeleteRecord() {
        createFollow(user1Profile.getUserId(), user2Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        // Verify follow exists first
        assertNotNull(userProfileRepository.checkIfUserFollowed(user1Profile.getUserId(), user2Profile.getUserId()));

        // Act
        userProfileRepository.unfollowUser(user1Profile.getUserId(), user2Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        // Assert
        assertNull(userProfileRepository.checkIfUserFollowed(user1Profile.getUserId(), user2Profile.getUserId()));
    }

    @Test
    void unfollowUser_WhenFollowDoesNotExist_ShouldDoNothing() {
        // Act
        userProfileRepository.unfollowUser(user1Profile.getUserId(), user3Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        // Assert (check it's still null)
        assertNull(userProfileRepository.checkIfUserFollowed(user1Profile.getUserId(), user3Profile.getUserId()));
    }


    @Test
    void checkIfUserBlocked_WhenBlockExists_ShouldReturnUserIdFrom() {
        createBlock(user1Profile.getUserId(), user2Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        Integer result = userProfileRepository.checkIfUserBlocked(user1Profile.getUserId(), user2Profile.getUserId());
        assertEquals(user1Profile.getUserId(), result);
    }

    @Test
    void checkIfUserBlocked_WhenBlockDoesNotExist_ShouldReturnNull() {
        Integer result = userProfileRepository.checkIfUserBlocked(user1Profile.getUserId(), user3Profile.getUserId());
        assertNull(result);
    }

    @Test
    void blockUser_ShouldInsertRecord() {
        userProfileRepository.blockUser(user2Profile.getUserId(), user3Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        Integer result = userProfileRepository.checkIfUserBlocked(user2Profile.getUserId(), user3Profile.getUserId());
        assertEquals(user2Profile.getUserId(), result);
    }

    @Test
    void unblockUser_WhenBlockExists_ShouldDeleteRecord() {
        createBlock(user1Profile.getUserId(), user2Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        assertNotNull(userProfileRepository.checkIfUserBlocked(user1Profile.getUserId(), user2Profile.getUserId()));

        userProfileRepository.unblockUser(user1Profile.getUserId(), user2Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        assertNull(userProfileRepository.checkIfUserBlocked(user1Profile.getUserId(), user2Profile.getUserId()));
    }

    @Test
    void unblockUser_WhenBlockDoesNotExist_ShouldDoNothing() {
        userProfileRepository.unblockUser(user1Profile.getUserId(), user3Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        assertNull(userProfileRepository.checkIfUserBlocked(user1Profile.getUserId(), user3Profile.getUserId()));
    }

    @Test
    void findProfileByUserId_WhenUserExists_ShouldReturnProfile() {
        UserProfileModel profile = userProfileRepository.findProfileByUserId(user1Profile.getUserId());
        assertNotNull(profile);
        assertEquals(user1Profile.getUserId(), profile.getUserId());
        assertEquals("userOne", profile.getUsername());
        assertEquals("Profile One", profile.getDescription());
    }

    @Test
    void findProfileByUserId_WhenUserDoesNotExist_ShouldReturnNull() {
        UserProfileModel profile = userProfileRepository.findProfileByUserId(9999);
        assertNull(profile);
    }

    @Test
    void countFollowingByUserId_ShouldReturnCorrectCount() {
        assertEquals(0, userProfileRepository.countFollowingByUserId(user1Profile.getUserId()));

        createFollow(user1Profile.getUserId(), user2Profile.getUserId());
        createFollow(user1Profile.getUserId(), user3Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        assertEquals(2, userProfileRepository.countFollowingByUserId(user1Profile.getUserId()));
    }

    @Test
    void countFollowerByUserId_ShouldReturnCorrectCount() {
        assertEquals(0, userProfileRepository.countFollowerByUserId(user2Profile.getUserId()));

        createFollow(user1Profile.getUserId(), user2Profile.getUserId());
        createFollow(user3Profile.getUserId(), user2Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        assertEquals(2, userProfileRepository.countFollowerByUserId(user2Profile.getUserId()));
    }

    @Test
    void findFollowingListByUserId_ShouldReturnCorrectProfiles() {
        // user1 follows user2 and user3
        createFollow(user1Profile.getUserId(), user2Profile.getUserId());
        createFollow(user1Profile.getUserId(), user3Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        // Define a list for excluding IDs. Use a non-existent ID like -1 instead of an empty list
        // to avoid potential issues with native query parameter binding for empty collections.
        List<Integer> excludeNone = Collections.singletonList(-1);

        // Get first 1, excluding the dummy non-existent ID
        List<UserProfileModel> following1 = userProfileRepository.findFollowingListByUserId(
                user1Profile.getUserId(), excludeNone, 1);
        // This assertion failed previously (expected 1, was 0)
        assertEquals(1, following1.size(), "Should find one user when excluding a non-existent ID");
        // Order is by username ASC: userThree ("userThree"), userTwo ("userTwo"). So userThree should be first.
        assertEquals(user3Profile.getUserId(), following1.get(0).getUserId(), "First user should be userThree based on username ASC order");

        // Get next 1, excluding user3
        List<Integer> excludeUser3 = Collections.singletonList(user3Profile.getUserId());
        List<UserProfileModel> following2 = userProfileRepository.findFollowingListByUserId(
                user1Profile.getUserId(), excludeUser3, 1);
        assertEquals(1, following2.size(), "Should find one user when excluding userThree");
        assertEquals(user2Profile.getUserId(), following2.get(0).getUserId(), "Second user should be userTwo");

        // Get all (limit 5), excluding the dummy non-existent ID
        List<UserProfileModel> followingAll = userProfileRepository.findFollowingListByUserId(
                user1Profile.getUserId(), excludeNone, 5);
        assertEquals(2, followingAll.size(), "Should find two users when excluding a non-existent ID");
        assertThat(followingAll.stream().map(UserProfileModel::getUserId).collect(Collectors.toList()))
                .as("Check if both followed users are present")
                .containsExactlyInAnyOrder(user2Profile.getUserId(), user3Profile.getUserId());
         // Check order (userThree, userTwo)
        assertEquals(user3Profile.getUserId(), followingAll.get(0).getUserId(), "First user in full list should be userThree");
        assertEquals(user2Profile.getUserId(), followingAll.get(1).getUserId(), "Second user in full list should be userTwo");
    }

     @Test
    void findFollowerListByUserId_ShouldReturnCorrectProfiles() {
        // user1 and user3 follow user2
        createFollow(user1Profile.getUserId(), user2Profile.getUserId());
        createFollow(user3Profile.getUserId(), user2Profile.getUserId());
        entityManager.flush();
        entityManager.clear();

        // Get first 1, excluding none (use a non-existent ID like -1 for empty exclusion)
        List<Integer> excludeNone = Collections.singletonList(-1);
        List<UserProfileModel> followers1 = userProfileRepository.findFollowerListByUserId(
                user2Profile.getUserId(), excludeNone, 1);
        assertEquals(1, followers1.size(), "Should find one follower when excluding a non-existent ID");
        // Order is by username ASC: userOne, userThree. So userOne should be first.
        assertEquals(user1Profile.getUserId(), followers1.get(0).getUserId(), "First follower should be userOne");

        // Get next 1, excluding user1
        List<UserProfileModel> followers2 = userProfileRepository.findFollowerListByUserId(
                user2Profile.getUserId(), Collections.singletonList(user1Profile.getUserId()), 1);
        assertEquals(1, followers2.size());
        assertEquals(user3Profile.getUserId(), followers2.get(0).getUserId());
        // Get all (limit 5), excluding none (use a non-existent ID like -1 for empty exclusion)
        List<UserProfileModel> followersAll = userProfileRepository.findFollowerListByUserId(
                user2Profile.getUserId(), excludeNone, 5);
        assertEquals(2, followersAll.size(), "Should find all followers when excluding a non-existent ID");
        assertThat(followersAll.stream().map(UserProfileModel::getUserId).collect(Collectors.toList()))
                .as("Check if both followers are present")
                .containsExactlyInAnyOrder(user1Profile.getUserId(), user3Profile.getUserId());
        // Check order (userOne, userThree)
        assertEquals(user1Profile.getUserId(), followersAll.get(0).getUserId());
        assertEquals(user3Profile.getUserId(), followersAll.get(1).getUserId());
    }

    @Test
    void findBlockingListByUserId_ShouldReturnCorrectProfiles() {
        // user1 blocks user2 and user3
        createBlock(user1Profile.getUserId(), user2Profile.getUserId());
        createBlock(user1Profile.getUserId(), user3Profile.getUserId());
        entityManager.flush();
        // Get first 1, excluding none (use a non-existent ID like -1 for empty exclusion)
        List<Integer> excludeNone = Collections.singletonList(-1);
        List<UserProfileModel> blocking1 = userProfileRepository.findBlockingListByUserId(
                user1Profile.getUserId(), excludeNone, 1);
        assertEquals(1, blocking1.size(), "Should find one blocked user when excluding a non-existent ID");
        // Order is by username ASC: userThree, userTwo. So userThree should be first.
        assertEquals(user3Profile.getUserId(), blocking1.get(0).getUserId(), "First blocked user should be userThree");
        // Order is by username ASC: userThree, userTwo. So userThree should be first.
        assertEquals(user3Profile.getUserId(), blocking1.get(0).getUserId());

        // Get next 1, excluding user3
        List<UserProfileModel> blocking2 = userProfileRepository.findBlockingListByUserId(
                user1Profile.getUserId(), Collections.singletonList(user3Profile.getUserId()), 1);
        // Get all (limit 5), excluding none (use a non-existent ID like -1 for empty exclusion)
        List<UserProfileModel> blockingAll = userProfileRepository.findBlockingListByUserId(
                user1Profile.getUserId(), excludeNone, 5);
        assertEquals(2, blockingAll.size(), "Should find all blocked users when excluding a non-existent ID");
        assertThat(blockingAll.stream().map(UserProfileModel::getUserId).collect(Collectors.toList()))
                .as("Check if both blocked users are present")
                .containsExactlyInAnyOrder(user2Profile.getUserId(), user3Profile.getUserId());
        assertEquals(2, blockingAll.size());
        assertThat(blockingAll.stream().map(UserProfileModel::getUserId).collect(Collectors.toList()))
                .containsExactlyInAnyOrder(user2Profile.getUserId(), user3Profile.getUserId());
        // Check order (userThree, userTwo)
        assertEquals(user3Profile.getUserId(), blockingAll.get(0).getUserId());
        assertEquals(user2Profile.getUserId(), blockingAll.get(1).getUserId());
    }
}