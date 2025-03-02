package project.flowchat.backend.Service;

import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Repository.UserAccountRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@AllArgsConstructor
@Service
public class AccountService {

    @Autowired
    private final UserAccountRepository userAccountRepository;
    private final SecurityService securityService;
    private JavaMailSender mailSender;

    private static final Integer USERROLEID = 2;

    /**
     * Check if the input username is unique by counting all the usernames in database
     * @param username username string
     * @return true if username is unique, else false
     */
    public Boolean isUsernameUnique(String username) {
        Integer countUser = userAccountRepository.countAllUsersByUsername(username);
        return countUser == 0;
    }

    /**
     * Check if the input email is unique by counting all the emails in database
     * @param email email string
     * @return true if username is unique, else false
     */
    public Boolean isEmailUnique(String email) {
        Integer countUser = userAccountRepository.countAllUsersByEmail(email);
        return countUser == 0;
    }

    /**
     * Check if the username or email is active
     * @param usernameOrEmail username string or email string
     * @return Boolean: true if the username or email is active, else false
     */
    public Boolean isAccountActive(String usernameOrEmail) {
        Boolean isActive = userAccountRepository.findIsActive(usernameOrEmail);
        if (isActive == null) {
            return false;
        }
        else {
            return true;
        }
    }

    /**
     * Encode a raw password by BCrypt
     * @param rawPassword raw password string
     * @return the corresponding encoded password
     */
    private static String encodePassword(String rawPassword) {
        return BCrypt.hashpw(rawPassword, BCrypt.gensalt());
    }

    /**
     * Check if a raw password matches the corresponding encoded password
     * @param rawPassword raw password string
     * @param hashPassword encoded password string
     * @return true if a raw password matches the corresponding encoded password, else false
     */
    private static Boolean isPasswordCorrect(String rawPassword, String hashPassword) {
        return BCrypt.checkpw(rawPassword, hashPassword);
    }

    /**
     * Check if user provide correct password
     * @param usernameOrEmail username string or email string provided from user
     * @param password raw password string provided from user
     * @return true if username or email and password are correct, else false
     */
    public Boolean isPasswordCorrectForUser(String usernameOrEmail, String password) {
        String passwordHash = userAccountRepository.findHashPasswordWithUsernameOrEmail(usernameOrEmail);
        return isPasswordCorrect(password, passwordHash);
    }

    /**
     * Get user login information from database and generate token
     * @param usernameOrEmail username string or email string
     * @return user login information with given username or email
     */
    public Map<String, Object> getUserLoginInfo(String usernameOrEmail)  {
        Map<String, Object> userLoginInfo = new HashMap<>();
        UserAccountModel userInfoFromDatabase = userAccountRepository.findUserInfoWithUsernameOrEmail(usernameOrEmail);
        String role = userAccountRepository.findRoleById(userInfoFromDatabase.getRoleId());

        userLoginInfo.put("token", securityService.generateToken(userInfoFromDatabase));
        userLoginInfo.put("id", userInfoFromDatabase.getUserId());
        userLoginInfo.put("username", userInfoFromDatabase.getUsername());
        userLoginInfo.put("roles", role);

        return userLoginInfo;
    }

    public String getRoleById(Integer roleId) {
        return userAccountRepository.findRoleById(roleId);
    }

    public String getNameFromEmail(String email) {
        return userAccountRepository.findUserInfoWithUsernameOrEmail(email).getUsername();
    }

    /**
     * Convert HTML file to string and insert a key in the string
     * @param fileName the HTML file to be converted
     * @param key actual sting of either License Key or Authentication Code
     * @param keyType either LICENSE Type or AUTHENTICATION Type
     * @return the string of HTML file with an input key
     * @throws Exception any exception
     */
    private static String convertHtml2String(String fileName, String key, SecurityService.KeyType keyType) throws Exception {
        Resource resource = new ClassPathResource(fileName);
        BufferedReader br = new BufferedReader(new InputStreamReader(resource.getInputStream()));
        StringBuilder htmlBody = new StringBuilder();
        String nextline;
        int rageNum = 0, rangeSize = 0;
        switch (keyType) {
            case LICENSE:
                rageNum = 4;
                rangeSize = 4;
                break;
            case AUTHENTICATION:
                rageNum = 2;
                rangeSize = 3;
                break;
        }
        while ((nextline = br.readLine()) != null) {
            if (nextline.contains("<div class=\"key\">")) {
                nextline = "<div class=\"key\">";
                for (int i=0; i<rageNum; i++) {
                    for (int j=0; j<rangeSize; j++) {
                        nextline += "" + key.charAt(rangeSize * i + j);
                    }
                    if (i < rageNum-1) {
                        nextline += " - ";
                    }
                }
                nextline += "</div>";
            }
            htmlBody.append(nextline);
        }
        return htmlBody.toString();
    }

