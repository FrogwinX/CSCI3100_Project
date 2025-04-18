package project.flowchat.backend.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import project.flowchat.backend.DTO.ChatMessageDetailsDTO;
import project.flowchat.backend.DTO.ChatReceiveMessageDTO;
import project.flowchat.backend.DTO.ChatSendMessageDTO;
import project.flowchat.backend.DTO.ContactDTO;
import project.flowchat.backend.Model.MessageModel;
import project.flowchat.backend.Repository.ForumRepository;
import project.flowchat.backend.Repository.MessageRepository;
import project.flowchat.backend.Repository.UserAccountRepository;
import project.flowchat.backend.Repository.UserProfileRepository;

@AllArgsConstructor
@Service
public class ChatService {

    @Autowired
    private final MessageRepository messageRepository;
    private final ForumRepository forumRepository;
    private final UserAccountRepository userAccountRepository;
    private final ImageService imageService;
    private final SecurityService securityService;
    private final ProfileService profileService;
    private SimpMessagingTemplate messagingTemplate;

    public void handleMessage(ChatSendMessageDTO message) {
        ChatReceiveMessageDTO returnMessage = new ChatReceiveMessageDTO();
        switch (message.getAction()) {
            case "send" -> returnMessage = sendAndStoreMessage(message);
            case "read" -> returnMessage = updateReadAt(message.getMessageIdList());
            case "delete" -> returnMessage = deleteMessage(message.getMessageIdList());
            default -> {
                returnMessage.setSuccess(false);
                returnMessage.setErrorMessage(ExceptionService.INVALID_ACTION_TYPE);
            }
        }

        messagingTemplate.convertAndSend("/channel/" + message.getUserIdTo(), returnMessage);
        messagingTemplate.convertAndSend("/channel/" + message.getUserIdFrom(), returnMessage);
    }


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

        ChatReceiveMessageDTO returnMessage = new ChatReceiveMessageDTO();
        if (!connectImageAndMessage(message.getImageIdList())) {
            returnMessage.setSuccess(false);
            returnMessage.setErrorMessage(ExceptionService.IMAGE_ALREADY_USED);
            return returnMessage;
        }
        messageModel = messageRepository.save(messageModel);

        for (Integer imageId: message.getImageIdList()) {
            messageRepository.connectMessageWithImage(messageModel.getMessageId(), imageId);
        }

