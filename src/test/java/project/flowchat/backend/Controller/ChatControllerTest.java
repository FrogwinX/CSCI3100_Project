package project.flowchat.backend.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatcher;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import project.flowchat.backend.Config.JWTFilter;
import project.flowchat.backend.DTO.ChatMessageDetailsDTO;
import project.flowchat.backend.DTO.ChatSendMessageDTO;
import project.flowchat.backend.DTO.ContactDTO;
import project.flowchat.backend.DTO.ResponseBodyDTO;
import project.flowchat.backend.Service.ChatService;
import project.flowchat.backend.Service.ExceptionService;
import project.flowchat.backend.Service.SecurityService;

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ChatController.class)
@AutoConfigureMockMvc
class ChatControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;
    
    // Use MockBean for all service and component dependencies
    @MockBean
    private ChatService chatService;
    
    @MockBean
    private ResponseBodyDTO responseBodyDTO;
    
    @MockBean
    private SimpMessagingTemplate messagingTemplate;
    
    @MockBean
    private SecurityService securityService;
    
    @MockBean
    private JWTFilter jwtFilter;

    // --- Argument Matcher Helper ---
    private static ArgumentMatcher<Map<String, Object>> mapContaining(String key, Object value) {
        return map -> map != null && Objects.equals(map.get(key), value);
    }

    private static ArgumentMatcher<Map<String, Object>> mapContainingExactly(Map<String, Object> expectedMap) {
        return map -> map != null && map.equals(expectedMap);
    }

    @BeforeEach
    void setUp() {
        // Configure MockMvc with proper content type handling
        mockMvc = MockMvcBuilders
            .webAppContextSetup(webApplicationContext)
            .defaultRequest(get("/").contentType(MediaType.APPLICATION_JSON))
            .build();
        
        // Reset mocks before each test
        Mockito.reset(chatService, responseBodyDTO);

        // Define default behavior for the mocked DTO
        doNothing().when(responseBodyDTO).setMessage(anyString());
        doNothing().when(responseBodyDTO).setData(any());
        
        // Mock toString to return a JSON string so content type will be set
        when(responseBodyDTO.toString()).thenReturn("{}");
    }

    // --- Tests for getContactList ---
    @Test
    void getContactList_Success() throws Exception {
        // Arrange
        Integer userId = 1;
        List<Integer> excludingList = Arrays.asList(2, 3);
        Integer contactNum = 10;

        List<ContactDTO> mockContacts = new ArrayList<>();
        ContactDTO contact1 = new ContactDTO();
        contact1.setContactUserId(4);
        contact1.setContactUsername("user4");
        contact1.setLatestMessage("Hello there");
        mockContacts.add(contact1);

        when(chatService.getContactList(userId, excludingList, contactNum)).thenReturn(mockContacts);

        // Act & Assert
        mockMvc.perform(get("/api/Chat/getContactList")
                .param("userId", userId.toString())
                .param("excludingUserIdList", "2,3")
                .param("contactNum", contactNum.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Verify service call
        verify(chatService).getContactList(userId, excludingList, contactNum);
        // Verify interactions with the mocked DTO
        verify(responseBodyDTO).setMessage("The contact list is returned");
        
        // Create expected data map for verification
        Map<String, Object> expectedData = new HashMap<>();
        expectedData.put("isSuccess", true);
        expectedData.put("contactList", mockContacts);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedData)));
    }

    @Test
    void getContactList_ServiceException() throws Exception {
        // Arrange
        Integer userId = 1;
        List<Integer> excludingList = Collections.emptyList();
        Integer contactNum = 10;
        String errorMessage = "User ID does not match JWT token";

        when(chatService.getContactList(userId, excludingList, contactNum))
                .thenThrow(new ExceptionService(errorMessage));

        // Act & Assert
        mockMvc.perform(get("/api/Chat/getContactList")
                .param("userId", userId.toString())
                .param("excludingUserIdList", "")
                .param("contactNum", contactNum.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Verify service call
        verify(chatService).getContactList(userId, excludingList, contactNum);
        // Verify interactions with the mocked DTO
        verify(responseBodyDTO).setMessage(errorMessage);
        
        Map<String, Object> expectedData = new HashMap<>();
        expectedData.put("isSuccess", false);
        expectedData.put("contactList", null);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedData)));
    }
    
    @Test
    void getContactList_GeneralException() throws Exception {
        // Arrange
        Integer userId = 1;
        List<Integer> excludingList = Collections.emptyList();
        Integer contactNum = 10;
        RuntimeException exception = new RuntimeException("Unexpected error");

        when(chatService.getContactList(userId, excludingList, contactNum))
                .thenThrow(exception);

        // Act & Assert
        mockMvc.perform(get("/api/Chat/getContactList")
                .param("userId", userId.toString())
                .param("excludingUserIdList", "")
                .param("contactNum", contactNum.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Verify service call
        verify(chatService).getContactList(userId, excludingList, contactNum);
        // Verify interactions with the mocked DTO
        verify(responseBodyDTO).setMessage("Fail: " + exception);
        verify(responseBodyDTO).setData(null);
    }
    
    // --- Tests for getMessageHistoryList ---
    @Test
    void getMessageHistoryList_Success() throws Exception {
        // Arrange
        Integer userId = 1;
        Integer contactUserId = 2;
        List<Integer> excludingMessageIdList = Arrays.asList(10, 11);
        Integer messageNum = 20;
        
        List<ChatMessageDetailsDTO> mockMessages = new ArrayList<>();
        ChatMessageDetailsDTO message = new ChatMessageDetailsDTO();
        message.setMessageId(12);
        message.setUserIdFrom(userId);
        message.setUserIdTo(contactUserId);
        message.setContent("Hello!");
        message.setSentAt("2023-05-01 14:30");
        message.setReadAt(null);
        message.setIsActive(true);
        mockMessages.add(message);
        
        when(chatService.getMessageHistoryList(userId, contactUserId, excludingMessageIdList, messageNum))
            .thenReturn(mockMessages);
            
        // Act & Assert
        mockMvc.perform(get("/api/Chat/getMessageHistoryList")
                .param("userId", userId.toString())
                .param("contactUserId", contactUserId.toString())
                .param("excludingMessageIdList", "10,11")
                .param("messageNum", messageNum.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
                
        // Verify service call
        verify(chatService).getMessageHistoryList(userId, contactUserId, excludingMessageIdList, messageNum);
        // Verify interactions with mocked DTO
        verify(responseBodyDTO).setMessage("The message history list is returned");
        
        Map<String, Object> expectedData = new HashMap<>();
        expectedData.put("isSuccess", true);
        expectedData.put("messageHistoryList", mockMessages);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedData)));
    }
    
    @Test
    void getMessageHistoryList_ServiceException() throws Exception {
        // Arrange
        Integer userId = 1;
        Integer contactUserId = 2;
        List<Integer> excludingMessageIdList = Collections.emptyList();
        Integer messageNum = 20;
        String errorMessage = "User ID does not match JWT token";
        
        when(chatService.getMessageHistoryList(userId, contactUserId, excludingMessageIdList, messageNum))
            .thenThrow(new ExceptionService(errorMessage));
            
        // Act & Assert
        mockMvc.perform(get("/api/Chat/getMessageHistoryList")
                .param("userId", userId.toString())
                .param("contactUserId", contactUserId.toString())
                .param("excludingMessageIdList", "")
                .param("messageNum", messageNum.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
                
        // Verify service call
        verify(chatService).getMessageHistoryList(userId, contactUserId, excludingMessageIdList, messageNum);
        // Verify interactions with mocked DTO
        verify(responseBodyDTO).setMessage(errorMessage);
        
        Map<String, Object> expectedData = new HashMap<>();
        expectedData.put("isSuccess", false);
        expectedData.put("messageHistoryList", null);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedData)));
    }
    
    @Test
    void getMessageHistoryList_GeneralException() throws Exception {
        // Arrange
        Integer userId = 1;
        Integer contactUserId = 2;
        List<Integer> excludingMessageIdList = Collections.emptyList();
        Integer messageNum = 20;
        RuntimeException exception = new RuntimeException("Database error");
        
        when(chatService.getMessageHistoryList(userId, contactUserId, excludingMessageIdList, messageNum))
            .thenThrow(exception);
            
        // Act & Assert
        mockMvc.perform(get("/api/Chat/getMessageHistoryList")
                .param("userId", userId.toString())
                .param("contactUserId", contactUserId.toString())
                .param("excludingMessageIdList", "")
                .param("messageNum", messageNum.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
                
        // Verify service call
        verify(chatService).getMessageHistoryList(userId, contactUserId, excludingMessageIdList, messageNum);
        // Verify interactions with mocked DTO
        verify(responseBodyDTO).setMessage("Fail: " + exception);
        verify(responseBodyDTO).setData(null);
    }
    
    // --- Tests for getUnreadMessageCount ---
    @Test
    void getUnreadMessageCount_Success() throws Exception {
        // Arrange
        Integer userId = 1;
        Integer unreadCount = 5;
        
        when(chatService.getTotalUnreadMessageCount(userId)).thenReturn(unreadCount);
        
        // Act & Assert
        mockMvc.perform(get("/api/Chat/getUnreadMessageCount")
                .param("userId", userId.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
                
        // Verify service call
        verify(chatService).getTotalUnreadMessageCount(userId);
        // Verify interactions with mocked DTO
        verify(responseBodyDTO).setMessage("The total unread message count is returned");
        
        Map<String, Object> expectedData = new HashMap<>();
        expectedData.put("isSuccess", true);
        expectedData.put("unreadMessageCount", unreadCount);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedData)));
    }
    
    @Test
    void getUnreadMessageCount_ServiceException() throws Exception {
        // Arrange
        Integer userId = 1;
        String errorMessage = "User ID does not match JWT token";
        
        when(chatService.getTotalUnreadMessageCount(userId))
            .thenThrow(new ExceptionService(errorMessage));
            
        // Act & Assert
        mockMvc.perform(get("/api/Chat/getUnreadMessageCount")
                .param("userId", userId.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
                
        // Verify service call  
        verify(chatService).getTotalUnreadMessageCount(userId);
        // Verify interactions with mocked DTO
        verify(responseBodyDTO).setMessage(errorMessage);
        
        Map<String, Object> expectedData = new HashMap<>();
        expectedData.put("isSuccess", false);
        expectedData.put("unreadMessageCount", null);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedData)));
    }
    
    @Test
    void getUnreadMessageCount_GeneralException() throws Exception {
        // Arrange
        Integer userId = 1;
        RuntimeException exception = new RuntimeException("Database connection failed");
        
        when(chatService.getTotalUnreadMessageCount(userId))
            .thenThrow(exception);
            
        // Act & Assert
        mockMvc.perform(get("/api/Chat/getUnreadMessageCount")
                .param("userId", userId.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
                
        // Verify service call
        verify(chatService).getTotalUnreadMessageCount(userId);
        // Verify interactions with mocked DTO
        verify(responseBodyDTO).setMessage("Fail: " + exception);
        verify(responseBodyDTO).setData(null);
    }
}