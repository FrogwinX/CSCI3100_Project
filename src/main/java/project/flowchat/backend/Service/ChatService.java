package project.flowchat.backend.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import project.flowchat.backend.DTO.ChatReceiveMessageDTO;
import project.flowchat.backend.DTO.ChatSendMessageDTO;
import project.flowchat.backend.Model.MessageModel;
import project.flowchat.backend.Repository.MessageRepository;

@AllArgsConstructor
@Service
public class ChatService {

    @Autowired
    private final ImageService imageService;
    private final MessageRepository messageRepository;

    /**
     * Send message and store it in database
     * @param message message to be sent
     * @return message with image API list 
     */
    @Transactional
    public ChatReceiveMessageDTO sendAndStoreMessage(ChatSendMessageDTO message) {
        MessageModel messageModel = new MessageModel();
        messageModel.setUserIdFrom(message.getUserIdFrom());
        messageModel.setUserIdTo(message.getUserIdTo());
        messageModel.setContent(message.getContent());
        messageModel.setAttachTo(message.getAttachTo());
        messageModel.setIsActive(true);
        messageModel.setSentAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        messageModel.setReadAt(null);

        if (!connectImageAndMessage(message.getImageIdList(), messageModel.getMessageId())) {
            ChatReceiveMessageDTO returnMessage = new ChatReceiveMessageDTO();
            returnMessage.setSuccess(false);
            returnMessage.setContent("Invalid image id list");
            return returnMessage;
        }

        messageRepository.save(messageModel);
        return convertToDTO(messageModel, message.getImageIdList());
    }

    /**
     * Connect images and message if all images are not connected to any message or post
     * @param imageIdList
     * @return true if the given image id list does not contain any image that is not connected to any message or post, false otherwise
     */
    private Boolean connectImageAndMessage(List<Integer> imageIdList, Integer messageId) {
        List<Integer> unconnectImageList = messageRepository.getUnconnectImageList();
        for (Integer imageId : imageIdList) {
            if (!unconnectImageList.contains(imageId)) {
                return false;
            }
        }

        for (Integer imageId: imageIdList) {
            messageRepository.connectMessageWithImage(messageId, imageId);
        }
        return true;
    }

    /**
     * Convert MessageModel to ChatReceiveMessageDTO, generate link for images
     * @param messageModel message record in database
     * @param imageIdList list of image id that need to be converted to image API
     * @return
     */
    private ChatReceiveMessageDTO convertToDTO(MessageModel messageModel, List<Integer> imageIdList) {
        ChatReceiveMessageDTO messageDTO = new ChatReceiveMessageDTO();
        messageDTO.setMessageId(messageModel.getMessageId());
        messageDTO.setUserIdFrom(messageModel.getUserIdFrom());
        messageDTO.setUserIdTo(messageModel.getUserIdTo());
        messageDTO.setContent(messageModel.getContent());
        messageDTO.setAttachTo(messageModel.getAttachTo());
        messageDTO.setSentAt(messageModel.getSentAt());
        messageDTO.setReadAt(messageModel.getReadAt());

        if (imageIdList != null && imageIdList.size() > 0) {
            List<String> imageAPIList = new ArrayList<>();
            for (Integer imageId : imageIdList) {
                imageAPIList.add(imageService.deploymentGetImageAPI + imageId);
            }
            messageDTO.setImageAPIList(imageAPIList);
        }

        return messageDTO;
    }
}
