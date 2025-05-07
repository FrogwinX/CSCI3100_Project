package project.flowchat.backend.Controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.RestTemplateXhrTransport;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.SockJsClient;

import project.flowchat.backend.Model.MessageModel;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Repository.MessageRepository;
import project.flowchat.backend.Repository.UserAccountRepository;
import project.flowchat.backend.Service.ProfileService;
import project.flowchat.backend.Service.SecurityService;
import project.flowchat.backend.Config.JwtChannelInterceptor;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb_chat;MODE=MSSQLServer;DB_CLOSE_DELAY=-1", 
    "spring.datasource.driverClassName=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=none",
    "spring.datasource.initialization-mode=always",
    "spring.datasource.schema=classpath:schema.sql",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
class ChatControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private MockMvc mockMvc;


    @Autowired
    private UserAccountRepository userRepo;

    @Autowired
    private MessageRepository msgRepo;

    @MockBean
    private SecurityService securityService;

    @MockBean
    private ProfileService profileService;

    @MockBean
    private JwtChannelInterceptor jwtChannelInterceptor;

    private WebSocketStompClient stompClient;

    private Integer aliceId;
    private Integer bobId;
    private Integer msg1Id;
    private Integer msg2Id;

    @BeforeEach
    void setUp() throws Exception {
        // clear DB
        msgRepo.deleteAll();
        userRepo.deleteAll();

        // make securityService a no-op
        doNothing().when(securityService).checkUserIdWithToken(anyInt());
        // stub profileService so getUserAvatar never NPEs and no blocks
        when(profileService.getUserAvatarByUserId(anyInt())).thenReturn("avatarUrl");
        when(profileService.isUserBlocking(anyInt(), anyInt())).thenReturn(false);

        // Configure the mock JwtChannelInterceptor to allow all messages (pass-through) and log invocations
        when(jwtChannelInterceptor.preSend(any(Message.class), any(MessageChannel.class)))
            .thenAnswer(invocation -> {
                Message<?> messageArgument = invocation.getArgument(0);
                System.out.println("[" + Thread.currentThread().getName() + "] JwtChannelInterceptor.preSend called for message ID: " + (messageArgument.getHeaders().getId() != null ? messageArgument.getHeaders().getId().toString() : "N/A"));
                return messageArgument; // Return the original message
            });

        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong"));

        // create two users...
        UserAccountModel alice = new UserAccountModel();
        alice.setUsername("alice");
        alice.setEmail("alice@example.com");
        alice.setPasswordHash("pwd");
        alice.setIsActive(true);
        alice.setRoleId(2);
        alice.setCreatedAt(now);
        alice.setUpdatedAt(now);
        alice = userRepo.save(alice);
        aliceId = alice.getUserId();

        UserAccountModel bob = new UserAccountModel();
        bob.setUsername("bob");
        bob.setEmail("bob@example.com");
        bob.setPasswordHash("pwd");
        bob.setIsActive(true);
        bob.setRoleId(2);
        bob.setCreatedAt(now);
        bob.setUpdatedAt(now);
        bob = userRepo.save(bob);
        bobId = bob.getUserId();

        // one unread & one read message
        MessageModel m1 = new MessageModel();
        m1.setUserIdFrom(aliceId);
        m1.setUserIdTo(bobId);
        m1.setContent("Hi Bob");
        m1.setIsActive(true);
        m1.setSentAt(now.minusMinutes(5));
        m1.setReadAt(null);
        m1 = msgRepo.save(m1);
        msg1Id = m1.getMessageId();

        MessageModel m2 = new MessageModel();
        m2.setUserIdFrom(bobId);
        m2.setUserIdTo(aliceId);
        m2.setContent("Hello Alice");
        m2.setIsActive(true);
        m2.setSentAt(now.minusMinutes(2));
        m2.setReadAt(now.minusMinutes(1));
        m2 = msgRepo.save(m2);
        msg2Id = m2.getMessageId();

        // Initialize STOMP client with SockJS support
        List<Transport> transports = new ArrayList<>(2);
        transports.add(new WebSocketTransport(new StandardWebSocketClient())); // WebSocket transport
        transports.add(new RestTemplateXhrTransport()); // HTTP-based (XHR) transport as a fallback

        WebSocketClient sockJsClient = new SockJsClient(transports);
        this.stompClient = new WebSocketStompClient(sockJsClient);
        this.stompClient.setMessageConverter(new MappingJackson2MessageConverter());
    }

    @Test
    void getContactList_noExclusion_returnsAliceForBob() throws Exception {
        mockMvc.perform(get("/api/Chat/getContactList")
                .param("userId", bobId.toString())
                .param("excludingUserIdList", "-1")
                .param("contactNum", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.isSuccess").value(true))
            .andExpect(jsonPath("$.data.contactList").isArray())
            .andExpect(jsonPath("$.data.contactList.length()").value(1))
            .andExpect(jsonPath("$.data.contactList[0].contactUserId").value(aliceId))
            .andExpect(jsonPath("$.data.contactList[0].latestMessage").value("Hello Alice"))
            .andExpect(jsonPath("$.data.contactList[0].unreadMessageCount").value(1));
    }

    @Test
    void getContactList_withExclusion_returnsEmpty() throws Exception {
        mockMvc.perform(get("/api/Chat/getContactList")
                .param("userId", bobId.toString())
                .param("excludingUserIdList", aliceId.toString())
                .param("contactNum", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.isSuccess").value(true))
            .andExpect(jsonPath("$.data.contactList").isArray())
            .andExpect(jsonPath("$.data.contactList.length()").value(0));
    }

    @Test
    void getMessageHistoryList_fullHistory_returnsBothInOrder() throws Exception {
        mockMvc.perform(get("/api/Chat/getMessageHistoryList")
                .param("userId", aliceId.toString())
                .param("contactUserId", bobId.toString())
                .param("excludingMessageIdList", "-1") // Changed from "" to "-1"
                .param("messageNum", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.isSuccess").value(true))
            .andExpect(jsonPath("$.data.messageHistoryList").isArray())
            .andExpect(jsonPath("$.data.messageHistoryList.length()").value(2))
            .andExpect(jsonPath("$.data.messageHistoryList[0].messageId").value(msg2Id))
            .andExpect(jsonPath("$.data.messageHistoryList[0].content").value("Hello Alice"))
            .andExpect(jsonPath("$.data.messageHistoryList[1].messageId").value(msg1Id))
            .andExpect(jsonPath("$.data.messageHistoryList[1].content").value("Hi Bob"));
    }

    @Test
    void getMessageHistoryList_withExclusion_returnsOnlyOne() throws Exception {
        mockMvc.perform(get("/api/Chat/getMessageHistoryList")
                .param("userId", aliceId.toString())
                .param("contactUserId", bobId.toString())
                .param("excludingMessageIdList", msg2Id.toString())
                .param("messageNum", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.isSuccess").value(true))
            .andExpect(jsonPath("$.data.messageHistoryList").isArray())
            .andExpect(jsonPath("$.data.messageHistoryList.length()").value(1))
            .andExpect(jsonPath("$.data.messageHistoryList[0].messageId").value(msg1Id))
            .andExpect(jsonPath("$.data.messageHistoryList[0].content").value("Hi Bob"));
    }

    @Test
    void getUnreadMessageCount_forBothUsers() throws Exception {
        mockMvc.perform(get("/api/Chat/getUnreadMessageCount")
                .param("userId", bobId.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.isSuccess").value(true))
            .andExpect(jsonPath("$.data.unreadMessageCount").value(1));

        mockMvc.perform(get("/api/Chat/getUnreadMessageCount")
                .param("userId", aliceId.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.isSuccess").value(true))
            .andExpect(jsonPath("$.data.unreadMessageCount").value(0));
    }

    
}