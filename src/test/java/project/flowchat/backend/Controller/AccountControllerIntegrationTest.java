package project.flowchat.backend.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate; // Import JdbcTemplate
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import project.flowchat.backend.Service.ExceptionService;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest // Load full application context
@AutoConfigureMockMvc // Configure MockMvc
@TestPropertySource(properties = { // Configure H2 in-memory DB
        // Add INIT=CREATE SCHEMA IF NOT EXISTS ACCOUNT to the URL
        "spring.datasource.url=jdbc:h2:mem:testdb_ctrl;MODE=MSSQLServer;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS ACCOUNT",
        "spring.jpa.hibernate.ddl-auto=none", // Keep this as none since schema.sql defines tables
})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS) // Reset context/DB after all tests
@Transactional // Rollback transactions after each test
public class AccountControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper; // For converting objects to JSON

    @Autowired
    private JdbcTemplate jdbcTemplate; // Autowire JdbcTemplate

    private final String BASE_URL = "/api/Account";

    // MODIFIED Helper: Use native SQL to insert, matching schema.sql and native queries
    // Changed return type to void as we are not returning a managed entity
    private void createUser(String username, String email, String rawPassword, boolean isActive) {
        String hashedPassword = BCrypt.hashpw(rawPassword, BCrypt.gensalt());
        int roleId = 2; // Assuming 2 is 'user' role based on previous code
        // Use ZonedDateTime for consistency, convert to Timestamp for JDBC if needed,
        // but H2 often handles ZonedDateTime mapping with appropriate drivers/config.
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong"));
        // Convert boolean to TINYINT representation (1 for true, 0 for false) for SQL
        int activeFlag = isActive ? 1 : 0;

        // Use the table name User_Account as expected by native queries and schema.sql
        String sql = "INSERT INTO ACCOUNT.User_Account (username, email, password_hash, is_active, role_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql, username, email, hashedPassword, activeFlag, roleId, now, now);
    }

    // Helper to create an authentication code/license key using native SQL
    // Ensure this inserts into the uppercase 'Authentication' table
    private void createAuthenticationCode(String email, String key, boolean isAvailable, ZonedDateTime expiresAt) {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong"));
        int availableFlag = isAvailable ? 1 : 0;
        // Use uppercase 'Authentication' to match schema.sql and native queries
        String sql = "INSERT INTO ACCOUNT.Authentication (email, key_code, is_available, created_at, expires_at) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, email, key, availableFlag, now, expiresAt.withZoneSameInstant(ZoneId.of("Asia/Hong_Kong")));
    }

    @BeforeEach
    void setUp() {
        // Ensure cleanup includes the Authentication table
        jdbcTemplate.update("DELETE FROM ACCOUNT.Authentication");
        jdbcTemplate.update("DELETE FROM ACCOUNT.User_Account");
    }

    // --- Test Cases ---
    // (No changes needed below this line, as they call the modified createUser/createAuthenticationCode helpers)

    @Test
    void isUsernameUnique_WhenUnique_ShouldReturnTrue() throws Exception {
        mockMvc.perform(get(BASE_URL + "/isUsernameUnique")
                        .param("username", "newuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The username is unique")))
                .andExpect(jsonPath("$.data.isUsernameUnique", is(true)));
    }

    @Test
    void isUsernameUnique_WhenExistsAndActive_ShouldReturnFalse() throws Exception {
        createUser("existinguser", "exists@example.com", "password", true); // Uses modified helper

        mockMvc.perform(get(BASE_URL + "/isUsernameUnique")
                        .param("username", "existinguser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.USERNAME_NOT_UNIQUE)))
                .andExpect(jsonPath("$.data.isUsernameUnique", is(false)));
    }

    @Test
    void isUsernameUnique_WhenExistsButInactive_ShouldReturnTrue() throws Exception {
        createUser("inactiveuser", "inactive@example.com", "password", false); // Uses modified helper

        mockMvc.perform(get(BASE_URL + "/isUsernameUnique")
                        .param("username", "inactiveuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The username is unique"))) // Inactive users don't count
                .andExpect(jsonPath("$.data.isUsernameUnique", is(true)));
    }

    @Test
    void isUsernameUnique_WhenInvalidFormat_ShouldReturnFalse() throws Exception {
        mockMvc.perform(get(BASE_URL + "/isUsernameUnique")
                        .param("username", "invalid@name")) // Contains '@'
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.INVALID_USERNAME_FORMAT)))
                .andExpect(jsonPath("$.data.isUsernameUnique", is(false)));
    }

    @Test
    void isEmailUnique_WhenUnique_ShouldReturnTrue() throws Exception {
        mockMvc.perform(get(BASE_URL + "/isEmailUnique")
                        .param("email", "new@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The email is unique")))
                .andExpect(jsonPath("$.data.isEmailUnique", is(true)));
    }

    @Test
    void isEmailUnique_WhenExistsAndActive_ShouldReturnFalse() throws Exception {
        createUser("user1", "exists@example.com", "password", true); // Uses modified helper

        mockMvc.perform(get(BASE_URL + "/isEmailUnique")
                        .param("email", "exists@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.EMAIL_NOT_UNIQUE)))
                .andExpect(jsonPath("$.data.isEmailUnique", is(false)));
    }

    @Test
    void isEmailUnique_WhenExistsButInactive_ShouldReturnTrue() throws Exception {
        createUser("user2", "inactive@example.com", "password", false); // Uses modified helper

        mockMvc.perform(get(BASE_URL + "/isEmailUnique")
                        .param("email", "inactive@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The email is unique"))) // Inactive users don't count
                .andExpect(jsonPath("$.data.isEmailUnique", is(true)));
    }

    @Test
    void isEmailUnique_WhenInvalidFormat_ShouldReturnFalse() throws Exception {
        mockMvc.perform(get(BASE_URL + "/isEmailUnique")
                        .param("email", "invalid-email")) // Missing '@'
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.INVALID_EMAIL_FORMAT)))
                .andExpect(jsonPath("$.data.isEmailUnique", is(false)));
    }


    @Test
    void requestLicenseKey_WhenEmailExistsAndActive_ShouldReturnError() throws Exception {
        createUser("activeuser", "active@example.com", "password", true); // Uses modified helper
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "active@example.com");

        mockMvc.perform(post(BASE_URL + "/requestLicenseKey")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.EMAIL_NOT_UNIQUE)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));
    }


    @Test
    void registerAccount_WhenLicenseKeyInvalid_ShouldReturnError() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "newreg2");
        requestBody.put("email", "registerme2@example.com");
        requestBody.put("password", "password123");
        requestBody.put("licenseKey", "INVALIDKEY"); // Not 16 chars

        mockMvc.perform(post(BASE_URL + "/registerAccount")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.INVALID_KEY_LENGTH)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));
    }

    @Test
    void registerAccount_WhenLicenseKeyNotAvailable_ShouldReturnError() throws Exception {
        String email = "registerme3@example.com";
        String licenseKey = "USEDVALIDLICENCE"; // 16 chars
        createAuthenticationCode(email, licenseKey, false, ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")).plusDays(1)); // Key already used

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "newreg3");
        requestBody.put("email", email);
        requestBody.put("password", "password123");
        requestBody.put("licenseKey", licenseKey);

        mockMvc.perform(post(BASE_URL + "/registerAccount")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.KEY_NOT_AVAILABLE)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));
    }

    @Test
    void login_WithCorrectUsernamePassword_ShouldReturnSuccessAndToken() throws Exception {
        createUser("loginuser", "login@example.com", "correctpassword", true); // Uses modified helper

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "loginuser");
        requestBody.put("password", "correctpassword");

        mockMvc.perform(post(BASE_URL + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Account is active and password is correct")))
                .andExpect(jsonPath("$.data.isAccountActive", is(true)))
                .andExpect(jsonPath("$.data.isPasswordCorrect", is(true)))
                .andExpect(jsonPath("$.data.user.username", is("loginuser")))
                .andExpect(jsonPath("$.data.user.email", is("login@example.com")))
                .andExpect(jsonPath("$.data.user.token", notNullValue()));
    }

    @Test
    void login_WithCorrectEmailPassword_ShouldReturnSuccessAndToken() throws Exception {
        createUser("loginuser2", "login2@example.com", "correctpassword2", true); // Uses modified helper

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "login2@example.com");
        requestBody.put("password", "correctpassword2");

        mockMvc.perform(post(BASE_URL + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Account is active and password is correct")))
                .andExpect(jsonPath("$.data.isAccountActive", is(true)))
                .andExpect(jsonPath("$.data.isPasswordCorrect", is(true)))
                .andExpect(jsonPath("$.data.user.username", is("loginuser2")))
                .andExpect(jsonPath("$.data.user.email", is("login2@example.com")))
                .andExpect(jsonPath("$.data.user.token", notNullValue()));
    }

    @Test
    void login_WithIncorrectPassword_ShouldReturnError() throws Exception {
        createUser("loginuser3", "login3@example.com", "correctpassword3", true); // Uses modified helper

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "login3@example.com");
        requestBody.put("password", "wrongpassword");

        mockMvc.perform(post(BASE_URL + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.INCORRECT_PASSWORD)))
                .andExpect(jsonPath("$.data.isAccountActive", is(true)))
                .andExpect(jsonPath("$.data.isPasswordCorrect", is(false)))
                .andExpect(jsonPath("$.data.user", is(nullValue())));
    }


    @Test
    void requestAuthenticationCode_WhenUserInactive_ShouldReturnError() throws Exception {
        createUser("authuser2", "auth2@example.com", "password", false); // Inactive, uses modified helper
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "auth2@example.com");

        mockMvc.perform(post(BASE_URL + "/requestAuthenticationCode")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.ACCOUNT_NOT_ACTIVE)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));
    }

    @Test
    void resetPasswordByEmail_WhenAuthCodeInvalid_ShouldReturnError() throws Exception {
        String email = "resetme2@example.com";
        createUser("resetuser2", email, "oldpassword", true); // Uses modified helper
        // No valid auth code created

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", email);
        requestBody.put("password", "newStrongPassword2");
        requestBody.put("authenticationCode", "654321"); // Incorrect/non-existent code

        mockMvc.perform(put(BASE_URL + "/resetPasswordByEmail")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.KEY_NOT_MATCH)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));
    }

    private String getJwtToken(String identifier, String password) throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        if (identifier.contains("@")) {
            loginRequest.put("email", identifier);
        } else {
            loginRequest.put("username", identifier);
        }
        loginRequest.put("password", password);

        MvcResult result = mockMvc.perform(post(BASE_URL + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.user.token").exists())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        return objectMapper.readTree(responseBody).at("/data/user/token").asText();
    }

    @Test
    void resetPasswordByOldPassword_WhenValid_ShouldReturnSuccess() throws Exception {
        String email = "resetbyold@example.com";
        String oldPassword = "oldPassword123";
        String newPassword = "newPassword456";
        createUser("resetbyolduser", email, oldPassword, true); // Uses modified helper
        String token = getJwtToken(email, oldPassword);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", email);
        requestBody.put("oldPassword", oldPassword);
        requestBody.put("newPassword", newPassword);

        mockMvc.perform(put(BASE_URL + "/resetPasswordByOldPassword")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Password is reset")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.username", is("resetbyolduser")));

        String currentHash = jdbcTemplate.queryForObject("SELECT password_hash FROM ACCOUNT.User_Account WHERE email = ?", String.class, email);
        assertTrue(BCrypt.checkpw(newPassword, currentHash));
    }

    @Test
    void resetPasswordByOldPassword_WhenOldPasswordIncorrect_ShouldReturnError() throws Exception {
        String email = "resetbyold2@example.com";
        String oldPassword = "oldPassword123";
        String newPassword = "newPassword456";
        createUser("resetbyolduser2", email, oldPassword, true); // Uses modified helper
        String token = getJwtToken(email, oldPassword);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", email);
        requestBody.put("oldPassword", "wrongOldPassword");
        requestBody.put("newPassword", newPassword);

        mockMvc.perform(put(BASE_URL + "/resetPasswordByOldPassword")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.INCORRECT_PASSWORD)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));
    }

    @Test
    void deleteAccount_WhenValid_ShouldSetInactive() throws Exception {
        String email = "deleteme@example.com";
        String password = "passwordToDelete";
        createUser("deleteuser", email, password, true); // Uses modified helper
        String token = getJwtToken(email, password);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", email);
        requestBody.put("password", password);

        mockMvc.perform(put(BASE_URL + "/deleteAccount")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Account is deleted")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)));

        Integer activeStatus = jdbcTemplate.queryForObject("SELECT is_active FROM ACCOUNT.User_Account WHERE email = ?", Integer.class, email);
        assertEquals(0, activeStatus);
    }

    @Test
    void deleteAccount_WhenPasswordIncorrect_ShouldReturnError() throws Exception {
        String email = "deleteme2@example.com";
        String password = "passwordToDelete2";
        createUser("deleteuser2", email, password, true); // Uses modified helper
        String token = getJwtToken(email, password);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", email);
        requestBody.put("password", "wrongPassword");

        mockMvc.perform(put(BASE_URL + "/deleteAccount")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.INCORRECT_PASSWORD)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));

        Integer activeStatus = jdbcTemplate.queryForObject("SELECT is_active FROM ACCOUNT.User_Account WHERE email = ?", Integer.class, email);
        assertEquals(1, activeStatus);
    }
}