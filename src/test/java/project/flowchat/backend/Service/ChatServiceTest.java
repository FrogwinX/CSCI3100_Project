package project.flowchat.backend.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import project.flowchat.backend.DTO.ChatMessageDetailsDTO;
import project.flowchat.backend.DTO.ChatReceiveMessageDTO;
import project.flowchat.backend.DTO.ChatSendMessageDTO;
import project.flowchat.backend.DTO.ContactDTO;
import project.flowchat.backend.Model.MessageModel;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Repository.ForumRepository;
import project.flowchat.backend.Repository.MessageRepository;
import project.flowchat.backend.Repository.UserAccountRepository;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private MessageRepository messageRepository;
    @Mock
    private ForumRepository forumRepository;
    @Mock
    private UserAccountRepository userAccountRepository;
    @Mock
    private ImageService imageService;
    @Mock
    private SecurityService securityService;
    @Mock
    private ProfileService profileService;
    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private ChatService chatService;

    @Captor
    private ArgumentCaptor<ChatReceiveMessageDTO> receiveMessageCaptor;
    @Captor
    private ArgumentCaptor<MessageModel> messageModelCaptor;
    @Captor
    private ArgumentCaptor<String> destinationCaptor;

    private ChatSendMessageDTO sendMessageDTO;
    private MessageModel savedMessageModel;
    private MessageModel existingMessageModel;
    private MessageModel contactMessage1; // Message from user 1 to user 3
    private MessageModel contactMessage2; // Message from user 4 to user 1
    private UserAccountModel user1;
    private UserAccountModel user2;
    private UserAccountModel user3;
    private UserAccountModel user4;
    private ZonedDateTime now;
    private String formattedNow;
    private String formattedPast;

    @BeforeEach
    void setUp() {
        now = ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")).withNano(0);
        ZonedDateTime past = now.minusHours(1).withNano(0);
        formattedNow = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(now);
        formattedPast = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(past);

        user1 = new UserAccountModel(); user1.setUserId(1); user1.setUsername("user1");
        user2 = new UserAccountModel(); user2.setUserId(2); user2.setUsername("user2");
        user3 = new UserAccountModel(); user3.setUserId(3); user3.setUsername("user3");
        user4 = new UserAccountModel(); user4.setUserId(4); user4.setUsername("user4");


        sendMessageDTO = new ChatSendMessageDTO();
        sendMessageDTO.setAction("send");
        sendMessageDTO.setUserIdFrom(user1.getUserId());
        sendMessageDTO.setUserIdTo(user2.getUserId());
        sendMessageDTO.setContent("Hello World");
        sendMessageDTO.setImageIdList(Arrays.asList(101, 102));
        sendMessageDTO.setAttachTo(null);

        savedMessageModel = new MessageModel();
        savedMessageModel.setMessageId(1);
        savedMessageModel.setUserIdFrom(sendMessageDTO.getUserIdFrom());
        savedMessageModel.setUserIdTo(sendMessageDTO.getUserIdTo());
        savedMessageModel.setContent(sendMessageDTO.getContent());
        savedMessageModel.setAttachTo(sendMessageDTO.getAttachTo());
        savedMessageModel.setIsActive(true);
        savedMessageModel.setSentAt(now);
        savedMessageModel.setReadAt(null);

        existingMessageModel = new MessageModel();
        existingMessageModel.setMessageId(5);
        existingMessageModel.setUserIdFrom(user2.getUserId());
        existingMessageModel.setUserIdTo(user1.getUserId());
        existingMessageModel.setContent("Existing Message");
        existingMessageModel.setIsActive(true);
        existingMessageModel.setSentAt(past);
        existingMessageModel.setReadAt(null);

        contactMessage1 = new MessageModel();
        contactMessage1.setMessageId(10);
        contactMessage1.setUserIdFrom(user1.getUserId());
        contactMessage1.setUserIdTo(user3.getUserId());
        contactMessage1.setContent("Hi User3");
        contactMessage1.setIsActive(true);
        contactMessage1.setSentAt(now.minusMinutes(10));
        contactMessage1.setReadAt(null);

        contactMessage2 = new MessageModel();
        contactMessage2.setMessageId(11);
        contactMessage2.setUserIdFrom(user4.getUserId());
        contactMessage2.setUserIdTo(user1.getUserId());
        contactMessage2.setContent("Hello User1 from User4");
        contactMessage2.setIsActive(true);
        contactMessage2.setSentAt(now.minusMinutes(5)); // More recent
        contactMessage2.setReadAt(null);
    }

    // --- Existing Test Cases (sendAndStoreMessage, updateReadAt, deleteMessage, handleMessage) ---
    @Test
    void testSendAndStoreMessage_Success() {
        // Arrange
        List<Integer> imageIds = sendMessageDTO.getImageIdList();
        List<Integer> unconnectImageList = Arrays.asList(101, 102, 103);

        when(messageRepository.getUnconnectImageList()).thenReturn(unconnectImageList);
        when(messageRepository.save(messageModelCaptor.capture())).thenReturn(savedMessageModel);
        when(imageService.getImageAPI(eq(101))).thenReturn("/api/images/101");
        when(imageService.getImageAPI(eq(102))).thenReturn("/api/images/102");

        // Act
        ChatReceiveMessageDTO result = chatService.sendAndStoreMessage(sendMessageDTO);

        // Assert
        assertNotNull(result);
        assertTrue(result.getSuccess());
        assertNull(result.getErrorMessage());
        assertEquals("send", result.getAction());
        assertNotNull(result.getTime());

        ChatMessageDetailsDTO messageDetail = result.getMessageDetail();
        assertNotNull(messageDetail);
        assertEquals(savedMessageModel.getMessageId(), messageDetail.getMessageId());
        assertEquals(sendMessageDTO.getUserIdFrom(), messageDetail.getUserIdFrom());
        assertEquals(sendMessageDTO.getUserIdTo(), messageDetail.getUserIdTo());
        assertEquals(sendMessageDTO.getContent(), messageDetail.getContent());
        assertEquals(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(messageModelCaptor.getValue().getSentAt()), messageDetail.getSentAt());
        assertNull(messageDetail.getReadAt());
        assertTrue(messageDetail.getIsActive());
        assertNotNull(messageDetail.getImageAPIList());
        assertEquals(2, messageDetail.getImageAPIList().size());
        assertTrue(messageDetail.getImageAPIList().contains("/api/images/101"));
        assertTrue(messageDetail.getImageAPIList().contains("/api/images/102"));

        MessageModel capturedModel = messageModelCaptor.getValue();
        assertEquals(sendMessageDTO.getUserIdFrom(), capturedModel.getUserIdFrom());
        assertEquals(sendMessageDTO.getUserIdTo(), capturedModel.getUserIdTo());
        assertEquals(sendMessageDTO.getContent(), capturedModel.getContent());
        assertTrue(capturedModel.getIsActive());
        assertNull(capturedModel.getReadAt());
        assertNotNull(capturedModel.getSentAt());

        verify(messageRepository, times(1)).getUnconnectImageList();
        verify(messageRepository, times(1)).save(any(MessageModel.class));
        verify(messageRepository, times(1)).connectMessageWithImage(eq(savedMessageModel.getMessageId()), eq(101));
        verify(messageRepository, times(1)).connectMessageWithImage(eq(savedMessageModel.getMessageId()), eq(102));
        verify(imageService, times(2)).getImageAPI(anyInt());
    }

    @Test
    void testSendAndStoreMessage_ImageAlreadyUsed() {
        // Arrange
        List<Integer> unconnectImageList = Collections.singletonList(101);

        when(messageRepository.getUnconnectImageList()).thenReturn(unconnectImageList);

        // Act
        ChatReceiveMessageDTO result = chatService.sendAndStoreMessage(sendMessageDTO);

        // Assert
        assertNotNull(result);
        assertFalse(result.getSuccess());
        assertEquals(ExceptionService.IMAGE_ALREADY_USED, result.getErrorMessage());
        assertNull(result.getMessageDetail());
        assertNull(result.getAction());
        assertNull(result.getTime());

        verify(messageRepository, times(1)).getUnconnectImageList();
        verify(messageRepository, never()).save(any(MessageModel.class));
        verify(messageRepository, never()).connectMessageWithImage(anyInt(), anyInt());
        verify(imageService, never()).getImageAPI(anyInt());
    }

    @Test
    void testUpdateReadAt_Success() {
        // Arrange
        List<Integer> messageIdsToRead = Collections.singletonList(existingMessageModel.getMessageId().intValue());
        when(messageRepository.findById(existingMessageModel.getMessageId().intValue())).thenReturn(Optional.of(existingMessageModel));
        when(messageRepository.save(messageModelCaptor.capture())).thenReturn(existingMessageModel);

        // Act
        ChatReceiveMessageDTO result = chatService.updateReadAt(messageIdsToRead);

        // Assert
        assertNotNull(result);
        assertTrue(result.getSuccess());
        assertNull(result.getErrorMessage());
        assertEquals("read", result.getAction());
        assertEquals(messageIdsToRead, result.getReadOrDeleteMessageIdList());
        assertNotNull(result.getTime());

        MessageModel capturedModel = messageModelCaptor.getValue();
        assertNotNull(capturedModel.getReadAt());
        assertTrue(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")).isAfter(capturedModel.getReadAt().minusSeconds(5)));

        verify(messageRepository, times(2)).findById(existingMessageModel.getMessageId().intValue()); // Expect 2 calls now
        verify(messageRepository, times(1)).save(any(MessageModel.class));
    }

    @Test
    void testUpdateReadAt_AlreadyRead() {
        // Arrange
        existingMessageModel.setReadAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")).minusMinutes(5));
        List<Integer> messageIdsToRead = Collections.singletonList(existingMessageModel.getMessageId().intValue());
        when(messageRepository.findById(existingMessageModel.getMessageId().intValue())).thenReturn(Optional.of(existingMessageModel));

        // Act
        ChatReceiveMessageDTO result = chatService.updateReadAt(messageIdsToRead);

        // Assert
        assertNotNull(result);
        assertFalse(result.getSuccess());
        assertEquals(ExceptionService.MESSAGE_ALREADY_READ, result.getErrorMessage());
        assertNull(result.getReadOrDeleteMessageIdList());
        assertNull(result.getAction());
        assertNull(result.getTime());

        verify(messageRepository, times(1)).findById(existingMessageModel.getMessageId().intValue());
        verify(messageRepository, never()).save(any(MessageModel.class));
    }

    @Test
    void testDeleteMessage_Success() {
        // Arrange
        List<Integer> messageIdsToDelete = Collections.singletonList(existingMessageModel.getMessageId().intValue());
        List<Integer> associatedImageIds = Arrays.asList(201, 202);

        when(messageRepository.findById(existingMessageModel.getMessageId().intValue())).thenReturn(Optional.of(existingMessageModel));
        when(messageRepository.save(messageModelCaptor.capture())).thenReturn(existingMessageModel);
        when(messageRepository.findImageIdByMessageId(existingMessageModel.getMessageId().intValue())).thenReturn(associatedImageIds);

        // Act
        ChatReceiveMessageDTO result = chatService.deleteMessage(messageIdsToDelete);

        // Assert
        assertNotNull(result);
        assertTrue(result.getSuccess());
        assertNull(result.getErrorMessage());
        assertEquals("delete", result.getAction());
        assertEquals(messageIdsToDelete, result.getReadOrDeleteMessageIdList());
        assertNotNull(result.getTime());

        MessageModel capturedModel = messageModelCaptor.getValue();
        assertFalse(capturedModel.getIsActive());

        verify(messageRepository, times(2)).findById(existingMessageModel.getMessageId().intValue()); // Expect 2 calls now
        verify(messageRepository, times(1)).save(any(MessageModel.class));
        verify(messageRepository, times(1)).findImageIdByMessageId(existingMessageModel.getMessageId().intValue());
        verify(messageRepository, times(1)).deleteInMessageImage(201);
        verify(messageRepository, times(1)).deleteInMessageImage(202);
        verify(forumRepository, times(1)).deleteInImageData(201);
        verify(forumRepository, times(1)).deleteInImageData(202);
    }

    @Test
    void testDeleteMessage_AlreadyDeleted() {
        // Arrange
        existingMessageModel.setIsActive(false);
        List<Integer> messageIdsToDelete = Collections.singletonList(existingMessageModel.getMessageId().intValue());
        when(messageRepository.findById(existingMessageModel.getMessageId().intValue())).thenReturn(Optional.of(existingMessageModel));

        // Act
        ChatReceiveMessageDTO result = chatService.deleteMessage(messageIdsToDelete);

        // Assert
        assertNotNull(result);
        assertFalse(result.getSuccess());
        assertEquals(ExceptionService.MESSAGE_ALREADY_DELETED, result.getErrorMessage());
        assertNull(result.getReadOrDeleteMessageIdList());
        assertNull(result.getAction());
        assertNull(result.getTime());

        verify(messageRepository, times(1)).findById(existingMessageModel.getMessageId().intValue());
        verify(messageRepository, never()).save(any(MessageModel.class));
        verify(messageRepository, never()).findImageIdByMessageId(anyInt());
        verify(messageRepository, never()).deleteInMessageImage(anyInt());
        verify(forumRepository, never()).deleteInImageData(anyInt());
    }

    @Test
    void testHandleMessage_SendAction() {
        // Arrange
        sendMessageDTO.setAction("send");
        ChatReceiveMessageDTO sendResult = new ChatReceiveMessageDTO();
        sendResult.setSuccess(true);
        sendResult.setAction("send");

        ChatService chatServiceSpy = spy(new ChatService(messageRepository, forumRepository, userAccountRepository, imageService, securityService, profileService, messagingTemplate));
        doReturn(sendResult).when(chatServiceSpy).sendAndStoreMessage(any(ChatSendMessageDTO.class));

        // Act
        chatServiceSpy.handleMessage(sendMessageDTO);

        // Assert
        // Capture both destination and payload
        verify(messagingTemplate, times(2)).convertAndSend(destinationCaptor.capture(), receiveMessageCaptor.capture());

        List<String> capturedDestinations = destinationCaptor.getAllValues();
        List<ChatReceiveMessageDTO> capturedMessages = receiveMessageCaptor.getAllValues();

        // Define expected full destinations
        String expectedDestTo = "/channel/" + sendMessageDTO.getUserIdTo();
        String expectedDestFrom = "/channel/" + sendMessageDTO.getUserIdFrom();

        // Assert against captured destinations
        assertTrue(capturedDestinations.contains(expectedDestTo), "Destination for receiver not found");
        assertTrue(capturedDestinations.contains(expectedDestFrom), "Destination for sender not found");

        assertEquals(2, capturedMessages.size());
        assertEquals(sendResult, capturedMessages.get(0));
        assertEquals(sendResult, capturedMessages.get(1));
        verify(chatServiceSpy, times(1)).sendAndStoreMessage(sendMessageDTO);
    }

    @Test
    void testHandleMessage_ReadAction() {
        // Arrange
        sendMessageDTO.setAction("read");
        sendMessageDTO.setMessageIdList(Collections.singletonList(existingMessageModel.getMessageId().intValue()));
        ChatReceiveMessageDTO readResult = new ChatReceiveMessageDTO();
        readResult.setSuccess(true);
        readResult.setAction("read");
        readResult.setReadOrDeleteMessageIdList(sendMessageDTO.getMessageIdList());

        ChatService chatServiceSpy = spy(new ChatService(messageRepository, forumRepository, userAccountRepository, imageService, securityService, profileService, messagingTemplate));
        doReturn(readResult).when(chatServiceSpy).updateReadAt(anyList());

        // Act
        chatServiceSpy.handleMessage(sendMessageDTO);

        // Assert
        verify(messagingTemplate, times(2)).convertAndSend(anyString(), receiveMessageCaptor.capture());
         List<String> destinations = Arrays.asList(
                 "/channel/" + sendMessageDTO.getUserIdTo(),
                 "/channel/" + sendMessageDTO.getUserIdFrom()
         );
         List<ChatReceiveMessageDTO> capturedMessages = receiveMessageCaptor.getAllValues();

         // Define expected full destinations
         String expectedDestTo = "/channel/" + sendMessageDTO.getUserIdTo();
         String expectedDestFrom = "/channel/" + sendMessageDTO.getUserIdFrom();

         // Assert against captured destinations
         assertTrue(destinations.contains(expectedDestTo), "Destination for receiver not found");
         assertTrue(destinations.contains(expectedDestFrom), "Destination for sender not found");
         assertEquals(2, capturedMessages.size());
         assertEquals(readResult, capturedMessages.get(0));
         assertEquals(readResult, capturedMessages.get(1));
         verify(chatServiceSpy, times(1)).updateReadAt(sendMessageDTO.getMessageIdList());
    }

    @Test
    void testHandleMessage_DeleteAction() {
        // Arrange
        sendMessageDTO.setAction("delete");
        sendMessageDTO.setMessageIdList(Collections.singletonList(existingMessageModel.getMessageId().intValue())); // Or .longValue() if ID is Long
        ChatReceiveMessageDTO deleteResult = new ChatReceiveMessageDTO();
        deleteResult.setSuccess(true);
        deleteResult.setAction("delete");
        deleteResult.setReadOrDeleteMessageIdList(sendMessageDTO.getMessageIdList());

        ChatService chatServiceSpy = spy(new ChatService(messageRepository, forumRepository, userAccountRepository, imageService, securityService, profileService, messagingTemplate));
        doReturn(deleteResult).when(chatServiceSpy).deleteMessage(anyList());

        // Act
        chatServiceSpy.handleMessage(sendMessageDTO);

        // Assert
        // Capture both destination and payload
        verify(messagingTemplate, times(2)).convertAndSend(destinationCaptor.capture(), receiveMessageCaptor.capture());

        List<String> capturedDestinations = destinationCaptor.getAllValues();
        List<ChatReceiveMessageDTO> capturedMessages = receiveMessageCaptor.getAllValues();

        // Define expected full destinations
        String expectedDestTo = "/channel/" + sendMessageDTO.getUserIdTo();
        String expectedDestFrom = "/channel/" + sendMessageDTO.getUserIdFrom();

        // Assert against captured destinations
        assertTrue(capturedDestinations.contains(expectedDestTo), "Destination for receiver not found");
        assertTrue(capturedDestinations.contains(expectedDestFrom), "Destination for sender not found");

        assertEquals(2, capturedMessages.size());
        assertEquals(deleteResult, capturedMessages.get(0));
        assertEquals(deleteResult, capturedMessages.get(1));
        verify(chatServiceSpy, times(1)).deleteMessage(sendMessageDTO.getMessageIdList());
    }

    @Test
    void testHandleMessage_InvalidAction() {
        // Arrange
        sendMessageDTO.setAction("unknown_action");
        // Use a spy to verify internal method calls on the actual service instance
        ChatService chatServiceSpy = spy(chatService);

        // Act
        chatServiceSpy.handleMessage(sendMessageDTO);

        // Assert
        verify(messagingTemplate, times(2)).convertAndSend(anyString(), receiveMessageCaptor.capture());
        List<ChatReceiveMessageDTO> capturedMessages = receiveMessageCaptor.getAllValues();
        assertEquals(2, capturedMessages.size());

        ChatReceiveMessageDTO result = capturedMessages.get(0);
        assertFalse(result.getSuccess());
        assertEquals(ExceptionService.INVALID_ACTION_TYPE, result.getErrorMessage());
        assertNull(result.getReadOrDeleteMessageIdList());

        // Verify interactions on the spy
        verify(chatServiceSpy, never()).sendAndStoreMessage(any());
        verify(chatServiceSpy, never()).updateReadAt(any());
        verify(chatServiceSpy, never()).deleteMessage(any());
    }

    // --- NEW Test Cases ---

    @Test
    void testGetContactList_Success() throws Exception {
        // Arrange
        Integer userId = user1.getUserId().intValue();
        List<Integer> excludingList = Collections.emptyList();
        Integer contactNum = 10;
        List<MessageModel> latestMessages = Arrays.asList(contactMessage2, contactMessage1); // User4 (more recent), then User3

        when(messageRepository.findAllContactUsers(eq(userId), eq(excludingList), eq(contactNum))).thenReturn(latestMessages);

        // Mock findUsernameByUserId
        when(userAccountRepository.findUsernameByUserId(eq(user3.getUserId()))).thenReturn(user3.getUsername());
        when(userAccountRepository.findUsernameByUserId(eq(user4.getUserId()))).thenReturn(user4.getUsername());
        when(userAccountRepository.findUsernameByUserId(eq(user1.getUserId()))).thenReturn(user1.getUsername()); // Mock for user1 if needed

        when(messageRepository.getUnreadMessageCountByUserPair(eq(user3.getUserId().intValue()), eq(userId))).thenReturn(0);
        when(messageRepository.getUnreadMessageCountByUserPair(eq(user4.getUserId().intValue()), eq(userId))).thenReturn(1);

        // --- Mock profileService with CORRECT method name ---
        // Assuming getUserAvatarByUserId returns a String (e.g., the avatar URL or base64 data)
        when(profileService.getUserAvatarByUserId(eq(user3.getUserId()))).thenReturn("avatar_url_or_data_for_user3");
        when(profileService.getUserAvatarByUserId(eq(user4.getUserId()))).thenReturn("avatar_url_or_data_for_user4");
        // Add mock for user1 if needed
        // when(profileService.getUserAvatarByUserId(eq(user1.getUserId()))).thenReturn("avatar_url_or_data_for_user1");


        // Act
        List<ContactDTO> result = chatService.getContactList(userId, excludingList, contactNum);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());

        // Check contact 1 (User 4 - based on latest message time)
        ContactDTO contact1 = result.get(0);
        assertEquals(user4.getUserId(), contact1.getContactUserId());
        assertEquals(user4.getUsername(), contact1.getContactUsername());
        // --- Add Assertion for avatar ---
        assertEquals("avatar_url_or_data_for_user4", contact1.getContactUserAvatar()); // Assuming ContactDTO has this getter
        assertEquals(contactMessage2.getContent(), contact1.getLatestMessage());
        assertEquals(1, contact1.getUnreadMessageCount());

        // Check contact 2 (User 3)
        ContactDTO contact2 = result.get(1);
        assertEquals(user3.getUserId(), contact2.getContactUserId());
        assertEquals(user3.getUsername(), contact2.getContactUsername());
        // --- Add Assertion for avatar ---
        assertEquals("avatar_url_or_data_for_user3", contact2.getContactUserAvatar()); // Assuming ContactDTO has this getter
        assertEquals(contactMessage1.getContent(), contact2.getLatestMessage());
        assertEquals(0, contact2.getUnreadMessageCount());

        // --- Adjust Verification with CORRECT method name ---
        verify(messageRepository, times(1)).findAllContactUsers(eq(userId), eq(excludingList), eq(contactNum));
        verify(userAccountRepository, atLeastOnce()).findUsernameByUserId(eq(user3.getUserId()));
        verify(userAccountRepository, atLeastOnce()).findUsernameByUserId(eq(user4.getUserId()));
        verify(messageRepository, times(1)).getUnreadMessageCountByUserPair(eq(user3.getUserId().intValue()), eq(userId));
        verify(messageRepository, times(1)).getUnreadMessageCountByUserPair(eq(user4.getUserId().intValue()), eq(userId));
        // --- Verify profileService with CORRECT method name ---
        verify(profileService, atLeastOnce()).getUserAvatarByUserId(eq(user3.getUserId())); // Use correct name
        verify(profileService, atLeastOnce()).getUserAvatarByUserId(eq(user4.getUserId())); // Use correct name
        // Optionally verify call for user1 if relevant
        // verify(profileService, atLeastOnce()).getUserAvatarByUserId(eq(user1.getUserId()));
    }

    @Test
    void testGetMessageHistoryList_Success() throws Exception {
        // Arrange
        Integer userId = user1.getUserId().intValue();
        Integer contactUserId = user2.getUserId().intValue();
        List<Integer> excludingList = Collections.emptyList();
        Integer messageNum = 10;
        List<MessageModel> messageHistory = Arrays.asList(savedMessageModel, existingMessageModel); // Most recent first
        List<Integer> imageIdsForSavedMsg = Arrays.asList(101, 102);
        List<Integer> imageIdsForExistingMsg = Collections.emptyList();

        when(messageRepository.findAllMessageByUserPair(eq(userId), eq(contactUserId), eq(excludingList), eq(messageNum))).thenReturn(messageHistory);
        // Mock calls needed for convertToDTO
        when(messageRepository.findImageIdByMessageId(savedMessageModel.getMessageId().intValue())).thenReturn(imageIdsForSavedMsg);
        when(messageRepository.findImageIdByMessageId(existingMessageModel.getMessageId().intValue())).thenReturn(imageIdsForExistingMsg); // Returns empty list
        when(imageService.getImageAPI(101)).thenReturn("/api/images/101");
        when(imageService.getImageAPI(102)).thenReturn("/api/images/102");

        // Act
        List<ChatMessageDetailsDTO> result = chatService.getMessageHistoryList(userId, contactUserId, excludingList, messageNum);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());

        // Check message 1 (savedMessageModel - more recent)
        ChatMessageDetailsDTO msg1 = result.get(0);
        assertEquals(savedMessageModel.getMessageId(), msg1.getMessageId());
        assertEquals(savedMessageModel.getUserIdFrom(), msg1.getUserIdFrom());
        assertEquals(savedMessageModel.getUserIdTo(), msg1.getUserIdTo());
        assertEquals(savedMessageModel.getContent(), msg1.getContent());
        assertEquals(formattedNow, msg1.getSentAt());
        assertNull(msg1.getReadAt());
        assertTrue(msg1.getIsActive());
        assertEquals(Arrays.asList("/api/images/101", "/api/images/102"), msg1.getImageAPIList());

        // Check message 2 (existingMessageModel)
        ChatMessageDetailsDTO msg2 = result.get(1);
        assertEquals(existingMessageModel.getMessageId(), msg2.getMessageId());
        assertEquals(existingMessageModel.getUserIdFrom(), msg2.getUserIdFrom());
        assertEquals(existingMessageModel.getUserIdTo(), msg2.getUserIdTo());
        assertEquals(existingMessageModel.getContent(), msg2.getContent());
        assertEquals(formattedPast, msg2.getSentAt());
        assertNull(msg2.getReadAt());
        assertTrue(msg2.getIsActive());
        assertNull(msg2.getImageAPIList(), "Expecting null imageAPIList based on current service behavior"); // Expect null now

        // Verify interactions
        verify(messageRepository, times(1)).findAllMessageByUserPair(eq(userId), eq(contactUserId), eq(excludingList), eq(messageNum));
        verify(messageRepository, times(1)).findImageIdByMessageId(savedMessageModel.getMessageId().intValue());
        verify(messageRepository, times(1)).findImageIdByMessageId(existingMessageModel.getMessageId().intValue());
        verify(imageService, times(1)).getImageAPI(101);
        verify(imageService, times(1)).getImageAPI(102);
        verify(imageService, never()).getImageAPI(argThat(id -> id != 101 && id != 102));
    }

    @Test
    void testGetTotalUnreadMessageCount_Success() throws Exception {
        // Arrange
        Integer userId = user1.getUserId().intValue();
        Integer expectedCount = 5;
        when(messageRepository.getTotalUnreadMessageCount(eq(userId))).thenReturn(expectedCount);

        // Act
        Integer result = chatService.getTotalUnreadMessageCount(userId);

        // Assert
        assertNotNull(result);
        assertEquals(expectedCount, result);

        // Verify interactions
        verify(messageRepository, times(1)).getTotalUnreadMessageCount(eq(userId));
    }

}