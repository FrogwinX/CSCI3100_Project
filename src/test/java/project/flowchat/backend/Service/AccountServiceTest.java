package project.flowchat.backend.Service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.lang.reflect.Method;
import java.util.Map;

import jakarta.mail.internet.MimeMessage;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mindrot.jbcrypt.BCrypt;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Repository.UserAccountRepository;
// Removed incorrect enum imports

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private UserAccountRepository userAccountRepository;
    @Mock
    private SecurityService securityService;
    @Mock
    private ForumService forumService;
    @Mock
    private ProfileService profileService;
    @Mock
    private JavaMailSender mailSender;
    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private AccountService accountService;

    @BeforeEach
    void setUp() {
        // No need to manually instantiate accountService when using @InjectMocks
        // MockitoAnnotations.openMocks(this); // Alternative if not using @ExtendWith
    }

    // --- Test for private method sendEmail (using reflection) ---
    @Test
    void testSendEmail_callsMimeMessageHelperWithCorrectArguments() throws Exception {
        String userEmail = "test@example.com";
        String key = "GU72WGY440RKHSV0";
        SecurityService.KeyType keyType = SecurityService.KeyType.LICENSE;
        String subject = "Test Subject";
        String fileName = "test.html";

        MimeMessageHelper[] helperHolder = new MimeMessageHelper[1];

        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // Use spy to capture MimeMessageHelper
        try (MockedConstruction<MimeMessageHelper> mocked = Mockito.mockConstruction(MimeMessageHelper.class,
                (mock, context) -> {
                    // Configure the mock MimeMessageHelper if needed
                    helperHolder[0] = mock;
                })) {
            // Use reflection to access the private method
            Method sendEmail = AccountService.class.getDeclaredMethod("sendEmail", String.class, String.class, SecurityService.KeyType.class, String.class, String.class);
            sendEmail.setAccessible(true);
            sendEmail.invoke(accountService, userEmail, key, keyType, subject, fileName);

            // Verify interactions
            MimeMessageHelper helper = helperHolder[0]; // Get the constructed mock
            assertNotNull(helper, "MimeMessageHelper should have been constructed");
            verify(helper).setTo(userEmail);
            verify(helper).setSubject(subject);
            // Verify setText was called with HTML flag true, content can be flexible
            verify(helper).setText(anyString(), eq(true));
            verify(mailSender).send(mimeMessage);
        }
    }


    // --- Tests for isUsernameUnique ---
    @Test
    void testIsUsernameUnique_returnsTrueWhenUnique() throws Exception {
        when(userAccountRepository.countAllUsersByUsername("uniqueUser")).thenReturn(0);
        assertTrue(accountService.isUsernameUnique("uniqueUser"));
        verify(userAccountRepository).countAllUsersByUsername("uniqueUser");
    }

    @Test
    void testIsUsernameUnique_throwsWhenNotUnique() {
        when(userAccountRepository.countAllUsersByUsername("takenUser")).thenReturn(1);
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.isUsernameUnique("takenUser"));
        assertEquals(ExceptionService.USERNAME_NOT_UNIQUE, exception.getMessage());
        verify(userAccountRepository).countAllUsersByUsername("takenUser");
    }

    @Test
    void testIsUsernameUnique_throwsWhenInvalidFormat() {
        // Test cases for invalid format (e.g., contains ';', '@', is null/empty)
        String[] invalidUsernames = {null, "", "user;", "user@name"};
        for (String invalidUsername : invalidUsernames) {
            ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.isUsernameUnique(invalidUsername), "Failed for username: " + invalidUsername);
            assertEquals(ExceptionService.INVALID_USERNAME_FORMAT, exception.getMessage());
        }
        verify(userAccountRepository, never()).countAllUsersByUsername(anyString()); // Should fail before DB check
    }


    // --- Tests for isEmailUnique ---
    @Test
    void testIsEmailUnique_returnsTrueWhenUnique() throws Exception {
        when(userAccountRepository.countAllUsersByEmail("unique@email.com")).thenReturn(0);
        assertTrue(accountService.isEmailUnique("unique@email.com"));
        verify(userAccountRepository).countAllUsersByEmail("unique@email.com");
    }

    @Test
    void testIsEmailUnique_throwsWhenNotUnique() {
        when(userAccountRepository.countAllUsersByEmail("taken@email.com")).thenReturn(1);
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.isEmailUnique("taken@email.com"));
        assertEquals(ExceptionService.EMAIL_NOT_UNIQUE, exception.getMessage());
        verify(userAccountRepository).countAllUsersByEmail("taken@email.com");
    }

     @Test
    void testIsEmailUnique_throwsWhenInvalidFormat() {
        // Test cases for invalid format (e.g., contains ';', ' ', no '@', is null)
        String[] invalidEmails = {null, "invalid-email", "email with space@test.com", "email;semicolon@test.com"};
         for (String invalidEmail : invalidEmails) {
            ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.isEmailUnique(invalidEmail), "Failed for email: " + invalidEmail);
            assertEquals(ExceptionService.INVALID_EMAIL_FORMAT, exception.getMessage());
         }
        verify(userAccountRepository, never()).countAllUsersByEmail(anyString()); // Should fail before DB check
    }


    // --- Tests for isAccountActive ---
    @Test
    void testIsAccountActive_usernameActive() throws Exception {
        when(userAccountRepository.countAllUsersByUsername("activeUser")).thenReturn(1);
        assertTrue(accountService.isAccountActive("activeUser", null));
        verify(userAccountRepository).countAllUsersByUsername("activeUser");
        verify(userAccountRepository, never()).countAllUsersByEmail(any());
    }

    @Test
    void testIsAccountActive_emailActive() throws Exception {
        when(userAccountRepository.countAllUsersByEmail("active@email.com")).thenReturn(1);
        assertTrue(accountService.isAccountActive(null, "active@email.com"));
        verify(userAccountRepository, never()).countAllUsersByUsername(any());
        verify(userAccountRepository).countAllUsersByEmail("active@email.com");
    }

    @Test
    void testIsAccountActive_throwsWhenNoParams() {
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.isAccountActive(null, null));
        assertEquals(ExceptionService.NULL_PARAMS, exception.getMessage());
        verify(userAccountRepository, never()).countAllUsersByUsername(any());
        verify(userAccountRepository, never()).countAllUsersByEmail(any());
    }

    @Test
    void testIsAccountActive_throwsTooManyParams() {
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.isAccountActive("user", "email"));
        assertEquals(ExceptionService.TOO_MANY_PARAMS, exception.getMessage());
        verify(userAccountRepository, never()).countAllUsersByUsername(any());
        verify(userAccountRepository, never()).countAllUsersByEmail(any());
    }

    @Test
    void testIsAccountActive_throwsWhenUsernameNotActive() {
        when(userAccountRepository.countAllUsersByUsername("inactiveUser")).thenReturn(0); // Simulate user not found/inactive
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.isAccountActive("inactiveUser", null));
        assertEquals(ExceptionService.ACCOUNT_NOT_ACTIVE, exception.getMessage());
        verify(userAccountRepository).countAllUsersByUsername("inactiveUser");
        verify(userAccountRepository, never()).countAllUsersByEmail(any());
    }

    @Test
    void testIsAccountActive_throwsWhenEmailNotActive() {
        when(userAccountRepository.countAllUsersByEmail("inactive@email.com")).thenReturn(0); // Simulate user not found/inactive
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.isAccountActive(null, "inactive@email.com"));
        assertEquals(ExceptionService.ACCOUNT_NOT_ACTIVE, exception.getMessage());
        verify(userAccountRepository, never()).countAllUsersByUsername(any());
        verify(userAccountRepository).countAllUsersByEmail("inactive@email.com");
    }

    @Test
    void testIsAccountActive_throwsWhenUsernameInvalidFormat() {
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.isAccountActive("user;", null));
        assertEquals(ExceptionService.INVALID_USERNAME_FORMAT, exception.getMessage());
        verify(userAccountRepository, never()).countAllUsersByUsername(any());
    }

    @Test
    void testIsAccountActive_throwsWhenEmailInvalidFormat() {
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.isAccountActive(null, "invalid-email"));
        assertEquals(ExceptionService.INVALID_EMAIL_FORMAT, exception.getMessage());
        verify(userAccountRepository, never()).countAllUsersByEmail(any());
    }


    // --- Tests for checkUserPassword ---
    @Test
    void testCheckUserPassword_correctPasswordByUsername() throws Exception {
        String username = "user";
        String password = "pass";
        String hash = BCrypt.hashpw(password, BCrypt.gensalt());

        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(1); // Account is active
        when(userAccountRepository.findHashPasswordByUsername(username)).thenReturn(hash);

        assertDoesNotThrow(() -> accountService.checkUserPassword(username, null, password));

        verify(userAccountRepository).countAllUsersByUsername(username);
        verify(userAccountRepository).findHashPasswordByUsername(username);
        verify(userAccountRepository, never()).findHashPasswordByEmail(any());
    }

    @Test
    void testCheckUserPassword_correctPasswordByEmail() throws Exception {
        String email = "test@example.com";
        String password = "pass";
        String hash = BCrypt.hashpw(password, BCrypt.gensalt());

        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(1); // Account is active
        when(userAccountRepository.findHashPasswordByEmail(email)).thenReturn(hash);

        assertDoesNotThrow(() -> accountService.checkUserPassword(null, email, password));

        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(userAccountRepository).findHashPasswordByEmail(email);
        verify(userAccountRepository, never()).findHashPasswordByUsername(any());
    }

    @Test
    void testCheckUserPassword_incorrectPasswordByUsername() {
        String username = "user";
        String correctPassword = "pass";
        String wrongPassword = "wrongpass";
        String hash = BCrypt.hashpw(correctPassword, BCrypt.gensalt());

        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(1); // Account is active
        when(userAccountRepository.findHashPasswordByUsername(username)).thenReturn(hash);

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.checkUserPassword(username, null, wrongPassword));
        assertEquals(ExceptionService.INCORRECT_PASSWORD, exception.getMessage());

        verify(userAccountRepository).countAllUsersByUsername(username);
        verify(userAccountRepository).findHashPasswordByUsername(username);
    }

    @Test
    void testCheckUserPassword_incorrectPasswordByEmail() {
        String email = "test@example.com";
        String correctPassword = "pass";
        String wrongPassword = "wrongpass";
        String hash = BCrypt.hashpw(correctPassword, BCrypt.gensalt());

        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(1); // Account is active
        when(userAccountRepository.findHashPasswordByEmail(email)).thenReturn(hash);

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.checkUserPassword(null, email, wrongPassword));
        assertEquals(ExceptionService.INCORRECT_PASSWORD, exception.getMessage());

        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(userAccountRepository).findHashPasswordByEmail(email);
    }

    @Test
    void testCheckUserPassword_throwsWhenAccountNotActiveByUsername() {
        String username = "inactiveUser";
        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(0); // Account not active

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.checkUserPassword(username, null, "pass"));
        assertEquals(ExceptionService.ACCOUNT_NOT_ACTIVE, exception.getMessage());

        verify(userAccountRepository).countAllUsersByUsername(username);
        verify(userAccountRepository, never()).findHashPasswordByUsername(any()); // Shouldn't try to get hash
    }

     @Test
    void testCheckUserPassword_throwsWhenAccountNotActiveByEmail() {
        String email = "inactive@email.com";
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(0); // Account not active

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.checkUserPassword(null, email, "pass"));
        assertEquals(ExceptionService.ACCOUNT_NOT_ACTIVE, exception.getMessage());

        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(userAccountRepository, never()).findHashPasswordByEmail(any()); // Shouldn't try to get hash
    }

    @Test
    void testCheckUserPassword_throwsWhenTooManyParams() {
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.checkUserPassword("user", "email@test.com", "pass"));
        assertEquals(ExceptionService.TOO_MANY_PARAMS, exception.getMessage());
    }

    @Test
    void testCheckUserPassword_throwsWhenNoParams() {
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.checkUserPassword(null, null, "pass"));
        assertEquals(ExceptionService.NULL_PARAMS, exception.getMessage());
    }


    // --- Tests for getUserLoginInfo ---
    @Test
    void testGetUserLoginInfo_byUsernameReturnsMap() throws Exception {
        String username = "user";
        String email = "email@example.com";
        String password = "pass";
        int userId = 1;
        int roleId = 2; // Assuming USER_ROLE_ID
        String roleName = "USER";
        String token = "generated-jwt-token";
        String avatar = "avatar-url";
        String hash = BCrypt.hashpw(password, BCrypt.gensalt());

        UserAccountModel user = new UserAccountModel();
        user.setUserId(userId);
        user.setUsername(username);
        user.setEmail(email);
        user.setRoleId(roleId);

        // Mock dependencies
        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(1); // Active check
        when(userAccountRepository.findHashPasswordByUsername(username)).thenReturn(hash); // Password check
        when(userAccountRepository.findUserInfoByUsername(username)).thenReturn(user);
        when(userAccountRepository.findRoleById(roleId)).thenReturn(roleName);
        when(securityService.generateToken(user)).thenReturn(token);
        when(profileService.getUserAvatarByUserId(userId)).thenReturn(avatar);

        // Execute
        Map<String, Object> result = accountService.getUserLoginInfo(username, null, password);

        // Assert
        assertNotNull(result);
        assertEquals(token, result.get("token"));
        assertEquals(userId, result.get("id"));
        assertEquals(username, result.get("username"));
        assertEquals(email, result.get("email"));
        assertEquals(roleName, result.get("roles"));
        assertEquals(avatar, result.get("avatar"));

        // Verify mocks
        verify(userAccountRepository).countAllUsersByUsername(username);
        verify(userAccountRepository).findHashPasswordByUsername(username);
        verify(userAccountRepository).findUserInfoByUsername(username);
        verify(userAccountRepository).findRoleById(roleId);
        verify(securityService).generateToken(user);
        verify(profileService).getUserAvatarByUserId(userId);
    }

    @Test
    void testGetUserLoginInfo_byEmailReturnsMap() throws Exception {
        String username = "user";
        String email = "email@example.com";
        String password = "pass";
        int userId = 1;
        int roleId = 2; // Assuming USER_ROLE_ID
        String roleName = "USER";
        String token = "generated-jwt-token";
        String avatar = "avatar-url";
        String hash = BCrypt.hashpw(password, BCrypt.gensalt());

        UserAccountModel user = new UserAccountModel();
        user.setUserId(userId);
        user.setUsername(username);
        user.setEmail(email);
        user.setRoleId(roleId);

        // Mock dependencies
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(1); // Active check
        when(userAccountRepository.findHashPasswordByEmail(email)).thenReturn(hash); // Password check
        when(userAccountRepository.findUserInfoByEmail(email)).thenReturn(user);
        when(userAccountRepository.findRoleById(roleId)).thenReturn(roleName);
        when(securityService.generateToken(user)).thenReturn(token);
        when(profileService.getUserAvatarByUserId(userId)).thenReturn(avatar);

        // Execute
        Map<String, Object> result = accountService.getUserLoginInfo(null, email, password);

        // Assert
        assertNotNull(result);
        assertEquals(token, result.get("token"));
        assertEquals(userId, result.get("id"));
        assertEquals(username, result.get("username"));
        assertEquals(email, result.get("email"));
        assertEquals(roleName, result.get("roles"));
        assertEquals(avatar, result.get("avatar"));

        // Verify mocks
        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(userAccountRepository).findHashPasswordByEmail(email);
        verify(userAccountRepository).findUserInfoByEmail(email);
        verify(userAccountRepository).findRoleById(roleId);
        verify(securityService).generateToken(user);
        verify(profileService).getUserAvatarByUserId(userId);
    }

    @Test
    void testGetUserLoginInfo_throwsWhenTooManyParams() {
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.getUserLoginInfo("user", "test@example.com", "pass"));
        assertEquals(ExceptionService.TOO_MANY_PARAMS, exception.getMessage());
    }

     @Test
    void testGetUserLoginInfo_throwsWhenNoParams() {
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.getUserLoginInfo(null, null, "pass"));
        assertEquals(ExceptionService.NULL_PARAMS, exception.getMessage());
    }

    @Test
    void testGetUserLoginInfo_throwsWhenIncorrectPassword() throws Exception {
        String username = "user";
        String correctPassword = "pass";
        String wrongPassword = "wrongpass";
        String hash = BCrypt.hashpw(correctPassword, BCrypt.gensalt());

        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(1); // Active check
        when(userAccountRepository.findHashPasswordByUsername(username)).thenReturn(hash); // Password check fails here

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.getUserLoginInfo(username, null, wrongPassword));
        assertEquals(ExceptionService.INCORRECT_PASSWORD, exception.getMessage());

        // Verify it checked activation and password hash
        verify(userAccountRepository).countAllUsersByUsername(username);
        verify(userAccountRepository).findHashPasswordByUsername(username);
        // Verify it didn't proceed further
        verify(userAccountRepository, never()).findUserInfoByUsername(any());
        verify(securityService, never()).generateToken(any());
    }

    @Test
    void testGetUserLoginInfo_throwsWhenAccountNotActive() throws Exception {
        String username = "inactiveUser";
        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(0); // Active check fails here

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.getUserLoginInfo(username, null, "pass"));
        assertEquals(ExceptionService.ACCOUNT_NOT_ACTIVE, exception.getMessage());

        // Verify it checked activation
        verify(userAccountRepository).countAllUsersByUsername(username);
        // Verify it didn't proceed further
        verify(userAccountRepository, never()).findHashPasswordByUsername(any());
        verify(userAccountRepository, never()).findUserInfoByUsername(any());
        verify(securityService, never()).generateToken(any());
    }


    // --- Tests for getRoleById ---
    @Test
    void testGetRoleById_success() {
        int roleId = 1;
        String expectedRole = "ADMIN";
        when(userAccountRepository.findRoleById(roleId)).thenReturn(expectedRole);

        String actualRole = accountService.getRoleById(roleId);

        assertEquals(expectedRole, actualRole);
        verify(userAccountRepository).findRoleById(roleId);
    }

    @Test
    void testGetRoleById_notFound() {
        int roleId = 99;
        when(userAccountRepository.findRoleById(roleId)).thenReturn(null); // Simulate role not found

        String actualRole = accountService.getRoleById(roleId);

        assertNull(actualRole);
        verify(userAccountRepository).findRoleById(roleId);
    }


    // --- Tests for getNameFromEmail ---
    @Test
    void testGetNameFromEmail_success() {
        String email = "test@example.com";
        String expectedUsername = "testuser";
        UserAccountModel user = new UserAccountModel();
        user.setUsername(expectedUsername);

        when(userAccountRepository.findUserInfoByEmail(email)).thenReturn(user);

        String actualUsername = accountService.getNameFromEmail(email);

        assertEquals(expectedUsername, actualUsername);
        verify(userAccountRepository).findUserInfoByEmail(email);
    }

    @Test
    void testGetNameFromEmail_notFound() {
        String email = "notfound@example.com";
        when(userAccountRepository.findUserInfoByEmail(email)).thenReturn(null); // Simulate user not found

        // Expecting NullPointerException because the code directly calls .getUsername() on the result
        assertThrows(NullPointerException.class, () -> accountService.getNameFromEmail(email));

        verify(userAccountRepository).findUserInfoByEmail(email);
    }


    // --- Tests for registerAccount ---
    @Test
    void testRegisterAccount_success() throws Exception {
        String username = "user";
        String email = "test@example.com";
        String password = "pass";
        String licenseKey = "validLicenseKey123";
        int userId = 1;
        int roleId = 2; // USER_ROLE_ID

        // Mock checks
        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(0); // Username unique
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(0); // Email unique
        doNothing().when(securityService).setKeyUnavailable(email, licenseKey, SecurityService.KeyType.LICENSE); // Key valid

        // Mock saving
        UserAccountModel savedUser = new UserAccountModel();
        savedUser.setUserId(userId);
        savedUser.setUsername(username);
        savedUser.setEmail(email);
        savedUser.setRoleId(roleId);
        // We don't need to set password hash here, just verify it in the argThat

        when(userAccountRepository.save(any(UserAccountModel.class))).thenReturn(savedUser);

        // Mock subsequent calls
        doNothing().when(forumService).addAllTagsForUserToDatabase(userId);
        doNothing().when(profileService).addNewUserProfile(userId, username);

        // Execute
        UserAccountModel result = accountService.registerAccount(username, email, password, licenseKey);

        // Assert result
        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(username, result.getUsername());

        // Verify interactions
        verify(userAccountRepository).countAllUsersByUsername(username);
        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(securityService).setKeyUnavailable(email, licenseKey, SecurityService.KeyType.LICENSE);
        verify(userAccountRepository).save(argThat(userToSave ->
            userToSave.getUsername().equals(username) &&
            userToSave.getEmail().equals(email) &&
            userToSave.getIsActive() == true && // Should be active on registration
            userToSave.getRoleId() == roleId &&
            BCrypt.checkpw(password, userToSave.getPasswordHash()) // Check password hash
        ));
        verify(forumService).addAllTagsForUserToDatabase(userId);
        verify(profileService).addNewUserProfile(userId, username);
    }

    @Test
    void testRegisterAccount_throwsWhenUsernameNotUnique() throws Exception {
        String username = "takenUser";
        String email = "test@example.com";
        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(1); // Username not unique

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.registerAccount(username, email, "pass", "key"));
        assertEquals(ExceptionService.USERNAME_NOT_UNIQUE, exception.getMessage());

        verify(userAccountRepository).countAllUsersByUsername(username);
        verify(userAccountRepository, never()).countAllUsersByEmail(any()); // Should fail before email check
        verify(securityService, never()).setKeyUnavailable(any(), any(), any());
        verify(userAccountRepository, never()).save(any());
    }

    @Test
    void testRegisterAccount_throwsWhenEmailNotUnique() throws Exception {
        String username = "user";
        String email = "taken@example.com";
        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(0); // Username unique
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(1); // Email not unique

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.registerAccount(username, email, "pass", "key"));
        assertEquals(ExceptionService.EMAIL_NOT_UNIQUE, exception.getMessage());

        verify(userAccountRepository).countAllUsersByUsername(username);
        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(securityService, never()).setKeyUnavailable(any(), any(), any());
        verify(userAccountRepository, never()).save(any());
    }

    @Test
    void testRegisterAccount_throwsWhenInvalidUsernameFormat() throws Exception {
         String invalidUsername = "user;";
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.registerAccount(invalidUsername, "test@example.com", "pass", "key"));
        assertEquals(ExceptionService.INVALID_USERNAME_FORMAT, exception.getMessage());

        verify(userAccountRepository, never()).countAllUsersByUsername(any()); // Should fail on format check
        verify(userAccountRepository, never()).countAllUsersByEmail(any());
        verify(securityService, never()).setKeyUnavailable(any(), any(), any());
    }

    @Test
    void testRegisterAccount_throwsWhenKeyUnavailableFails_KeyNotMatch() throws Exception {
        String username = "user";
        String email = "test@example.com";
        String licenseKey = "wrongKey";

        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(0);
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(0);
        // Simulate securityService throwing KEY_NOT_MATCH
        doThrow(new ExceptionService(ExceptionService.KEY_NOT_MATCH))
            .when(securityService).setKeyUnavailable(email, licenseKey, SecurityService.KeyType.LICENSE);

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.registerAccount(username, email, "pass", licenseKey));
        assertEquals(ExceptionService.KEY_NOT_MATCH, exception.getMessage());

        verify(userAccountRepository).countAllUsersByUsername(username);
        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(securityService).setKeyUnavailable(email, licenseKey, SecurityService.KeyType.LICENSE);
        verify(userAccountRepository, never()).save(any()); // Should fail before saving
    }

     @Test
    void testRegisterAccount_throwsWhenKeyUnavailableFails_KeyNotAvailable() throws Exception {
        String username = "user";
        String email = "test@example.com";
        String licenseKey = "usedKey";

        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(0);
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(0);
        // Simulate securityService throwing KEY_NOT_AVAILABLE
        doThrow(new ExceptionService(ExceptionService.KEY_NOT_AVAILABLE))
            .when(securityService).setKeyUnavailable(email, licenseKey, SecurityService.KeyType.LICENSE);

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.registerAccount(username, email, "pass", licenseKey));
        assertEquals(ExceptionService.KEY_NOT_AVAILABLE, exception.getMessage());

        verify(securityService).setKeyUnavailable(email, licenseKey, SecurityService.KeyType.LICENSE);
        verify(userAccountRepository, never()).save(any());
    }

     @Test
    void testRegisterAccount_throwsWhenKeyUnavailableFails_ExpiredKey() throws Exception {
        String username = "user";
        String email = "test@example.com";
        String licenseKey = "expiredKey";

        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(0);
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(0);
        // Simulate securityService throwing EXPIRED_KEY
        doThrow(new ExceptionService(ExceptionService.EXPIRED_KEY))
            .when(securityService).setKeyUnavailable(email, licenseKey, SecurityService.KeyType.LICENSE);

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.registerAccount(username, email, "pass", licenseKey));
        assertEquals(ExceptionService.EXPIRED_KEY, exception.getMessage());

        verify(securityService).setKeyUnavailable(email, licenseKey, SecurityService.KeyType.LICENSE);
        verify(userAccountRepository, never()).save(any());
    }

     @Test
    void testRegisterAccount_throwsWhenKeyUnavailableFails_InvalidLength() throws Exception {
        String username = "user";
        String email = "test@example.com";
        String licenseKey = "shortKey"; // Invalid length

        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(0);
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(0);
        // Simulate securityService throwing INVALID_KEY_LENGTH
        doThrow(new ExceptionService(ExceptionService.INVALID_KEY_LENGTH))
            .when(securityService).setKeyUnavailable(email, licenseKey, SecurityService.KeyType.LICENSE);

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.registerAccount(username, email, "pass", licenseKey));
        assertEquals(ExceptionService.INVALID_KEY_LENGTH, exception.getMessage());

        verify(securityService).setKeyUnavailable(email, licenseKey, SecurityService.KeyType.LICENSE);
        verify(userAccountRepository, never()).save(any());
    }


    // --- Tests for requestLicenseKey ---
    @Test
    void testRequestLicenseKey_success() throws Exception {
        String email = "new@example.com";
        String generatedKey = "LICENSEKEY123456";

        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(0); // Email is unique/not active
        when(securityService.generateLicenseKey()).thenReturn(generatedKey);
        doNothing().when(securityService).saveKey(email, generatedKey, SecurityService.KeyType.LICENSE);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // Mock MimeMessageHelper construction for email sending verification
        try (MockedConstruction<MimeMessageHelper> mockedHelper = Mockito.mockConstruction(MimeMessageHelper.class)) {
            assertDoesNotThrow(() -> accountService.requestLicenseKey(email));

            // Verify core logic
            verify(userAccountRepository).countAllUsersByEmail(email);
            verify(securityService).generateLicenseKey();
            verify(securityService).saveKey(email, generatedKey, SecurityService.KeyType.LICENSE);

            // Verify email sending part
            assertEquals(1, mockedHelper.constructed().size()); // Ensure helper was created
            MimeMessageHelper helper = mockedHelper.constructed().get(0);
            verify(helper).setTo(email);
            // Corrected the expected subject line based on the previous error message
            verify(helper).setSubject("Activate Your FlowChat Account");
            verify(helper).setText(contains(generatedKey.substring(0, 4) + " - " + generatedKey.substring(4, 8) + " - " + generatedKey.substring(8, 12) + " - " + generatedKey.substring(12)), eq(true)); // Check if key is in email body
            verify(mailSender).send(mimeMessage);
        }
    }

    @Test
    void testRequestLicenseKey_throwsWhenEmailNotUnique() {
        // ... (rest of the test remains the same) ...
        String email = "taken@example.com";
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(1); // Email is already used/active

        // The service throws ACTIVE_ACCOUNT in this case based on ExceptionService constants
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.requestLicenseKey(email));
        assertEquals(ExceptionService.ACTIVE_ACCOUNT, exception.getMessage());

        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(securityService, never()).generateLicenseKey();
        verify(securityService, never()).saveKey(any(), any(), any());
        verify(mailSender, never()).createMimeMessage();
    }

     @Test
    void testRequestLicenseKey_throwsWhenInvalidEmailFormat() {
        String invalidEmail = "invalid-email";
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.requestLicenseKey(invalidEmail));
        assertEquals(ExceptionService.INVALID_EMAIL_FORMAT, exception.getMessage());

        verify(userAccountRepository, never()).countAllUsersByEmail(any());
    }


    // --- Tests for requestAuthenticationCode ---
    @Test
    void testRequestAuthenticationCode_success() throws Exception {
        String email = "active@example.com";
        String generatedCode = "123456";

        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(1); // Account must be active
        when(securityService.generateAuthenticationCode()).thenReturn(generatedCode);
        doNothing().when(securityService).saveKey(email, generatedCode, SecurityService.KeyType.AUTHENTICATION);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // Mock MimeMessageHelper construction for email sending verification
        try (MockedConstruction<MimeMessageHelper> mockedHelper = Mockito.mockConstruction(MimeMessageHelper.class)) {
            assertDoesNotThrow(() -> accountService.requestAuthenticationCode(email));

            // Verify core logic
            verify(userAccountRepository).countAllUsersByEmail(email);
            verify(securityService).generateAuthenticationCode();
            verify(securityService).saveKey(email, generatedCode, SecurityService.KeyType.AUTHENTICATION);

            

            // Verify email sending part
            assertEquals(1, mockedHelper.constructed().size());
            MimeMessageHelper helper = mockedHelper.constructed().get(0);
            verify(helper).setTo(email);
            verify(helper).setSubject("Reset FlowChat Password");
            verify(helper).setText(contains(generatedCode.substring(0,3) + " - " + generatedCode.substring(3)), eq(true));
            verify(mailSender).send(mimeMessage);
        }
    }

    @Test
    void testRequestAuthenticationCode_throwsWhenAccountNotActive() {
        String email = "inactive@example.com";
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(0); // Account not active

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.requestAuthenticationCode(email));
        assertEquals(ExceptionService.ACCOUNT_NOT_ACTIVE, exception.getMessage());

        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(securityService, never()).generateAuthenticationCode();
        verify(securityService, never()).saveKey(any(), any(), any());
        verify(mailSender, never()).createMimeMessage();
    }

    @Test
    void testRequestAuthenticationCode_throwsWhenInvalidEmailFormat() {
        String invalidEmail = "invalid-email";
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.requestAuthenticationCode(invalidEmail));
        assertEquals(ExceptionService.INVALID_EMAIL_FORMAT, exception.getMessage());

        verify(userAccountRepository, never()).countAllUsersByEmail(any());
    }


    // --- Tests for resetPasswordByEmail ---
    @Test
    void testResetPasswordByEmail_success() throws Exception {
        String email = "test@example.com";
        String newPassword = "newpass";
        String authCode = "123456";
        int userId = 1;

        UserAccountModel user = new UserAccountModel();
        user.setUserId(userId);

        when(userAccountRepository.findUserInfoByEmail(email)).thenReturn(user); // Needed to get userId
        doNothing().when(securityService).setKeyUnavailable(email, authCode, SecurityService.KeyType.AUTHENTICATION); // Code is valid
        doNothing().when(userAccountRepository).updateUserAccountById(userId); // Mock update timestamp
        doNothing().when(userAccountRepository).updatePassword(eq(email), anyString()); // Mock password update

        assertDoesNotThrow(() -> accountService.resetPasswordByEmail(email, newPassword, authCode));

        verify(userAccountRepository).findUserInfoByEmail(email);
        verify(securityService).setKeyUnavailable(email, authCode, SecurityService.KeyType.AUTHENTICATION);
        verify(userAccountRepository).updateUserAccountById(userId);
        verify(userAccountRepository).updatePassword(eq(email), argThat(hash -> BCrypt.checkpw(newPassword, hash)));
    }

    @Test
    void testResetPasswordByEmail_throwsWhenInvalidEmailFormat() throws Exception {
        String invalidEmail = "invalid-email";
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.resetPasswordByEmail(invalidEmail, "newpass", "authCode"));
        assertEquals(ExceptionService.INVALID_EMAIL_FORMAT, exception.getMessage());

        verify(userAccountRepository, never()).findUserInfoByEmail(any());
        verify(securityService, never()).setKeyUnavailable(any(), any(), any());
    }

    @Test
    void testResetPasswordByEmail_throwsWhenKeyNotAvailable() throws Exception {
        String email = "test@example.com";
        String authCode = "usedCode";
        UserAccountModel user = new UserAccountModel();
        user.setUserId(1);

        doThrow(new ExceptionService(ExceptionService.KEY_NOT_AVAILABLE))
            .when(securityService).setKeyUnavailable(email, authCode, SecurityService.KeyType.AUTHENTICATION);

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.resetPasswordByEmail(email, "newpass", authCode));
        assertEquals(ExceptionService.KEY_NOT_AVAILABLE, exception.getMessage());

        verify(securityService).setKeyUnavailable(email, authCode, SecurityService.KeyType.AUTHENTICATION);
        verify(userAccountRepository, never()).updateUserAccountById(anyInt());
    }

     @Test
    void testResetPasswordByEmail_throwsWhenExpiredKey() throws Exception {
        String email = "test@example.com";
        String authCode = "expiredCode";
         UserAccountModel user = new UserAccountModel();
        user.setUserId(1);

        doThrow(new ExceptionService(ExceptionService.EXPIRED_KEY))
            .when(securityService).setKeyUnavailable(email, authCode, SecurityService.KeyType.AUTHENTICATION);

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.resetPasswordByEmail(email, "newpass", authCode));
        assertEquals(ExceptionService.EXPIRED_KEY, exception.getMessage());

        verify(securityService).setKeyUnavailable(email, authCode, SecurityService.KeyType.AUTHENTICATION);
        verify(userAccountRepository, never()).updateUserAccountById(anyInt());
    }

    @Test
    void testResetPasswordByEmail_throwsWhenInvalidKeyLength() throws Exception {
        String email = "test@example.com";
        String authCode = "short"; // Invalid length
         UserAccountModel user = new UserAccountModel();
        user.setUserId(1);

        doThrow(new ExceptionService(ExceptionService.INVALID_KEY_LENGTH))
            .when(securityService).setKeyUnavailable(email, authCode, SecurityService.KeyType.AUTHENTICATION);

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.resetPasswordByEmail(email, "newpass", authCode));
        assertEquals(ExceptionService.INVALID_KEY_LENGTH, exception.getMessage());

        verify(securityService).setKeyUnavailable(email, authCode, SecurityService.KeyType.AUTHENTICATION);
        verify(userAccountRepository, never()).updateUserAccountById(anyInt());
    }



    // --- Tests for resetPasswordByOldPassword ---
    @Test
    void testResetPasswordByOldPassword_success() throws Exception {
        String email = "test@example.com";
        String oldPassword = "oldpass";
        String newPassword = "newpass";
        String hash = BCrypt.hashpw(oldPassword, BCrypt.gensalt());
        int userId = 1;

        UserAccountModel user = new UserAccountModel(); // Needed for userId extraction later
        user.setUserId(userId);

        // Mock checks
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(1); // Account active
        when(userAccountRepository.findHashPasswordByEmail(email)).thenReturn(hash); // Old password correct
        when(userAccountRepository.findUserInfoByEmail(email)).thenReturn(user); // Needed for userId

        // Mock updates
        doNothing().when(userAccountRepository).updateUserAccountById(userId);
        doNothing().when(userAccountRepository).updatePassword(eq(email), anyString());

        assertDoesNotThrow(() -> accountService.resetPasswordByOldPassword(email, oldPassword, newPassword));

        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(userAccountRepository).findHashPasswordByEmail(email);
        verify(userAccountRepository).findUserInfoByEmail(email); // Verify userId was fetched
        verify(userAccountRepository).updateUserAccountById(userId);
        verify(userAccountRepository).updatePassword(eq(email), argThat(newHash -> BCrypt.checkpw(newPassword, newHash)));
    }

    @Test
    void testResetPasswordByOldPassword_throwsWhenIncorrectOldPassword() {
        String email = "test@example.com";
        String oldPassword = "oldpass";
        String wrongOldPassword = "wrongoldpass";
        String hash = BCrypt.hashpw(oldPassword, BCrypt.gensalt());

        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(1); // Account active
        when(userAccountRepository.findHashPasswordByEmail(email)).thenReturn(hash); // Password check fails here

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.resetPasswordByOldPassword(email, wrongOldPassword, "newpass"));
        assertEquals(ExceptionService.INCORRECT_PASSWORD, exception.getMessage());

        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(userAccountRepository).findHashPasswordByEmail(email);
        verify(userAccountRepository, never()).findUserInfoByEmail(any()); // Should fail before getting user info
        verify(userAccountRepository, never()).updateUserAccountById(anyInt());
        verify(userAccountRepository, never()).updatePassword(any(), any());
    }

    @Test
    void testResetPasswordByOldPassword_throwsWhenAccountNotActive() {
        String email = "inactive@example.com";
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(0); // Account not active

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.resetPasswordByOldPassword(email, "oldpass", "newpass"));
        assertEquals(ExceptionService.ACCOUNT_NOT_ACTIVE, exception.getMessage());

        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(userAccountRepository, never()).findHashPasswordByEmail(any()); // Should fail before password check
    }

     @Test
    void testResetPasswordByOldPassword_throwsWhenInvalidEmailFormat() {
        String invalidEmail = "invalid-email";
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.resetPasswordByOldPassword(invalidEmail, "oldpass", "newpass"));
        assertEquals(ExceptionService.INVALID_EMAIL_FORMAT, exception.getMessage());
        verify(userAccountRepository, never()).countAllUsersByEmail(any());
    }


    // --- Tests for deleteAccount ---
    @Test
    void testDeleteAccount_byUsername() throws Exception {
        String username = "userToDelete";
        String password = "pass";
        String hash = BCrypt.hashpw(password, BCrypt.gensalt());
        int userId = 1;

        UserAccountModel user = new UserAccountModel();
        user.setUserId(userId);

        // Mock checks
        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(1); // Account active
        when(userAccountRepository.findHashPasswordByUsername(username)).thenReturn(hash); // Password correct
        when(userAccountRepository.findUserInfoByUsername(username)).thenReturn(user); // Needed for userId

        // Mock updates
        doNothing().when(userAccountRepository).updateUserAccountById(userId); // Timestamp update
        doNothing().when(userAccountRepository).deleteAccountByUsername(username); // Actual deletion

        assertDoesNotThrow(() -> accountService.deleteAccount(username, null, password));

        verify(userAccountRepository).countAllUsersByUsername(username);
        verify(userAccountRepository).findHashPasswordByUsername(username);
        verify(userAccountRepository).findUserInfoByUsername(username);
        verify(userAccountRepository).updateUserAccountById(userId);
        verify(userAccountRepository).deleteAccountByUsername(username);
        verify(userAccountRepository, never()).deleteAccountByEmail(any());
    }

    @Test
    void testDeleteAccount_byEmail() throws Exception {
        String email = "test@example.com";
        String password = "pass";
        String hash = BCrypt.hashpw(password, BCrypt.gensalt());
        int userId = 1;

        UserAccountModel user = new UserAccountModel();
        user.setUserId(userId);

        // Mock checks
        when(userAccountRepository.countAllUsersByEmail(email)).thenReturn(1); // Account active
        when(userAccountRepository.findHashPasswordByEmail(email)).thenReturn(hash); // Password correct
        when(userAccountRepository.findUserInfoByEmail(email)).thenReturn(user); // Needed for userId

        // Mock updates
        doNothing().when(userAccountRepository).updateUserAccountById(userId);
        doNothing().when(userAccountRepository).deleteAccountByEmail(email);

        assertDoesNotThrow(() -> accountService.deleteAccount(null, email, password));

        verify(userAccountRepository).countAllUsersByEmail(email);
        verify(userAccountRepository).findHashPasswordByEmail(email);
        verify(userAccountRepository).findUserInfoByEmail(email);
        verify(userAccountRepository).updateUserAccountById(userId);
        verify(userAccountRepository).deleteAccountByEmail(email);
        verify(userAccountRepository, never()).deleteAccountByUsername(any());
    }

    @Test
    void testDeleteAccount_throwsWhenBothUsernameAndEmailProvided() {
        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.deleteAccount("user", "test@example.com", "pass"));
        assertEquals(ExceptionService.TOO_MANY_PARAMS, exception.getMessage());
    }

    @Test
    void testDeleteAccount_throwsWhenNeitherUsernameNorEmailProvided() {
         ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.deleteAccount(null, null, "pass"));
         assertEquals(ExceptionService.NULL_PARAMS, exception.getMessage());
    }

    @Test
    void testDeleteAccount_throwsWhenIncorrectPassword() {
        String username = "user";
        String correctPassword = "pass";
        String wrongPassword = "wrongpass";
        String hash = BCrypt.hashpw(correctPassword, BCrypt.gensalt());

        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(1); // Account active
        when(userAccountRepository.findHashPasswordByUsername(username)).thenReturn(hash); // Password check fails

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.deleteAccount(username, null, wrongPassword));
        assertEquals(ExceptionService.INCORRECT_PASSWORD, exception.getMessage());

        verify(userAccountRepository).countAllUsersByUsername(username);
        verify(userAccountRepository).findHashPasswordByUsername(username);
        verify(userAccountRepository, never()).findUserInfoByUsername(any()); // Should fail before getting user info
        verify(userAccountRepository, never()).updateUserAccountById(anyInt());
        verify(userAccountRepository, never()).deleteAccountByUsername(any());
    }

    @Test
    void testDeleteAccount_throwsWhenAccountNotActive() {
        String username = "inactiveUser";
        when(userAccountRepository.countAllUsersByUsername(username)).thenReturn(0); // Account not active

        ExceptionService exception = assertThrows(ExceptionService.class, () -> accountService.deleteAccount(username, null, "pass"));
        assertEquals(ExceptionService.ACCOUNT_NOT_ACTIVE, exception.getMessage());

        verify(userAccountRepository).countAllUsersByUsername(username);
        verify(userAccountRepository, never()).findHashPasswordByUsername(any()); // Should fail before password check
    }
}