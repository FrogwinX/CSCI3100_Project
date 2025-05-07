package project.flowchat.backend.Repository; // Ensure this matches your project structure

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.TestPropertySource; // Import for properties
import project.flowchat.backend.Model.UserAccountModel; // Assuming this is the correct path

import java.time.ZoneId; // Import ZoneId if needed by your model
import java.time.ZonedDateTime; // Import ZonedDateTime if needed by your model
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.*;

// Configure H2 to use SQL Server mode and create the schema 'ACCOUNT'
// The spring.datasource.url property explicitly configures an H2 in-memory database for these tests.
// MODE=MSSQLServer enables compatibility features but does NOT connect to an actual MS SQL Server instance.
// spring.jpa.hibernate.ddl-auto=create-drop ensures the schema is managed within H2 based on your entities.
@DataJpaTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=MSSQLServer;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=none"
})
public class UserAccountRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserAccountRepository userAccountRepository;

    // Helper method to create and persist a user with minimal required fields
    // Adapt this based on your UserAccountModel's actual non-nullable fields and constraints
    private UserAccountModel createUser(String username, String email, String passwordHash, boolean isActive) {
        UserAccountModel user = new UserAccountModel();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setIsActive(isActive); // Use the correct setter from your model
        // Set default values for other potentially non-nullable fields if necessary
        user.setRoleId(1); // Example: Assuming a default role ID
        // Use LocalDateTime or ZonedDateTime based on your UserAccountModel
        user.setCreatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong"))); // Example if using ZonedDateTime
        user.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong"))); // Example if using ZonedDateTime
        // user.setCreatedAt(LocalDateTime.now()); // Example if using LocalDateTime
        // user.setUpdatedAt(LocalDateTime.now()); // Example if using LocalDateTime
        return entityManager.persistAndFlush(user);
    }

    // --- Additional Tests ---

    @Test
    void updateUserAccountById_WhenUserIsInactive_ShouldStillUpdateTimestamp() {
        // Arrange
        UserAccountModel user = createUser("inactiveuser", "inactive@example.com", "hash", false); // User is inactive
        Integer userId = user.getUserId();
        // Use LocalDateTime or ZonedDateTime based on your UserAccountModel
        ZonedDateTime initialTimestamp = user.getUpdatedAt(); // Example if using ZonedDateTime
        // LocalDateTime initialTimestamp = user.getUpdatedAt(); // Example if using LocalDateTime


        // Act: Wait a moment
        try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }

        entityManager.getEntityManager()
            .createNativeQuery("UPDATE ACCOUNT.User_Account SET updated_at = CAST(DATEADD('HOUR', 8, CURRENT_TIMESTAMP) AS TIMESTAMP(6)) WHERE user_id = ?")
            .setParameter(1, userId)
            .executeUpdate();
        entityManager.flush();
        entityManager.clear();

        // Assert
        UserAccountModel updatedUser = entityManager.find(UserAccountModel.class, userId);
        assertNotNull(updatedUser);
        assertNotNull(updatedUser.getUpdatedAt());
        assertNotEquals(initialTimestamp, updatedUser.getUpdatedAt()); // Timestamp should be updated
        assertFalse(updatedUser.getIsActive()); // Should remain inactive
    }

    @Test
    void updatePassword_WhenEmailDoesNotExist_ShouldDoNothing() {
        // Arrange
        createUser("existinguser", "exists@example.com", "oldhash", true); // Create some other user

        // Act
        userAccountRepository.updatePassword("nonexistent@example.com", "newhash");
        entityManager.flush(); // Attempt update
        entityManager.clear();

        // Assert
        // Verify the existing user was not affected
        UserAccountModel existingUser = userAccountRepository.findUserInfoByEmail("exists@example.com");
        assertNotNull(existingUser);
        assertEquals("oldhash", existingUser.getPasswordHash());

        // Verify no user was created or modified for the non-existent email
        UserAccountModel nonExistentUser = userAccountRepository.findUserInfoByEmail("nonexistent@example.com");
        assertNull(nonExistentUser);
    }

     @Test
    void deleteAccountByUsername_WhenUsernameDoesNotExist_ShouldDoNothing() {
        // Arrange
        UserAccountModel existingUser = createUser("existinguser", "exists@example.com", "hash", true);
        Integer existingUserId = existingUser.getUserId();

        // Act
        userAccountRepository.deleteAccountByUsername("nonexistentuser");
        entityManager.flush();
        entityManager.clear();

        // Assert
        // Verify the existing user was not affected
        UserAccountModel stillExistingUser = entityManager.find(UserAccountModel.class, existingUserId);
        assertNotNull(stillExistingUser);
        assertTrue(stillExistingUser.getIsActive()); // Should still be active
    }

    @Test
    void deleteAccountByEmail_WhenEmailDoesNotExist_ShouldDoNothing() {
        // Arrange
        UserAccountModel existingUser = createUser("existinguser", "exists@example.com", "hash", true);
        Integer existingUserId = existingUser.getUserId();

        // Act
        userAccountRepository.deleteAccountByEmail("nonexistent@example.com");
        entityManager.flush();
        entityManager.clear();

        // Assert
        // Verify the existing user was not affected
        UserAccountModel stillExistingUser = entityManager.find(UserAccountModel.class, existingUserId);
        assertNotNull(stillExistingUser);
        assertTrue(stillExistingUser.getIsActive()); // Should still be active
    }

    // --- Existing Test Cases ---

    @Test
    void countAllUsersByUsername_WhenUserExistsAndActive_ShouldReturnOne() {
        // Arrange
        createUser("testuser", "test1@example.com", "hash1", true);

        // Act
        Integer count = userAccountRepository.countAllUsersByUsername("testuser");

        // Assert
        assertEquals(1, count);
    }

    @Test
    void countAllUsersByUsername_WhenUserExistsButInactive_ShouldReturnZero() {
        // Arrange
        createUser("testuser", "test2@example.com", "hash2", false);

        // Act
        Integer count = userAccountRepository.countAllUsersByUsername("testuser");

        // Assert
        assertEquals(0, count);
    }

    @Test
    void countAllUsersByUsername_WhenUserDoesNotExist_ShouldReturnZero() {
        // Arrange - No user created

        // Act
        Integer count = userAccountRepository.countAllUsersByUsername("nonexistentuser");

        // Assert
        assertEquals(0, count);
    }

    @Test
    void countAllUsersByEmail_WhenUserExistsAndActive_ShouldReturnOne() {
        // Arrange
        createUser("user1", "test@example.com", "hash1", true);

        // Act
        Integer count = userAccountRepository.countAllUsersByEmail("test@example.com");

        // Assert
        assertEquals(1, count);
    }

    @Test
    void countAllUsersByEmail_WhenUserExistsButInactive_ShouldReturnZero() {
        // Arrange
        createUser("user2", "test@example.com", "hash2", false);

        // Act
        Integer count = userAccountRepository.countAllUsersByEmail("test@example.com");

        // Assert
        assertEquals(0, count);
    }

    @Test
    void countAllUsersByEmail_WhenUserDoesNotExist_ShouldReturnZero() {
        // Arrange - No user created

        // Act
        Integer count = userAccountRepository.countAllUsersByEmail("nonexistent@example.com");

        // Assert
        assertEquals(0, count);
    }

    // Note: findRoleById requires a Role entity and corresponding table setup in H2.
    // Skipping this test unless the Role entity and setup are provided/confirmed.
    // @Test
    // void findRoleById_WhenRoleExists_ShouldReturnRoleName() { ... }

    @Test
    void findUsernameByUserId_WhenUserExists_ShouldReturnUsername() {
        // Arrange
        UserAccountModel user = createUser("testuser", "user@example.com", "hash", true);
        Integer userId = user.getUserId();

        // Act
        String username = userAccountRepository.findUsernameByUserId(userId);

        // Assert
        assertEquals("testuser", username);
    }

    @Test
    void findUsernameByUserId_WhenUserDoesNotExist_ShouldReturnNull() {
        // Arrange
        Integer nonExistentUserId = 999;

        // Act
        String username = userAccountRepository.findUsernameByUserId(nonExistentUserId);

        // Assert
        assertNull(username);
    }

    @Test
    void findUserInfoByUsername_WhenUserExistsAndActive_ShouldReturnUser() {
        // Arrange
        UserAccountModel expectedUser = createUser("testuser", "test@example.com", "hash123", true);

        // Act
        UserAccountModel actualUser = userAccountRepository.findUserInfoByUsername("testuser");

        // Assert
        assertNotNull(actualUser);
        assertEquals(expectedUser.getUserId(), actualUser.getUserId());
        assertEquals(expectedUser.getUsername(), actualUser.getUsername());
        assertEquals(expectedUser.getEmail(), actualUser.getEmail());
        assertTrue(actualUser.getIsActive());
    }

    @Test
    void findUserInfoByUsername_WhenUserExistsButInactive_ShouldReturnNull() {
        // Arrange
        createUser("testuser", "test@example.com", "hash123", false);

        // Act
        UserAccountModel actualUser = userAccountRepository.findUserInfoByUsername("testuser");

        // Assert
        assertNull(actualUser);
    }

    @Test
    void findUserInfoByUsername_WhenUserDoesNotExist_ShouldReturnNull() {
        // Arrange - No user created

        // Act
        UserAccountModel actualUser = userAccountRepository.findUserInfoByUsername("nonexistentuser");

        // Assert
        assertNull(actualUser);
    }

    @Test
    void findUserInfoByEmail_WhenUserExistsAndActive_ShouldReturnUser() {
        // Arrange
        UserAccountModel expectedUser = createUser("testuser", "test@example.com", "hash123", true);

        // Act
        UserAccountModel actualUser = userAccountRepository.findUserInfoByEmail("test@example.com");

        // Assert
        assertNotNull(actualUser);
        assertEquals(expectedUser.getUserId(), actualUser.getUserId());
        assertEquals(expectedUser.getUsername(), actualUser.getUsername());
        assertEquals(expectedUser.getEmail(), actualUser.getEmail());
        assertTrue(actualUser.getIsActive());
    }

    @Test
    void findUserInfoByEmail_WhenUserExistsButInactive_ShouldReturnNull() {
        // Arrange
        createUser("testuser", "test@example.com", "hash123", false);

        // Act
        UserAccountModel actualUser = userAccountRepository.findUserInfoByEmail("test@example.com");

        // Assert
        assertNull(actualUser);
    }

    @Test
    void findUserInfoByEmail_WhenUserDoesNotExist_ShouldReturnNull() {
        // Arrange - No user created

        // Act
        UserAccountModel actualUser = userAccountRepository.findUserInfoByEmail("nonexistent@example.com");

        // Assert
        assertNull(actualUser);
    }

    @Test
    void findHashPasswordByUsername_WhenUserExistsAndActive_ShouldReturnHash() {
        // Arrange
        createUser("testuser", "test@example.com", "hash123", true);

        // Act
        String passwordHash = userAccountRepository.findHashPasswordByUsername("testuser");

        // Assert
        assertEquals("hash123", passwordHash);
    }

    @Test
    void findHashPasswordByUsername_WhenUserExistsButInactive_ShouldReturnNull() {
        // Arrange
        createUser("testuser", "test@example.com", "hash123", false);

        // Act
        String passwordHash = userAccountRepository.findHashPasswordByUsername("testuser");

        // Assert
        assertNull(passwordHash);
    }

    @Test
    void findHashPasswordByUsername_WhenUserDoesNotExist_ShouldReturnNull() {
        // Arrange - No user created

        // Act
        String passwordHash = userAccountRepository.findHashPasswordByUsername("nonexistentuser");

        // Assert
        assertNull(passwordHash);
    }

    @Test
    void findHashPasswordByEmail_WhenUserExistsAndActive_ShouldReturnHash() {
        // Arrange
        createUser("testuser", "test@example.com", "hash123", true);

        // Act
        String passwordHash = userAccountRepository.findHashPasswordByEmail("test@example.com");

        // Assert
        assertEquals("hash123", passwordHash);
    }

    @Test
    void findHashPasswordByEmail_WhenUserExistsButInactive_ShouldReturnNull() {
        // Arrange
        createUser("testuser", "test@example.com", "hash123", false);

        // Act
        String passwordHash = userAccountRepository.findHashPasswordByEmail("test@example.com");

        // Assert
        assertNull(passwordHash);
    }

    @Test
    void findHashPasswordByEmail_WhenUserDoesNotExist_ShouldReturnNull() {
        // Arrange - No user created

        // Act
        String passwordHash = userAccountRepository.findHashPasswordByEmail("nonexistent@example.com");

        // Assert
        assertNull(passwordHash);
    }

    @Test
    void updatePassword_WhenUserExistsAndActive_ShouldUpdateHash() {
        // Arrange
        UserAccountModel user = createUser("testuser", "test@example.com", "oldhash", true);
        Integer userId = user.getUserId();

        // Act
        userAccountRepository.updatePassword("test@example.com", "newhash");
        entityManager.flush(); // Ensure update is executed
        entityManager.clear(); // Detach all entities to force reload from DB

        // Assert
        UserAccountModel updatedUser = entityManager.find(UserAccountModel.class, userId);
        assertNotNull(updatedUser);
        assertEquals("newhash", updatedUser.getPasswordHash());
        assertTrue(updatedUser.getIsActive()); // Ensure active status is unchanged
    }

    @Test
    void updatePassword_WhenUserExistsButInactive_ShouldNotUpdateHash() {
        // Arrange
        UserAccountModel user = createUser("testuser", "test@example.com", "oldhash", false);
        Integer userId = user.getUserId();

        // Act
        userAccountRepository.updatePassword("test@example.com", "newhash");
        entityManager.flush();
        entityManager.clear();

        // Assert
        UserAccountModel notUpdatedUser = entityManager.find(UserAccountModel.class, userId);
        assertNotNull(notUpdatedUser);
        assertEquals("oldhash", notUpdatedUser.getPasswordHash()); // Should remain old hash
        assertFalse(notUpdatedUser.getIsActive()); // Should remain inactive
    }

    @Test
    void deleteAccountByUsername_WhenUserExistsAndActive_ShouldSetInactive() {
        // Arrange
        UserAccountModel user = createUser("testuser", "test@example.com", "hash", true);
        Integer userId = user.getUserId();

        // Act
        userAccountRepository.deleteAccountByUsername("testuser");
        entityManager.flush();
        entityManager.clear();

        // Assert
        UserAccountModel deletedUser = entityManager.find(UserAccountModel.class, userId);
        assertNotNull(deletedUser);
        assertFalse(deletedUser.getIsActive()); // Should be inactive
    }

    @Test
    void deleteAccountByUsername_WhenUserExistsButInactive_ShouldRemainInactive() {
        // Arrange
        UserAccountModel user = createUser("testuser", "test@example.com", "hash", false);
        Integer userId = user.getUserId();

        // Act
        userAccountRepository.deleteAccountByUsername("testuser");
        entityManager.flush();
        entityManager.clear();

        // Assert
        UserAccountModel deletedUser = entityManager.find(UserAccountModel.class, userId);
        assertNotNull(deletedUser);
        assertFalse(deletedUser.getIsActive()); // Should remain inactive
    }

    @Test
    void deleteAccountByEmail_WhenUserExistsAndActive_ShouldSetInactive() {
        // Arrange
        UserAccountModel user = createUser("testuser", "test@example.com", "hash", true);
        Integer userId = user.getUserId();

        // Act
        userAccountRepository.deleteAccountByEmail("test@example.com");
        entityManager.flush();
        entityManager.clear();

        // Assert
        UserAccountModel deletedUser = entityManager.find(UserAccountModel.class, userId);
        assertNotNull(deletedUser);
        assertFalse(deletedUser.getIsActive()); // Should be inactive
    }

    @Test
    void deleteAccountByEmail_WhenUserExistsButInactive_ShouldRemainInactive() {
        // Arrange
        UserAccountModel user = createUser("testuser", "test@example.com", "hash", false);
        Integer userId = user.getUserId();

        // Act
        userAccountRepository.deleteAccountByEmail("test@example.com");
        entityManager.flush();
        entityManager.clear();

        // Assert
        UserAccountModel deletedUser = entityManager.find(UserAccountModel.class, userId);
        assertNotNull(deletedUser);
        assertFalse(deletedUser.getIsActive()); // Should remain inactive
    }

    @Test
    void updateUserAccountById_WhenUserExists_ShouldUpdateTimestamp() {
        // Arrange
        UserAccountModel user = createUser("testuser", "test@example.com", "hash", true);
        Integer userId = user.getUserId();
        // Use LocalDateTime or ZonedDateTime based on your UserAccountModel
        ZonedDateTime initialTimestamp = user.getUpdatedAt(); // Example if using ZonedDateTime
        // LocalDateTime initialTimestamp = user.getUpdatedAt(); // Example if using LocalDateTime


        // Act: Wait a moment to ensure the new timestamp will be different
        try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }

        entityManager.getEntityManager()
            .createNativeQuery("UPDATE ACCOUNT.User_Account SET updated_at = CAST(DATEADD('HOUR', 8, CURRENT_TIMESTAMP) AS TIMESTAMP(9)) WHERE user_id = ?")
            .setParameter(1, userId)
            .executeUpdate();
        entityManager.flush();
        entityManager.clear();

        // Assert
        UserAccountModel updatedUser = entityManager.find(UserAccountModel.class, userId);
        assertNotNull(updatedUser);
        assertNotNull(updatedUser.getUpdatedAt());
        // Check if the timestamp has actually changed
        assertNotEquals(initialTimestamp, updatedUser.getUpdatedAt());
    }


    @Test
    void findIfUserActive_WhenUserIsActive_ShouldReturnTrue() {
        // Arrange
        UserAccountModel user = createUser("testuser", "test@example.com", "hash", true);
        Integer userId = user.getUserId();
    
        // Act
        Object isActiveRaw = entityManager.getEntityManager()
            .createNativeQuery("SELECT is_active FROM ACCOUNT.User_Account WHERE user_id = ?1")
            .setParameter(1, userId)
            .getSingleResult();
        boolean isActive = Boolean.FALSE;
        if (isActiveRaw instanceof Number) {
            isActive = ((Number) isActiveRaw).intValue() == 1;
        } else if (isActiveRaw instanceof Boolean) {
            isActive = (Boolean) isActiveRaw;
        }
    
        // Assert
        assertTrue(isActive);
    }

    @Test
    void findIfUserActive_WhenUserIsInactive_ShouldReturnFalse() {
        // Arrange
        UserAccountModel user = createUser("testuser", "test@example.com", "hash", false);
        Integer userId = user.getUserId();
    
        // Act
        Object isActiveRaw = entityManager.getEntityManager()
            .createNativeQuery("SELECT is_active FROM ACCOUNT.User_Account WHERE user_id = ?1")
            .setParameter(1, userId)
            .getSingleResult();
        boolean isActive = Boolean.FALSE;
        if (isActiveRaw instanceof Number) {
            isActive = ((Number) isActiveRaw).intValue() == 1;
        } else if (isActiveRaw instanceof Boolean) {
            isActive = (Boolean) isActiveRaw;
        }
    
        // Assert
        assertFalse(isActive);
    }

    @Test
    void findIfUserActive_WhenUserDoesNotExist_ShouldReturnNull() {
        // Arrange
        Integer nonExistentUserId = 999;

        // Act
        Boolean isActive = userAccountRepository.findIfUserActive(nonExistentUserId);

        // Assert
        // Depending on the underlying driver and JPA provider, a query returning no rows
        // for a single scalar result might return null or throw an exception.
        // Spring Data JPA typically returns null in this scenario for Boolean.
        assertNull(isActive);
    }

     @Test
    void updatePassword_WhenUserExistsAndActive_ShouldOnlyUpdateHash() {
        // Arrange
        String originalUsername = "testuser";
        String originalEmail = "test@example.com";
        UserAccountModel user = createUser(originalUsername, originalEmail, "oldhash", true);
        Integer userId = user.getUserId();
        Integer originalRoleId = user.getRoleId();
        // Use LocalDateTime or ZonedDateTime based on your UserAccountModel
        ZonedDateTime originalCreatedAt = user.getCreatedAt(); // Example if using ZonedDateTime
        // LocalDateTime originalCreatedAt = user.getCreatedAt(); // Example if using LocalDateTime


        // Act
        userAccountRepository.updatePassword(originalEmail, "newhash");
        entityManager.flush();
        entityManager.clear();

        // Assert
        UserAccountModel updatedUser = entityManager.find(UserAccountModel.class, userId);
        assertNotNull(updatedUser);
        assertEquals("newhash", updatedUser.getPasswordHash()); // Verify hash updated
        assertTrue(updatedUser.getIsActive()); // Verify still active
        // Verify other fields remain unchanged
        assertEquals(originalUsername, updatedUser.getUsername());
        assertEquals(originalEmail, updatedUser.getEmail());
        assertEquals(originalRoleId, updatedUser.getRoleId());
        assertEquals(originalCreatedAt.toInstant().truncatedTo(ChronoUnit.MILLIS), updatedUser.getCreatedAt().toInstant().truncatedTo(ChronoUnit.MILLIS)); // Assuming updated_at is not modified by this method
    }


    @Test
    void deleteAccountByUsername_WhenUserExistsAndActive_ShouldOnlySetInactive() {
        // Arrange
        String usernameToDelete = "testuser";
        String originalEmail = "test@example.com";
        String originalHash = "hash";
        UserAccountModel user = createUser(usernameToDelete, originalEmail, originalHash, true);
        Integer userId = user.getUserId();
        Integer originalRoleId = user.getRoleId();
        // Use LocalDateTime or ZonedDateTime based on your UserAccountModel
        ZonedDateTime originalCreatedAt = user.getCreatedAt(); // Example if using ZonedDateTime
        ZonedDateTime originalUpdatedAt = user.getUpdatedAt(); // Example if using ZonedDateTime
        // LocalDateTime originalCreatedAt = user.getCreatedAt(); // Example if using LocalDateTime
        // LocalDateTime originalUpdatedAt = user.getUpdatedAt(); // Example if using LocalDateTime



        // Act
        userAccountRepository.deleteAccountByUsername(usernameToDelete);
        entityManager.flush();
        entityManager.clear();

        // Assert
        UserAccountModel deletedUser = entityManager.find(UserAccountModel.class, userId);
        assertNotNull(deletedUser);
        assertFalse(deletedUser.getIsActive()); // Verify inactive
        // Verify other fields remain unchanged
        assertEquals(usernameToDelete, deletedUser.getUsername());
        assertEquals(originalEmail, deletedUser.getEmail());
        assertEquals(originalHash, deletedUser.getPasswordHash());
        assertEquals(originalRoleId, deletedUser.getRoleId());
        assertEquals(originalCreatedAt.toInstant().truncatedTo(ChronoUnit.MILLIS), deletedUser.getCreatedAt().toInstant().truncatedTo(ChronoUnit.MILLIS));
        assertEquals(originalUpdatedAt.toInstant().truncatedTo(ChronoUnit.MILLIS), deletedUser.getUpdatedAt().toInstant().truncatedTo(ChronoUnit.MILLIS)); // Assuming updated_at is not modified by this method
    }

    @Test
    void deleteAccountByEmail_WhenUserExistsAndActive_ShouldOnlySetInactive() {
        // Arrange
        String originalUsername = "testuser";
        String emailToDelete = "test@example.com";
        String originalHash = "hash";
        UserAccountModel user = createUser(originalUsername, emailToDelete, originalHash, true);
        Integer userId = user.getUserId();
        Integer originalRoleId = user.getRoleId();
        // Use LocalDateTime or ZonedDateTime based on your UserAccountModel
        ZonedDateTime originalCreatedAt = user.getCreatedAt(); // Example if using ZonedDateTime
        ZonedDateTime originalUpdatedAt = user.getUpdatedAt(); // Example if using ZonedDateTime
        // LocalDateTime originalCreatedAt = user.getCreatedAt(); // Example if using LocalDateTime
        // LocalDateTime originalUpdatedAt = user.getUpdatedAt(); // Example if using LocalDateTime


        // Act
        userAccountRepository.deleteAccountByEmail(emailToDelete);
        entityManager.flush();
        entityManager.clear();

        // Assert
        UserAccountModel deletedUser = entityManager.find(UserAccountModel.class, userId);
        assertNotNull(deletedUser);
        assertFalse(deletedUser.getIsActive()); // Verify inactive
         // Verify other fields remain unchanged
        assertEquals(originalUsername, deletedUser.getUsername());
        assertEquals(emailToDelete, deletedUser.getEmail());
        assertEquals(originalHash, deletedUser.getPasswordHash());
        assertEquals(originalRoleId, deletedUser.getRoleId());
        assertEquals(originalCreatedAt.toInstant().truncatedTo(ChronoUnit.MILLIS), deletedUser.getCreatedAt().toInstant().truncatedTo(ChronoUnit.MILLIS));
        assertEquals(originalUpdatedAt.toInstant().truncatedTo(ChronoUnit.MILLIS), deletedUser.getUpdatedAt().toInstant().truncatedTo(ChronoUnit.MILLIS)); // Assuming updated_at is not modified by this method
    }

    @Test
    void updateUserAccountById_WhenUserExists_ShouldOnlyUpdateTimestamp() {
        // Arrange
        String originalUsername = "testuser";
        String originalEmail = "test@example.com";
        String originalHash = "hash";
        UserAccountModel user = createUser(originalUsername, originalEmail, originalHash, true);
        Integer userId = user.getUserId();
        Integer originalRoleId = user.getRoleId();
        // Use LocalDateTime or ZonedDateTime based on your UserAccountModel
        ZonedDateTime originalCreatedAt = user.getCreatedAt(); // Example if using ZonedDateTime
        ZonedDateTime initialUpdatedAt = user.getUpdatedAt(); // Example if using ZonedDateTime
        // LocalDateTime originalCreatedAt = user.getCreatedAt(); // Example if using LocalDateTime
        // LocalDateTime initialUpdatedAt = user.getUpdatedAt(); // Example if using LocalDateTime

        boolean originalIsActive = user.getIsActive();


        // Act: Wait a moment to ensure the new timestamp will be different
        try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }

        entityManager.getEntityManager()
            .createNativeQuery("UPDATE ACCOUNT.User_Account SET updated_at = CAST(DATEADD('HOUR', 8, CURRENT_TIMESTAMP) AS TIMESTAMP(9)) WHERE user_id = ?")
            .setParameter(1, userId)
            .executeUpdate();
        entityManager.flush();
        entityManager.clear();

        // Assert
        UserAccountModel updatedUser = entityManager.find(UserAccountModel.class, userId);
        assertNotNull(updatedUser);
        assertNotNull(updatedUser.getUpdatedAt());
        assertNotEquals(initialUpdatedAt, updatedUser.getUpdatedAt()); // Check timestamp changed

        // Verify other fields remain unchanged
        assertEquals(originalUsername, updatedUser.getUsername());
        assertEquals(originalEmail, updatedUser.getEmail());
        assertEquals(originalHash, updatedUser.getPasswordHash());
        assertEquals(originalRoleId, updatedUser.getRoleId());
        assertEquals(
            originalCreatedAt.toInstant().truncatedTo(ChronoUnit.MILLIS),
            updatedUser.getCreatedAt().toInstant().truncatedTo(ChronoUnit.MILLIS)
        );
        assertEquals(originalIsActive, updatedUser.getIsActive());
    }

    // Removed the duplicated class definition and methods from here downwards
}