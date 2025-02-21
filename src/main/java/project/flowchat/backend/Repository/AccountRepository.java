package project.flowchat.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.UserAccountModel;


@Repository
public interface AccountRepository extends JpaRepository<UserAccountModel, Integer> {
    /**
     * @param username
     * @return Integer: number of users with the given username
     */
    @NativeQuery(value = "SELECT COUNT(*) FROM ACCOUNT.UserAccount WHERE username = ?1")
    Integer countAllUsersByUsername(String username);

    /**
     * @param email
     * @return Integer: number of users with the given email
     */
    @NativeQuery(value = "SELECT COUNT(*) FROM ACCOUNT.UserAccount WHERE email = ?1")
    Integer countAllUsersByEmail(String email);
}
