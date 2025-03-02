package project.flowchat.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import project.flowchat.backend.Model.UserAccountModel;


@Repository
public interface UserAccountRepository extends JpaRepository<UserAccountModel, Integer> {
    /**
     * Count the number of users by the username
     * @param username username string
     * @return number of active users with the given username
     */
    @NativeQuery(value = "SELECT COUNT(*) FROM ACCOUNT.User_Account WHERE username = ?1 AND is_active = 1")
    Integer countAllUsersByUsername(String username);

    /**
     * Count the number of users by the email
     * @param email email string
     * @return number of active users with the given email
     */
    @NativeQuery(value = "SELECT COUNT(*) FROM ACCOUNT.User_Account WHERE email = ?1 AND is_active = 1")
    Integer countAllUsersByEmail(String email);

    /**
     * Find the role name by role id
     * @param id id int
     * @return role name with the given role id
     */
    @NativeQuery(value = "SELECT role_name FROM ACCOUNT.Role WHERE role_id = ?1")
    String findRoleById(Integer id);

    /**
     * Find the user information by the username or email
     * @param usernameOrEmail username string or email string
     * @return user information with the given username or email
     */
    @NativeQuery(value = "SELECT * FROM ACCOUNT.User_Account WHERE (email = ?1 OR username = ?1) AND is_active = 1")
    UserAccountModel findUserInfoWithUsernameOrEmail(String usernameOrEmail);

    /**
     * Find the hashed password by the username or email
     * @param usernameOrEmail username string or email string
     * @return hashed password of user with the given username or email
     */
    @NativeQuery(value = "SELECT password_hash FROM ACCOUNT.User_Account WHERE (email = ?1 OR username = ?1) AND is_active = 1")
    String findHashPasswordWithUsernameOrEmail(String usernameOrEmail);

    /**
     * Find if user is active by the username or email
     * @param usernameOrEmail username string or email string
     * @return ture if user is active, else false
     */
    @NativeQuery(value = "SELECT is_active FROM ACCOUNT.User_Account WHERE (email = ?1 OR username = ?1) AND is_active = 1")
    Boolean findIsActive(String usernameOrEmail);

    /**
     * Update the hashed password by the email
     * @param email email string
     * @param passwordHash encoded password string
     */
    @Modifying
    @Transactional
    @NativeQuery(value = "UPDATE ACCOUNT.User_Account SET password_hash = ?2 WHERE email = ?1 AND is_active = 1")
    void updatePassword(String email, String passwordHash);
}
