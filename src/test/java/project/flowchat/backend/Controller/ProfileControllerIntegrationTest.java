package project.flowchat.backend.Controller;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import project.flowchat.backend.Service.ExceptionService;
import project.flowchat.backend.Service.SecurityService;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test") // Ensure application-test.properties is loaded
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
@Transactional // Rollback database changes after each test
public class ProfileControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private SecurityService securityService;

    private final String BASE_URL = "/api/Profile";

    private String generateTestTokenForUserId(Integer userId) {
        return "Bearer test-token-for-user-" + userId;
    }

    // Helper to create user account and profile
    private void createAccountAndProfile(Integer userId, String username, String email, String description, Integer avatarId, boolean isActive) {
        String hashedPassword = "testpassword"; // Placeholder, not used for auth in these tests
        int roleId = 2; // Default 'user' role
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong"));
        int activeFlag = isActive ? 1 : 0;

        String accountSql = "INSERT INTO ACCOUNT.User_Account (user_id, username, email, password_hash, is_active, role_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(accountSql, userId, username, email, hashedPassword, activeFlag, roleId, now, now);

        String profileSql = "INSERT INTO PROFILE.User_Profile (user_id, username, description, avatar_id, updated_at) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(profileSql, userId, username, description, avatarId, now);
    }

    // Helper to create a block relationship
    private void createBlockRelationship(Integer userIdFrom, Integer userIdTo) {
        String blockSql = "INSERT INTO PROFILE.Block (user_id_from, user_id_to) VALUES (?, ?)";
        jdbcTemplate.update(blockSql, userIdFrom, userIdTo);
    }
     // Helper to insert roles if schema.sql doesn't or if running standalone
    private void insertRoles() {
        jdbcTemplate.update("MERGE INTO ACCOUNT.Role (role_id, role_name) KEY(role_id) VALUES (1, 'admin')");
        jdbcTemplate.update("MERGE INTO ACCOUNT.Role (role_id, role_name) KEY(role_id) VALUES (2, 'user')");
    }


    @BeforeEach
    void setUp() throws Exception {
        // Clear relevant tables before each test
        jdbcTemplate.update("DELETE FROM PROFILE.Block");
        jdbcTemplate.update("DELETE FROM PROFILE.User_Profile");
        // Add other PROFILE related tables if necessary
        jdbcTemplate.update("DELETE FROM ACCOUNT.User_Account");
        // jdbcTemplate.update("DELETE FROM ACCOUNT.Role"); // schema.sql should handle roles, or use insertRoles()

        // Setup roles if not handled by schema.sql or if tests need specific state
        insertRoles();


        // Mock securityService.validateToken for "valid" test tokens
        // It will only match tokens starting with "test-token-for-user-"
        when(securityService.validateToken(argThat(token -> token != null && token.startsWith("test-token-for-user-"))))
            .thenAnswer(invocation -> {
                String rawToken = invocation.getArgument(0); // Token is already confirmed to be a "valid" test token
                Claims mockClaims = Jwts.claims().build();
                // If your SecurityService.validateToken is expected to parse userId from the
                // token and put it into claims, you might want to simulate that here:
                // For example:
                // String userIdFromToken = rawToken.substring("test-token-for-user-".length());
                // mockClaims.put("userId", Integer.parseInt(userIdFromToken));
                return mockClaims;
            });

        // Note: We are not providing a general fallback (like anyString().thenThrow()) here.
        // Specific tests (like for invalid token formats) should set up their own
        // mocks for securityService.validateToken if a specific behavior is needed for other token strings.
        // If validateToken is called with a token not matching the argThat above, and not matching
        // a more specific mock in a test method, it will return null (Mockito's default).

        // Mock securityService.checkUserIdWithToken
        doAnswer(invocation -> {
            // For these tests, assume if validateToken passed, this check is also fine.
            // More specific behavior can be added if needed.
            return null; // for void method
        }).when(securityService).checkUserIdWithToken(anyInt());
    }

    @Test
    void getMyBlockingList_ShouldReturnBlockedUsers_WhenUserHasBlockings() throws Exception {
        Integer userId = 1;
        createAccountAndProfile(1, "user1", "user1@example.com", "User 1 Profile", null, true);
        createAccountAndProfile(2, "user2", "user2@example.com", "User 2 Profile", null, true);
        createAccountAndProfile(3, "user3", "user3@example.com", "User 3 Profile", null, true);
        createBlockRelationship(1, 2); // User1 blocks User2
        createBlockRelationship(1, 3); // User1 blocks User3

        String token = generateTestTokenForUserId(userId);

        mockMvc.perform(get(BASE_URL + "/getMyBlockingList")
                        .header("Authorization", token)
                        .param("userId", userId.toString())
                        .param("excludingUserIdList", "-1")
                        .param("userNum", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("My blocking list is returned")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.userList", hasSize(2)))
                .andExpect(jsonPath("$.data.userList[?(@.userId == 2)].username", equalTo(List.of("user2"))))
                .andExpect(jsonPath("$.data.userList[?(@.userId == 3)].username", equalTo(List.of("user3"))));

        verify(securityService).checkUserIdWithToken(eq(userId));
    }

    @Test
    void getMyBlockingList_WithExclusion_ShouldReturnFilteredList() throws Exception {
        Integer userId = 1;
        createAccountAndProfile(1, "user1", "user1@example.com", "User 1 Profile", null, true);
        createAccountAndProfile(2, "user2", "user2@example.com", "User 2 Profile", null, true);
        createAccountAndProfile(3, "user3", "user3@example.com", "User 3 Profile", null, true);
        createBlockRelationship(1, 2);
        createBlockRelationship(1, 3);

        String token = generateTestTokenForUserId(userId);
        List<Integer> excludingList = List.of(2); // Exclude user2
        String excludingListStr = excludingList.stream().map(String::valueOf).collect(Collectors.joining(","));

        mockMvc.perform(get(BASE_URL + "/getMyBlockingList")
                        .header("Authorization", token)
                        .param("userId", userId.toString())
                        .param("excludingUserIdList", excludingListStr)
                        .param("userNum", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.userList", hasSize(1)))
                .andExpect(jsonPath("$.data.userList[0].userId", is(3)))
                .andExpect(jsonPath("$.data.userList[0].username", is("user3")));

        verify(securityService).checkUserIdWithToken(eq(userId));
    }

    @Test
    void getMyBlockingList_ShouldReturnEmptyList_WhenUserHasNoBlockings() throws Exception {
        Integer userId = 4;
        createAccountAndProfile(4, "user4", "user4@example.com", "User 4 Profile", null, true);
        // User4 blocks no one

        String token = generateTestTokenForUserId(userId);

        mockMvc.perform(get(BASE_URL + "/getMyBlockingList")
                        .header("Authorization", token)
                        .param("userId", userId.toString())
                        .param("excludingUserIdList", "")
                        .param("userNum", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.userList", hasSize(0)));

        verify(securityService).checkUserIdWithToken(eq(userId));
    }

    @Test
    void getMyBlockingList_MismatchedUserIdAndToken_ShouldFailSecurityCheckInService() throws Exception {
        Integer tokenUserId = 1;
        Integer requestedListUserId = 2; // Requesting list for user2 with token for user1

        createAccountAndProfile(1, "user1", "user1@example.com", "User 1 Profile", null, true);
        createAccountAndProfile(2, "user2", "user2@example.com", "User 2 Profile", null, true);

        String token = generateTestTokenForUserId(tokenUserId);

        // Specific mock for checkUserIdWithToken to simulate failure
        doAnswer(invocation -> {
            Integer userIdInMethodArg = invocation.getArgument(0);
            // This check simulates that the service would compare userIdInMethodArg
            // with the userId extracted from the actual token by the SecurityService.
            // Here, we simulate that comparison failing.
            if (!userIdInMethodArg.equals(tokenUserId)) {
                // Workaround: Using string literal
                throw new ExceptionService("Invalid or expired token.");
            }
            return null;
        }).when(securityService).checkUserIdWithToken(eq(requestedListUserId));


        mockMvc.perform(get(BASE_URL + "/getMyBlockingList")
                        .header("Authorization", token)
                        .param("userId", requestedListUserId.toString())
                        .param("excludingUserIdList", "")
                        .param("userNum", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // Controller catches ExceptionService
                // Workaround: Using string literal
                .andExpect(jsonPath("$.message", is("Invalid or expired token.")))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));

        verify(securityService).checkUserIdWithToken(eq(requestedListUserId));
    }

    @Test
    void getMyBlockingList_InvalidTokenFormat_ShouldReturnUnauthorizedByFilter() throws Exception {
        // The Authorization header will be "Bearer InvalidTokenValue"
        // Assuming JWTFilter strips "Bearer ", securityService.validateToken will receive "InvalidTokenValue"

        // This specific mock ensures that validateToken throws for the raw token "InvalidTokenValue"
        // This will take precedence over the setUp mock because the argThat in setUp won't match "InvalidTokenValue".
        when(securityService.validateToken("InvalidTokenValue"))
            .thenThrow(new RuntimeException("Simulated JWT validation error from mock for InvalidTokenValue"));

        mockMvc.perform(get(BASE_URL + "/getMyBlockingList")
                        .header("Authorization", "Bearer InvalidTokenValue")
                        .param("userId", "1")
                        .param("excludingUserIdList", "")
                        .param("userNum", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized()); // JWTFilter sends SC_UNAUTHORIZED
    }
}