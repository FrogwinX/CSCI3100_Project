package project.flowchat.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.UserAccountModel;


@Repository
public interface UserAccountRepository extends JpaRepository<UserAccountModel, Integer> {
    /**
     * @param username
     * @return Integer: number of active users with the given username
     */
    @NativeQuery(value = "SELECT COUNT(*) FROM ACCOUNT.User_Account WHERE username = ?1 AND is_active = 1")
    Integer countAllUsersByUsername(String username);

    /**
     * @param email
     * @return Integer: number of active users with the given email
     */
    @NativeQuery(value = "SELECT COUNT(*) FROM ACCOUNT.User_Account WHERE email = ?1 AND is_active = 1")
    Integer countAllUsersByEmail(String email);

    @NativeQuery(value = "SELECT role_name FROM ACCOUNT.Role WHERE role_id = ?1")
    String findRoleById(Integer id);


}
