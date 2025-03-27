package project.flowchat.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import project.flowchat.backend.Model.UserAccountModel;

import java.util.List;


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
     * Find the username by user id
     * @param id id int
     * @return username with the given user id
     */
    @NativeQuery(value = "SELECT username FROM ACCOUNT.User_Account WHERE user_id = ?1")
    String findUsernameByUserId(Integer id);

    /**
     * Find the user information by the username
     * @param username username string
     * @return user information with the given username
     */
    @NativeQuery(value = "SELECT * FROM ACCOUNT.User_Account WHERE username = ?1 AND is_active = 1")
    UserAccountModel findUserInfoByUsername(String username);

    /**
     * Find the user information by the email
     * @param email email string
     * @return user information with the given email
     */
    @NativeQuery(value = "SELECT * FROM ACCOUNT.User_Account WHERE email = ?1 AND is_active = 1")
    UserAccountModel findUserInfoByEmail(String email);

    /**
     * Find the hashed password by the username
     * @param username username string
     * @return hashed password of user with the given username
     */
    @NativeQuery(value = "SELECT password_hash FROM ACCOUNT.User_Account WHERE username = ?1 AND is_active = 1")
    String findHashPasswordByUsername(String username);

    /**
     * Find the hashed password by the email
     * @param email email string
     * @return hashed password of user with the given email
     */
    @NativeQuery(value = "SELECT password_hash FROM ACCOUNT.User_Account WHERE email = ?1 AND is_active = 1")
    String findHashPasswordByEmail(String email);

    /**
     * Update the hashed password by the email
     * @param email email string
     * @param passwordHash encoded password string
     */
    @Modifying
    @Transactional
    @NativeQuery(value = "UPDATE ACCOUNT.User_Account SET password_hash = ?2 WHERE email = ?1 AND is_active = 1")
    void updatePassword(String email, String passwordHash);

    /**
     * Mark is_active to false for the given username
     * @param username username string
     */
    @Modifying
    @Transactional
    @NativeQuery(value = "UPDATE ACCOUNT.User_Account SET is_active = 0 WHERE username = ?1 AND is_active = 1")
    void deleteAccountByUsername(String username);

    /**
     * Mark is_active to false for the given email
     * @param email email string
     */
    @Modifying
    @Transactional
    @NativeQuery(value = "UPDATE ACCOUNT.User_Account SET is_active = 0 WHERE email = ?1 AND is_active = 1")
    void deleteAccountByEmail(String email);

    /**
     * Update updated_at to current time for the given userId
     * @param userId userId string
     */
    @Modifying
    @Transactional
    @NativeQuery(value = "UPDATE ACCOUNT.User_Account SET updated_at = DATEADD(HOUR, 8, GETDATE()) WHERE user_id = ?1")
    void updateUserAccountById(Integer userId);

    /**
     * Find a list of userId and usernames of the active users with case-insensitive keywords in usernames or emails, filtered out the blocked users, ordered randomly
     * @param userId userId Integer
     * @param keyword keywords case-insensitive String
     * @param excludingUserIdList a list of userId that have already retrieved
     * @param searchNum required number of queries
     * @return a lists of userId and usernames
     */
    @NativeQuery(value =    "SELECT user_id, username\n" +
                            "FROM ACCOUNT.User_Account\n" +
                            "WHERE is_active = 1\n" +
                            "AND (username LIKE ?2\n" +
                            "OR email LIKE ?2)\n" +
                            "AND user_id NOT IN (\n" +
                            "SELECT user_id_to\n" +
                            "FROM PROFILE.Block\n" +
                            "WHERE user_id_from = ?1)\n" +
                            "AND user_id NOT IN ?3\n" +
                            "ORDER BY user_id\n" +
                            "OFFSET 0 ROWS\n" +
                            "FETCH NEXT ?4 ROWS ONLY\n")
    List<List<String>> findActiveUserByKeyword(Integer userId, String keyword, List<Integer> excludingUserIdList, Integer searchNum);
}
