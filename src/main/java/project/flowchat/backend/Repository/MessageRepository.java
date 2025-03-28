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
    @NativeQuery("SELECT image_id FROM FORUM.Image_Data EXCEPT (SELECT image_id FROM CHAT.Message_Image UNION SELECT image_id FROM FORUM.Post_Image)")
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
}