        returnMessage.setSuccess(true);
        returnMessage.setMessageDetail(convertToDTO(messageModel, message.getImageIdList()));
        returnMessage.setAction(message.getAction());
        returnMessage.setTime(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));

        return returnMessage;
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
     * Convert MessageModel to ChatMessageDetailsDTO, generate link for images
     * @param messageModel message record in database
     * @param imageIdList list of image id that need to be converted to image API
     * @return ChatMessageDetailsDTO with image API list
     */
    private ChatMessageDetailsDTO convertToDTO(MessageModel messageModel, List<Integer> imageIdList) {
        ChatMessageDetailsDTO messageDTO = new ChatMessageDetailsDTO();
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
                imageAPIList.add(imageService.getImageAPI(imageId));
            }
            messageDTO.setImageAPIList(imageAPIList);
        }

        return messageDTO;
    }

    /**
     * Update the read at time of a message, and return the message id list of the messages that are read.
     * May have error in message: MESSAGE_ALREADY_DELETED, MESSAGE_ALREADY_READ
     * @param messageIdList message id list of message being read
     */
    public ChatReceiveMessageDTO updateReadAt(List<Integer> messageIdList){
        MessageModel messageModel;
        ChatReceiveMessageDTO returnMessage  = new ChatReceiveMessageDTO();
        for (Integer messageId : messageIdList) {
            messageModel = messageRepository.findById(messageId).get();
            if (!messageModel.getIsActive()) {
                returnMessage.setSuccess(false);
                returnMessage.setErrorMessage(ExceptionService.MESSAGE_ALREADY_DELETED);
                return returnMessage;
            }
            if (messageModel.getReadAt() != null) {
                returnMessage.setSuccess(false);
                returnMessage.setErrorMessage(ExceptionService.MESSAGE_ALREADY_READ);
                return returnMessage;
            }
        }
        for (Integer messageId : messageIdList) {
            messageModel = messageRepository.findById(messageId).get();
            messageModel.setReadAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
            messageRepository.save(messageModel);
        }

        returnMessage.setSuccess(true);
        returnMessage.setReadOrDeleteMessageIdList(messageIdList);
        returnMessage.setAction("read");
        returnMessage.setTime(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));

        return returnMessage;
    }

    /**
     * Mark message as inactive and delete all images that are connected to the message
     * May have error in message: MESSAGE_ALREADY_DELETED
     * @param messageIdList message id list of the messages to be deleted
     */
    public ChatReceiveMessageDTO deleteMessage(List<Integer> messageIdList) {
        MessageModel messageModel;
        ChatReceiveMessageDTO returnMessage = new ChatReceiveMessageDTO();

        for (Integer messageId : messageIdList) {
            messageModel = messageRepository.findById(messageId).get();
            if (!messageModel.getIsActive()) {
                returnMessage.setSuccess(false);
                returnMessage.setErrorMessage(ExceptionService.MESSAGE_ALREADY_DELETED);
                return returnMessage;
            }
        }

        for (Integer messageId : messageIdList) {
            messageModel = messageRepository.findById(messageId).get();
            messageModel.setIsActive(false);
            messageRepository.save(messageModel);
            deleteImage(messageId);
        }

        returnMessage.setSuccess(true);
        returnMessage.setReadOrDeleteMessageIdList(messageIdList);
        returnMessage.setAction("delete");
        returnMessage.setTime(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));

        return returnMessage;
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

    /**
     * Get a list of contact users that chatted with the userId before
     * @param userId userId Integer
     * @param excludingUserIdList a list of userId that have already retrieved
     * @param contactNum query number of contact user
     * @return List of ContactDTO
     * @throws Exception any Exception
     */
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
                contactDTO.setContactUserId(userIdTo);
                contactDTO.setContactUsername(userAccountRepository.findUsernameByUserId(userIdTo));
                contactDTO.setContactUserAvatar(profileService.getUserAvatarByUserId(userIdTo));
                contactDTO.setUnreadMessageCount(messageRepository.getUnreadMessageCountByUserPair(userIdTo, userId));
            }
            else {
                contactDTO.setContactUserId(userIdFrom);
                contactDTO.setContactUsername(userAccountRepository.findUsernameByUserId(userIdFrom));
                contactDTO.setContactUserAvatar(profileService.getUserAvatarByUserId(userIdFrom));
                contactDTO.setUnreadMessageCount(messageRepository.getUnreadMessageCountByUserPair(userIdFrom, userId));
            }

            contactDTO.setSentAt(messageModel.getSentAt());
            contactDTO.setReadAt(messageModel.getReadAt());


            contactDTOList.add(contactDTO);
        }
        return contactDTOList;
    }

    /**
     * Get a list of messages that the userId chatted with the contactUserId before
     * @param userId userId Integer
     * @param contactUserId contactUserId Integer
     * @param excludingMessageIdList a list of messageId that have already retrieved
     * @param messageNum query number of message
     * @return List of ChatMessageDetailsDTO
     * @throws Exception any Exception
     */
    public List<ChatMessageDetailsDTO> getMessageHistoryList(Integer userId, Integer contactUserId, List<Integer> excludingMessageIdList, Integer messageNum) throws Exception {
        List<ChatMessageDetailsDTO> chatMessageDetailsDTOList = new ArrayList<>();
        List<MessageModel> findAllMessageByUserPair = messageRepository.findAllMessageByUserPair(userId, contactUserId, excludingMessageIdList, messageNum);
        for (MessageModel messageModel : findAllMessageByUserPair) {
            chatMessageDetailsDTOList.add(convertToDTO(messageModel, messageRepository.findImageIdByMessageId(messageModel.getMessageId())));
        }
        return chatMessageDetailsDTOList;
    }

    /**
     * Get the total number of unread message count of a user
     * @param userId userId Integer
     * @return total number of unread message count of a user
     * @throws Exception any Exception
     */
    public Integer getTotalUnreadMessageCount(Integer userId) throws Exception {
        securityService.checkUserIdWithToken(userId);
        return messageRepository.getTotalUnreadMessageCount(userId);
    }
}
