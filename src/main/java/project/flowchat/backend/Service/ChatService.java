package project.flowchat.backend.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import project.flowchat.backend.DTO.ChatReceiveMessageDTO;
import project.flowchat.backend.DTO.ChatSendMessageDTO;
import project.flowchat.backend.DTO.ContactDTO;
import project.flowchat.backend.Model.MessageModel;
import project.flowchat.backend.Repository.ForumRepository;
import project.flowchat.backend.Repository.MessageRepository;
import project.flowchat.backend.Repository.UserAccountRepository;

@AllArgsConstructor
@Service
public class ChatService {

    @Autowired
    private final ImageService imageService;
    private final MessageRepository messageRepository;
    private final ForumRepository forumRepository;
    private final UserAccountRepository userAccountRepository;
    private final SecurityService securityService;
    private SimpMessagingTemplate messagingTemplate;

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

        if (!connectImageAndMessage(message.getImageIdList())) {
            ChatReceiveMessageDTO returnMessage = new ChatReceiveMessageDTO();
            returnMessage.setSuccess(false);
            returnMessage.setContent("Invalid image id list");
            return returnMessage;
        }
        messageModel = messageRepository.save(messageModel);

        for (Integer imageId: message.getImageIdList()) {
            messageRepository.connectMessageWithImage(messageModel.getMessageId(), imageId);
        }

        return convertToDTO(messageModel, message.getImageIdList());
    }

    /**
     * Check if all images are not connected to any message or post
     * @param imageIdList
     * @return true if the given image id list does not contain any image that is not connected to any message or post, false otherwise
     */
    private Boolean connectImageAndMessage(List<Integer> imageIdList) {
        List<Integer> unconnectImageList = messageRepository.getUnconnectImageList();
        for (Integer imageId : imageIdList) {
            if (!unconnectImageList.contains(imageId)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Convert MessageModel to ChatReceiveMessageDTO, generate link for images
     * @param messageModel message record in database
     * @param imageIdList list of image id that need to be converted to image API
     * @return ChatReceiveMessageDTO with image API list
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
        messageDTO.setRefresh(false);
        messageDTO.setSuccess(true);

        if (imageIdList != null && imageIdList.size() > 0) {
            List<String> imageAPIList = new ArrayList<>();
            for (Integer imageId : imageIdList) {
                imageAPIList.add(imageService.deploymentGetImageAPI + imageId);
            }
            messageDTO.setImageAPIList(imageAPIList);
        }

        return messageDTO;
    }

    /**
     * Update the read at time of a message
     * @param userId user id of the user who read the message
     * @param messageIdList message id of the message that is read
     * @param topic topic of chat room
     * @throws Exception MESSAGE_ALREADY_DELETED, MESSAGE_ALREADY_READ
     */
    public void updateReadAt(Integer userId, List<Integer> messageIdList, String topic) throws Exception {
        securityService.checkUserIdWithToken(userId);
        MessageModel messageModel;
        for (Integer messageId : messageIdList) {
            messageModel = messageRepository.findById(messageId).get();
            if (!messageModel.getIsActive()) {
                ExceptionService.throwException(ExceptionService.MESSAGE_ALREADY_DELETED);
            }
            if (messageModel.getReadAt() != null) {
                ExceptionService.throwException(ExceptionService.MESSAGE_ALREADY_READ);
            }
        }
        for (Integer messageId : messageIdList) {
            messageModel = messageRepository.findById(messageId).get();
            messageModel.setReadAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
            messageRepository.save(messageModel);
        }

        ChatReceiveMessageDTO refreshMessaage = new ChatReceiveMessageDTO();
        refreshMessaage.setSuccess(true);
        refreshMessaage.setRefresh(true);
        String messageIdListString = messageIdList.stream().map(String::valueOf).collect(Collectors.joining(", "));
        refreshMessaage.setContent(messageIdListString);

        messagingTemplate.convertAndSend("/topic/" + topic, refreshMessaage);
    }

    /**
     * Mark message as inactive and delete all images that are connected to the message
     * @param userId user id of the user who wants to delete the message
     * @param messageId message id of the message to be deleted
     * @param topic topic of chat room
     * @throws Exception MESSAGE_ALREADY_DELETED, NOT_MESSAGE_SENDER_OR_RECEIVER
     */
    public void deleteMessage(Integer userId, Integer messageId, String topic) throws Exception {
        securityService.checkUserIdWithToken(userId);
        MessageModel messageModel = messageRepository.findById(messageId).get();
        if (!messageModel.getIsActive()) {
            ExceptionService.throwException(ExceptionService.MESSAGE_ALREADY_DELETED);
        }
        if (messageModel.getUserIdFrom() != userId || messageModel.getUserIdTo() != userId) {
            ExceptionService.throwException(ExceptionService.NOT_MESSAGE_SENDER_OR_RECEIVER);
        }
        messageModel.setIsActive(false);
        messageRepository.save(messageModel);

        deleteImage(messageId);

        ChatReceiveMessageDTO refreshMessaage = new ChatReceiveMessageDTO();
        refreshMessaage.setSuccess(true);
        refreshMessaage.setRefresh(true);
        refreshMessaage.setContent(messageId.toString());

        messagingTemplate.convertAndSend("/topic/" + topic, refreshMessaage);
    }

    /**
     * Delete data in Message_Image and Image_Data
     * @param messageId messageId Integer
     */
    private void deleteImage(Integer messageId) {
        List<Integer> allImageId = messageRepository.findImageIdByMessageId(messageId);
        for (Integer imageId: allImageId) {
            messageRepository.deleteInMessageImage(imageId);
            forumRepository.deleteInImageData(imageId);
        }
    }

    public List<ContactDTO> getContactList(Integer userId, List<Integer> excludingUserIdList, Integer contactNum) throws Exception {
        securityService.checkUserIdWithToken(userId);
        List<ContactDTO> contactDTOList = new ArrayList<>();
        List<MessageModel> messageModelList = messageRepository.findAllContactUsers(userId, excludingUserIdList, contactNum);
        for (MessageModel messageModel : messageModelList) {
            ContactDTO contactDTO = new ContactDTO();
            contactDTO.setMessageId(messageModel.getMessageId());
            contactDTO.setLatestMessage(messageModel.getContent());

            Integer userIdFrom = messageModel.getUserIdFrom();
            Integer userIdTo = messageModel.getUserIdTo();
            contactDTO.setUserIdFrom(userIdFrom);
            contactDTO.setUsernameFrom(userAccountRepository.findUsernameByUserId(userIdFrom));
            contactDTO.setUserIdTo(userIdTo);
            contactDTO.setUsernameTo(userAccountRepository.findUsernameByUserId(userIdTo));
            if (userId.equals(userIdFrom)) {
                contactDTO.setContactUsername(userAccountRepository.findUsernameByUserId(userIdTo));
                contactDTO.setUnreadMessageCount(messageRepository.getUnreadMessageCountByUserPair(userIdTo, userId));
            }
            else {
                contactDTO.setContactUsername(userAccountRepository.findUsernameByUserId(userIdFrom));
                contactDTO.setUnreadMessageCount(messageRepository.getUnreadMessageCountByUserPair(userIdFrom, userId));
            }

            contactDTO.setSentAt(messageModel.getSentAt());
            contactDTO.setReadAt(messageModel.getReadAt());


            contactDTOList.add(contactDTO);
        }
        return contactDTOList;
    }
}
