package project.flowchat.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import project.flowchat.backend.Model.MessageModel;

@Repository
public interface MessageRepository extends JpaRepository<MessageModel, Integer> {

    /**
     * Get the list of image_id that are not connected to any message or post
     * @return list of image_id
     */
    @NativeQuery("SELECT image_id FROM [Image].[Image_Data] EXCEPT (SELECT image_id FROM CHAT.Message_Image UNION SELECT image_id FROM FORUM.Post_Image)")
    List<Integer> getUnconnectImageList();

    /**
     * Connect message with image
     * @param messageId messageId Integer
     * @param imageId imageId Integer
     */
    @Transactional
    @Modifying
    @NativeQuery("INSERT INTO CHAT.Message_Image (message_id, image_id) VALUES (?1, ?2)")
    void connectMessageWithImage(Integer messageId, Integer imageId);

    /**
     * Find image_id by message_id
     * @param messageId Integer
     * @return list of image_id
     */
    @NativeQuery("SELECT image_id FROM CHAT.Message_Image WHERE message_id = ?1")
    List<Integer> findImageIdByMessageId(Integer messageId);

    /**
     * Delete all image_id that are connected to message_id
     * @param imageId Integer
     */
    @Transactional
    @Modifying
    @NativeQuery("DELETE FROM CHAT.Message_Image WHERE image_id = ?1")
    void deleteInMessageImage(Integer imageId);

    /**
     * Find the latest one message for some each pair of contact user and userId
     * @param userId userId Integer
     * @param excludingUserIdList a list of userId that have already retrieved
     * @param userNum query number of contact user
     * @return a list of one latest message for some each pair of contact user and userId
     */
    @NativeQuery("WITH Ranked_Message AS (\n" +
            "SELECT *, ROW_NUMBER() OVER (\n" +
            "PARTITION BY \n" +
            "CASE \n" +
            "WHEN user_id_from < user_id_to THEN user_id_from \n" +
            "ELSE user_id_to \n" +
            "END,\n" +
            "CASE \n" +
            "WHEN user_id_from < user_id_to THEN user_id_to \n" +
            "ELSE user_id_from \n" +
            "END\n" +
            "ORDER BY sent_at DESC\n" +
            ") AS message_order\n" +
            "FROM CHAT.Message\n" +
            "WHERE is_active = 1\n" +
            "AND (user_id_from = ?1\n" +
            "OR user_id_to = ?1)\n" +
            ")\n" +
            "\n" +
            "SELECT TOP (?3) *\n" +
            "FROM Ranked_Message\n" +
            "WHERE message_order = 1\n" +
            "AND user_id_from NOT IN ?2\n" +
            "AND user_id_to NOT IN ?2\n" +
            "ORDER BY sent_at DESC")
    List<MessageModel> findAllContactUsers(Integer userId, List<Integer> excludingUserIdList, Integer userNum);

    /**
     * Find the number of unread message count for a pair of contact user and userId
     * @param userIdFrom contact user
     * @param userIdTo userId Integer
     * @return number of unread message count
     */
    @NativeQuery("SELECT COUNT(*)\n" +
            "FROM CHAT.Message\n" +
            "WHERE is_active = 1\n" +
            "AND read_at IS null\n" +
            "AND user_id_from = ?1\n" +
            "AND user_id_to = ?2")
    Integer getUnreadMessageCountByUserPair(Integer userIdFrom, Integer userIdTo);

    /**
     * Find some messages that the user1 and user2 have exchanged before.
     * @param userId1 userId1 Integer
     * @param userId2 userId2 Integer
     * @param excludingMessageIdList a list of messageId that have already retrieved
     * @param messageNum query number of message
     * @return MessageModel
     */
    @NativeQuery("SELECT TOP (?4) *\n" +
            "FROM CHAT.Message\n" +
            "WHERE ((user_id_from = ?1 AND user_id_to = ?2)\n" +
            "OR (user_id_from = ?2 AND user_id_to = ?1))\n" +
            "AND message_id NOT IN ?3\n" +
            "ORDER BY sent_at DESC")
    List<MessageModel> findAllMessageByUserPair(Integer userId1, Integer userId2, List<Integer> excludingMessageIdList, Integer messageNum);

    /**
     * Find the total number of unread message count for a user
     * @param userId userId Integer
     * @return number of unread message count
     */
    @NativeQuery("SELECT COUNT(*)\n" +
            "FROM CHAT.Message\n" +
            "WHERE is_active = 1\n" +
            "AND read_at IS null\n" +
            "AND user_id_to = ?1")
    Integer getTotalUnreadMessageCount(Integer userId);
}