    /**
     * Send a activate account email or reset password email to a user email address
     * @param userEmail user email address
     * @param key license key or authentication code
     * @param keyType LICENSE or AUTHENTICATION KeyType
     * @param subject subject of the email
     * @param fileName file name of HTML email content
     * @throws Exception any exception during sending emails
     */
    private void sendEmail(String userEmail, String key, SecurityService.KeyType keyType, String subject, String fileName) throws Exception {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
        mimeMessageHelper.setTo(userEmail);
        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(convertHtml2String(fileName, key, keyType), true);
        mailSender.send(mimeMessage);
    }

    /**
     * Create a new account record in database table User_Account
     * @param username username string
     * @param email email string
     * @param password password string
     * @return UserAccountModel Object
     */
    private UserAccountModel createAccount(String username, String email, String password) {
        UserAccountModel userAccountModel = new UserAccountModel();
        userAccountModel.setUsername(username);
        userAccountModel.setEmail(email);
        userAccountModel.setPasswordHash(encodePassword(password));
        userAccountModel.setIsActive(true);
        userAccountModel.setRoleId(USERROLEID);
        userAccountModel.setCreatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        userAccountModel.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        return userAccountRepository.save(userAccountModel);
    }

    /**
     * Register a account by checking the username unique, email unique, license key available, then creating an account in database
     * @param username username string
     * @param email email string
     * @param password raw password string
     * @param licenseKey license key string
     * @return user account data or error message
     * @throws Exception any exception
     */
    public Map<String, Object> registerAccount(String username, String email, String password, String licenseKey) throws Exception {
        Map<String, Object> data = new HashMap<>();
        String message = "";

        if (!isUsernameUnique(username)) {
            message = "Username is not unique";
            data.put("account", null);
            data.put("message", message);
            return data;
        }

        if (!isEmailUnique(email)) {
            message = "Email is not unique";
            data.put("account", null);
            data.put("message", message);
            return data;
        }

        String keyMessage = securityService.isKeyAvailable(email, licenseKey, SecurityService.KeyType.LICENSE);
        switch (keyMessage) {
            case "Key not match":
            case "Key is not available":
            case "Key is expired":
                data.put("account", null);
                data.put("message", keyMessage);
                return data;
            case "Key is available":
        }

        UserAccountModel userAccountModel = createAccount(username, email, password);
        message = "A new account is created";

        data.put("account", userAccountModel);
        data.put("message", message);
        return data;
    }

    /**
     * Generate a new license key, save it in the database, and send it to user through user email address
     * @param email email string
     * @throws Exception any exception
     */
    public void requestLicenseKey(String email) throws Exception {
        String licenseKey = securityService.generateLicenseKey();
        securityService.saveKey(email, licenseKey, SecurityService.KeyType.LICENSE);
        sendEmail(email, licenseKey, SecurityService.KeyType.LICENSE,"Activate Your FlowChat Account", "licenseKeyEmail.html");
    }

    /**
     * Generate a new authentication code, save it in the database, and send it to user through user email address
     * @param email email string
     * @throws Exception any exception from requesting the authentication code
     * @return true if the request authentication code is successful, else false if the account with email address is not active
     */
    public Boolean requestAuthenticationCode(String email) throws Exception {
        if (isEmailUnique(email)) {
            return false;
        }
        String authCode = securityService.generateAuthenticationCode();
        securityService.saveKey(email, authCode, SecurityService.KeyType.AUTHENTICATION);
        sendEmail(email, authCode, SecurityService.KeyType.AUTHENTICATION, "Reset FlowChat Password", "authenticationCodeEmail.html");
        return true;
    }

    /**
     * Use the authentication code if it is available
     * @param email email string
     * @param authenticationCode authentication code string
     * @return condition of authentication code
     */
    public String useAuthenticationCode(String email, String authenticationCode) {
        return securityService.isKeyAvailable(email, authenticationCode, SecurityService.KeyType.AUTHENTICATION);
    }

    /**
     * Change the password to the new password for the user with the given email
     * @param email email string
     * @param password password string
     * @throws Exception Any errors from updating the database
     */
    public void resetPassword(String email, String password) throws Exception {
        try {
            String passwordHash = encodePassword(password);
            UserAccountModel userAccountModel = userAccountRepository.findUserInfoWithUsernameOrEmail(email);
            userAccountRepository.updateUserAccountById(userAccountModel.getUserId());
            userAccountRepository.updatePassword(email, passwordHash);
        } catch (Exception e) {
            System.err.println(e);
            throw e;
        }
    }

    /**
     * Soft delete the user account
     * @param usernameOrEmail username string or email string
     * @return true if the account deletion is successful, else false if the account is not active
     */
    public Boolean deleteAccount(String usernameOrEmail) {
        UserAccountModel userAccountModel = userAccountRepository.findUserInfoWithUsernameOrEmail(usernameOrEmail);
        if (userAccountModel == null) {
            return false;
        }
        userAccountRepository.updateUserAccountById(userAccountModel.getUserId());
        userAccountRepository.deleteAccount(usernameOrEmail);
        return true;
    }

}
