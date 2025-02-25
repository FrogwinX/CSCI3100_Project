package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Repository.AccountRepository;

@AllArgsConstructor
@Service
public class AccountService {

    @Autowired
    private final AccountRepository accountRepository;

    private final JWTService jwtService;

    /**
     * Check if the input username is unique by counting all the usernames in database
     * @param username
     * @return Boolean: true if username is unique, else false
     */
    public Boolean isUsernameUnique(String username) {
        Integer countUser = accountRepository.countAllUsersByUsername(username);
        return countUser == 0;
    }

    /**
     * Check if the input email is unique by counting all the emails in database
     * @param email
     * @return Boolean: true if email is unique, else false
     */
    public Boolean isEmailUnique(String email) {
        Integer countUser = accountRepository.countAllUsersByEmail(email);
        return countUser == 0;
    }

    /**
     * Check if the username or email and password match the username or email and encrypted password in the database
     * @param usernameOrEmail
     * @param password
     * @return Boolean: true if username or email and password are correct, else false
     */
    public Boolean isAccountMatched(String usernameOrEmail, String password) {
        String hashPassword = accountRepository.findHashPasswordWithUsernameOrEmail(usernameOrEmail);
        if (hashPassword == null) {
            return false;
        }
        else {
            return isPasswordCorrect(password, hashPassword);
        }
    }

    /**
     * Check if the user with the given username or email is activated in the database
     * @param usernameOrEmail
     * @return Boolean: true if user is activated, else false
     */
    public Boolean isAccountActivated(String usernameOrEmail) {
        return true;
    }

    /**
     * Get user login information from database and generate token
     * @param usernameOrEmail
     * @return Map<String, Object>: user login information with given username or email
     */
    public Map<String, Object> getUserLoginInfo(String usernameOrEmail)  {
        Map<String, Object> userLoginInfo = new HashMap<>();
        UserAccountModel userInfoFromDatabase = accountRepository.findUserInfoWithUsernameOrEmail(usernameOrEmail);
        String role = (userInfoFromDatabase.getRoleId() == 1) ? "admin" : "user";

        userLoginInfo.put("token", jwtService.generateToken(userInfoFromDatabase));
        userLoginInfo.put("id", userInfoFromDatabase.getUserId());
        userLoginInfo.put("username", userInfoFromDatabase.getUsername());
        userLoginInfo.put("roles", role);

        
        return userLoginInfo;
    }

    public String encodePassword(String rawPassword) {
        return BCrypt.hashpw(rawPassword, BCrypt.gensalt());
    }

    public Boolean isPasswordCorrect(String rawPassword, String hashPassword) {
        return BCrypt.checkpw(rawPassword, hashPassword);
    }

}
