package project.flowchat.backend.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatcher;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import project.flowchat.backend.DTO.ResponseBodyDTO;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Repository.UserAccountRepository;
import project.flowchat.backend.Service.AccountService;
import project.flowchat.backend.Service.ExceptionService;
import project.flowchat.backend.Service.SecurityService;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AccountController.class)
class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AccountService accountService;

    @Autowired
    private ResponseBodyDTO responseBodyDTO; // Autowired mock

    @Autowired
    private ObjectMapper objectMapper;

    @TestConfiguration
    static class TestConfig {
        @Bean
        public AccountService accountService() {
            return Mockito.mock(AccountService.class);
        }
        @Bean
        public ResponseBodyDTO responseBodyDTO() {
            // Provide the mock bean
            return Mockito.mock(ResponseBodyDTO.class);
        }
        @Bean
        public SecurityService securityService() {
            return Mockito.mock(SecurityService.class);
        }
        @Bean
        public UserAccountRepository userAccountRepository() {
            return Mockito.mock(UserAccountRepository.class);
        }
    }

    @BeforeEach
    void setUp() {
        // Reset mocks before each test
        Mockito.reset(accountService, responseBodyDTO); // Reset the autowired mocks

        // Define default behavior for the mocked DTO setters AFTER resetting
        // This is necessary because the controller calls these methods.
        // We don't need specific return values here, just allowing the calls.
        doNothing().when(responseBodyDTO).setMessage(anyString());
        doNothing().when(responseBodyDTO).setData(any());
    }

    // --- Argument Matcher Helper ---
    // Helper to create an ArgumentMatcher for a Map with specific key-value pairs
    private static ArgumentMatcher<Map<String, Object>> mapContaining(String key, Object value) {
        return map -> map != null && Objects.equals(map.get(key), value);
    }

    private static ArgumentMatcher<Map<String, Object>> mapContainingExactly(Map<String, Object> expectedMap) {
        return map -> map != null && map.equals(expectedMap);
    }


    // --- Tests for isUsernameUnique ---

    @Test
    void isUsernameUnique_Success_True() throws Exception {
        String username = "uniqueUser";
        when(accountService.isUsernameUnique(username)).thenReturn(true);

        mockMvc.perform(get("/api/Account/isUsernameUnique")
                .param("username", username))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)); // Check status and type

        // Verify service call
        verify(accountService).isUsernameUnique(username);
        // Verify interactions with the mocked DTO
        verify(responseBodyDTO).setMessage("The username is unique");
        verify(responseBodyDTO).setData(argThat(mapContaining("isUsernameUnique", true)));
    }

    @Test
    void isUsernameUnique_Success_False() throws Exception {
        String username = "existingUser";
        when(accountService.isUsernameUnique(username)).thenReturn(false);

        mockMvc.perform(get("/api/Account/isUsernameUnique")
                .param("username", username))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).isUsernameUnique(username);
        verify(responseBodyDTO).setMessage("The username is unique"); // Controller sets this message regardless
        verify(responseBodyDTO).setData(argThat(mapContaining("isUsernameUnique", false)));
    }

    @Test
    void isUsernameUnique_ServiceException() throws Exception {
        String username = "errorUser";
        String errorMessage = "Database error checking username";
        when(accountService.isUsernameUnique(username)).thenThrow(new ExceptionService(errorMessage));

        mockMvc.perform(get("/api/Account/isUsernameUnique")
                .param("username", username))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).isUsernameUnique(username);
        verify(responseBodyDTO).setMessage(errorMessage);
        verify(responseBodyDTO).setData(argThat(mapContaining("isUsernameUnique", false)));
    }

    // --- Tests for isEmailUnique ---

    @Test
    void isEmailUnique_Success_True() throws Exception {
        String email = "unique@example.com";
        when(accountService.isEmailUnique(email)).thenReturn(true);

        mockMvc.perform(get("/api/Account/isEmailUnique")
                .param("email", email))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).isEmailUnique(email);
        verify(responseBodyDTO).setMessage("The email is unique");
        verify(responseBodyDTO).setData(argThat(mapContaining("isEmailUnique", true)));
    }

     @Test
    void isEmailUnique_Success_False() throws Exception {
        String email = "existing@example.com";
        when(accountService.isEmailUnique(email)).thenReturn(false);

        mockMvc.perform(get("/api/Account/isEmailUnique")
                .param("email", email))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).isEmailUnique(email);
        verify(responseBodyDTO).setMessage("The email is unique");
        verify(responseBodyDTO).setData(argThat(mapContaining("isEmailUnique", false)));
    }

    @Test
    void isEmailUnique_ServiceException() throws Exception {
        String email = "error@example.com";
        String errorMessage = "Database error checking email";
        when(accountService.isEmailUnique(email)).thenThrow(new ExceptionService(errorMessage));

        mockMvc.perform(get("/api/Account/isEmailUnique")
                .param("email", email))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).isEmailUnique(email);
        verify(responseBodyDTO).setMessage(errorMessage);
        verify(responseBodyDTO).setData(argThat(mapContaining("isEmailUnique", false)));
    }

    // --- Tests for registerAccount ---

    @Test
    void registerAccount_Success() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "newUser");
        requestBody.put("email", "new@example.com");
        requestBody.put("password", "password123");
        requestBody.put("licenseKey", "validKey");

        UserAccountModel mockAccount = new UserAccountModel();
        mockAccount.setUserId(1);
        mockAccount.setUsername("newUser");
        mockAccount.setRoleId(2);

        when(accountService.registerAccount("newUser", "new@example.com", "password123", "validKey"))
                .thenReturn(mockAccount);
        when(accountService.getRoleById(2)).thenReturn("USER");

        mockMvc.perform(post("/api/Account/registerAccount")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).registerAccount("newUser", "new@example.com", "password123", "validKey");
        verify(accountService).getRoleById(2);
        verify(responseBodyDTO).setMessage("A new account is created");

        // Verify the complex map structure passed to setData
        Map<String, Object> expectedUserData = new HashMap<>();
        expectedUserData.put("id", 1);
        expectedUserData.put("username", "newUser");
        expectedUserData.put("role", "USER");
        Map<String, Object> expectedData = new HashMap<>();
        expectedData.put("isSuccess", true);
        expectedData.put("user", expectedUserData);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedData)));
    }

    @Test
    void registerAccount_ServiceException() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "existingUser");
        requestBody.put("email", "existing@example.com");
        requestBody.put("password", "password123");
        requestBody.put("licenseKey", "invalidKey");

        String errorMessage = "Username already exists";
        when(accountService.registerAccount("existingUser", "existing@example.com", "password123", "invalidKey"))
                .thenThrow(new ExceptionService(errorMessage));

        mockMvc.perform(post("/api/Account/registerAccount")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).registerAccount("existingUser", "existing@example.com", "password123", "invalidKey");
        verify(accountService, never()).getRoleById(anyInt());
        verify(responseBodyDTO).setMessage(errorMessage);
        // Verify the specific map for the error case
        Map<String, Object> expectedErrorData = new HashMap<>();
        expectedErrorData.put("isSuccess", false);
        expectedErrorData.put("user", null);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedErrorData)));
    }

    // --- Tests for requestLicenseKey ---

    @Test
    void requestLicenseKey_Success() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "test@example.com");

        doNothing().when(accountService).requestLicenseKey("test@example.com");

        mockMvc.perform(post("/api/Account/requestLicenseKey")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).requestLicenseKey("test@example.com");
        verify(responseBodyDTO).setMessage("A new license key is generated and sent");
        verify(responseBodyDTO).setData(argThat(mapContaining("isSuccess", true)));
    }

    @Test
    void requestLicenseKey_ServiceException() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "invalid-email");

        String errorMessage = "Email format invalid";
        doThrow(new ExceptionService(errorMessage)).when(accountService).requestLicenseKey("invalid-email");

        mockMvc.perform(post("/api/Account/requestLicenseKey")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).requestLicenseKey("invalid-email");
        verify(responseBodyDTO).setMessage(errorMessage);
        verify(responseBodyDTO).setData(argThat(mapContaining("isSuccess", false)));
    }

    // --- Tests for requestAuthenticationCode ---

    @Test
    void requestAuthenticationCode_Success() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "test@example.com");

        doNothing().when(accountService).requestAuthenticationCode("test@example.com");

        mockMvc.perform(post("/api/Account/requestAuthenticationCode")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).requestAuthenticationCode("test@example.com");
        verify(responseBodyDTO).setMessage("A new authentication code is generated and sent");
        verify(responseBodyDTO).setData(argThat(mapContaining("isSuccess", true)));
    }

    @Test
    void requestAuthenticationCode_ServiceException() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "unknown@example.com");

        String errorMessage = "Email not found";
        doThrow(new ExceptionService(errorMessage)).when(accountService).requestAuthenticationCode("unknown@example.com");

        mockMvc.perform(post("/api/Account/requestAuthenticationCode")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).requestAuthenticationCode("unknown@example.com");
        verify(responseBodyDTO).setMessage(errorMessage);
        verify(responseBodyDTO).setData(argThat(mapContaining("isSuccess", false)));
    }

    // --- Tests for login ---

    @Test
    void login_Success() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "testuser");
        requestBody.put("password", "correctPassword");

        Map<String, Object> userLoginInfo = new HashMap<>();
        userLoginInfo.put("id", 1L);
        userLoginInfo.put("username", "testuser");
        userLoginInfo.put("role", "USER");

        when(accountService.getUserLoginInfo("testuser", null, "correctPassword"))
                .thenReturn(userLoginInfo);

        mockMvc.perform(post("/api/Account/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).getUserLoginInfo("testuser", null, "correctPassword");
        verify(responseBodyDTO).setMessage("Account is active and password is correct");
        // Verify the complex map structure
        Map<String, Object> expectedData = new HashMap<>();
        expectedData.put("isAccountActive", true);
        expectedData.put("isPasswordCorrect", true);
        expectedData.put("user", userLoginInfo);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedData)));
    }

     @Test
    void login_IncorrectPassword() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "testuser");
        requestBody.put("password", "wrongPassword");

        String errorMessage = "Incorrect password";
        when(accountService.getUserLoginInfo("testuser", null, "wrongPassword"))
                .thenThrow(new ExceptionService(errorMessage));

        mockMvc.perform(post("/api/Account/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).getUserLoginInfo("testuser", null, "wrongPassword");
        verify(responseBodyDTO).setMessage(errorMessage);
        // Verify the specific map for this error case
        Map<String, Object> expectedErrorData = new HashMap<>();
        expectedErrorData.put("isAccountActive", true); // Based on controller logic
        expectedErrorData.put("isPasswordCorrect", false);
        expectedErrorData.put("user", null);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedErrorData)));
    }

    @Test
    void login_AccountNotActive() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "inactiveUser");
        requestBody.put("password", "somePassword");

        String errorMessage = "Account is not active";
        when(accountService.getUserLoginInfo("inactiveUser", null, "somePassword"))
                .thenThrow(new ExceptionService(errorMessage));

        mockMvc.perform(post("/api/Account/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).getUserLoginInfo("inactiveUser", null, "somePassword");
        verify(responseBodyDTO).setMessage(errorMessage);
        // Verify the specific map for this error case
        Map<String, Object> expectedErrorData = new HashMap<>();
        expectedErrorData.put("isAccountActive", false); // Based on controller logic
        expectedErrorData.put("isPasswordCorrect", false);
        expectedErrorData.put("user", null);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedErrorData)));
    }

    // --- Tests for resetPasswordByEmail ---

    @Test
    void resetPasswordByEmail_Success() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "test@example.com");
        requestBody.put("password", "newPassword");
        requestBody.put("authenticationCode", "validCode");

        String expectedUsername = "testuser";

        doNothing().when(accountService).resetPasswordByEmail("test@example.com", "newPassword", "validCode");
        when(accountService.getNameFromEmail("test@example.com")).thenReturn(expectedUsername);

        mockMvc.perform(put("/api/Account/resetPasswordByEmail")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).resetPasswordByEmail("test@example.com", "newPassword", "validCode");
        verify(accountService).getNameFromEmail("test@example.com");
        verify(responseBodyDTO).setMessage("Password is reset");
        // Verify the specific map
        Map<String, Object> expectedData = new HashMap<>();
        expectedData.put("isSuccess", true);
        expectedData.put("username", expectedUsername);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedData)));
    }

    @Test
    void resetPasswordByEmail_ServiceException() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "test@example.com");
        requestBody.put("password", "newPassword");
        requestBody.put("authenticationCode", "invalidCode");

        String errorMessage = "Invalid authentication code";
        doThrow(new ExceptionService(errorMessage))
                .when(accountService).resetPasswordByEmail("test@example.com", "newPassword", "invalidCode");

        mockMvc.perform(put("/api/Account/resetPasswordByEmail")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).resetPasswordByEmail("test@example.com", "newPassword", "invalidCode");
        verify(accountService, never()).getNameFromEmail(anyString());
        verify(responseBodyDTO).setMessage(errorMessage);
        // Verify the specific map for the error case
        Map<String, Object> expectedErrorData = new HashMap<>();
        expectedErrorData.put("isSuccess", false);
        expectedErrorData.put("username", null);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedErrorData)));
    }

    // --- Tests for resetPasswordByOldPassword ---

    @Test
    void resetPasswordByOldPassword_Success() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "test@example.com");
        requestBody.put("oldPassword", "oldPass");
        requestBody.put("newPassword", "newPass");

        String expectedUsername = "testuser";
        String mockJwt = "mock-jwt-token";

        doNothing().when(accountService).resetPasswordByOldPassword("test@example.com", "oldPass", "newPass");
        when(accountService.getNameFromEmail("test@example.com")).thenReturn(expectedUsername);

        mockMvc.perform(put("/api/Account/resetPasswordByOldPassword")
                .header("Authorization", "Bearer " + mockJwt)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).resetPasswordByOldPassword("test@example.com", "oldPass", "newPass");
        verify(accountService).getNameFromEmail("test@example.com");
        verify(responseBodyDTO).setMessage("Password is reset");
        // Verify the specific map
        Map<String, Object> expectedData = new HashMap<>();
        expectedData.put("isSuccess", true);
        expectedData.put("username", expectedUsername);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedData)));
    }

    @Test
    void resetPasswordByOldPassword_ServiceException() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "test@example.com");
        requestBody.put("oldPassword", "wrongOldPass");
        requestBody.put("newPassword", "newPass");

        String errorMessage = "Incorrect old password";
        String mockJwt = "mock-jwt-token";

        doThrow(new ExceptionService(errorMessage))
                .when(accountService).resetPasswordByOldPassword("test@example.com", "wrongOldPass", "newPass");

        mockMvc.perform(put("/api/Account/resetPasswordByOldPassword")
                .header("Authorization", "Bearer " + mockJwt) // Add Authorization header
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).resetPasswordByOldPassword("test@example.com", "wrongOldPass", "newPass");
        verify(accountService, never()).getNameFromEmail(anyString());
        verify(responseBodyDTO).setMessage(errorMessage);
        // Verify the specific map for the error case
        Map<String, Object> expectedErrorData = new HashMap<>();
        expectedErrorData.put("isSuccess", false);
        expectedErrorData.put("username", null);
        verify(responseBodyDTO).setData(argThat(mapContainingExactly(expectedErrorData)));
    }


    // --- Tests for deleteAccount ---

    @Test
    void deleteAccount_Success() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "userToDelete");
        requestBody.put("email", "delete@example.com");
        requestBody.put("password", "correctPassword");

        doNothing().when(accountService).deleteAccount("userToDelete", "delete@example.com", "correctPassword");

        String mockJwt = "mock-jwt-token";

        mockMvc.perform(put("/api/Account/deleteAccount") // Testing as PUT based on controller code
                .header("Authorization", "Bearer " + mockJwt) // Add Authorization header
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).deleteAccount("userToDelete", "delete@example.com", "correctPassword");
        verify(responseBodyDTO).setMessage("Account is deleted");
        verify(responseBodyDTO).setData(argThat(mapContaining("isSuccess", true)));
    }

    @Test
    void deleteAccount_ServiceException() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "userToDelete");
        requestBody.put("email", "delete@example.com");
        requestBody.put("password", "wrongPassword");

        String errorMessage = "Incorrect password for deletion";
        String mockJwt = "mock-jwt-token";
        doThrow(new ExceptionService(errorMessage))
                .when(accountService).deleteAccount("userToDelete", "delete@example.com", "wrongPassword");

        mockMvc.perform(put("/api/Account/deleteAccount") // Testing as PUT
                .header("Authorization", "Bearer " + mockJwt) // Add Authorization header
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).deleteAccount("userToDelete", "delete@example.com", "wrongPassword");
        verify(responseBodyDTO).setMessage(errorMessage);
        verify(responseBodyDTO).setData(argThat(mapContaining("isSuccess", false)));
    }

    // --- Optional: Test for General Exception ---

    @Test
    void isUsernameUnique_GeneralException() throws Exception {
        String username = "crashUser";
        RuntimeException generalException = new RuntimeException("Unexpected error");
        when(accountService.isUsernameUnique(username)).thenThrow(generalException);

        mockMvc.perform(get("/api/Account/isUsernameUnique")
                .param("username", username))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(accountService).isUsernameUnique(username);
        // Verify the specific message format for general exceptions
        verify(responseBodyDTO).setMessage("Fail: " + generalException);
        verify(responseBodyDTO).setData(null); // Controller sets data to null in general exception case
    }
}