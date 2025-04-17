package project.flowchat.backend.Service;

import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
    private final ForumService forumService;
    private final ProfileService profileService;
    private JavaMailSender mailSender;

    private static final Integer USER_ROLE_ID = 2;

    /**
     * Check if the username contains invalid characters
     * @param username username String
     * @throws ExceptionService INVALID_USERNAME_FORMAT if there is any invalid characters
     */
    private void checkUsernameFormat(String username) throws Exception {
        if (username == null || username.isEmpty() || username.contains(";") || username.contains("@")) {
            ExceptionService.throwException(ExceptionService.INVALID_USERNAME_FORMAT);
        }
    }

    /**
     * Check if the email contains invalid characters
     * @param email email String
     * @throws ExceptionService INVALID_EMAIL_FORMAT if there is any invalid characters
     */
    private void checkEmailFormat(String email) throws Exception {
        if (email == null || email.contains(";") || email.contains(" ") || !email.contains("@")) {
            ExceptionService.throwException(ExceptionService.INVALID_EMAIL_FORMAT);
        }
    }

    /**
     * Check if the input username is correct in format and unique by counting all the usernames in database
     * @param username username string
     * @return true if username is unique, else false
     * @throws ExceptionService INVALID_USERNAME_FORMAT, USERNAME_NOT_UNIQUE
     */
    public Boolean isUsernameUnique(String username) throws Exception {
        checkUsernameFormat(username);
        Integer countUser = userAccountRepository.countAllUsersByUsername(username);
        if (countUser > 0) {
            ExceptionService.throwException(ExceptionService.USERNAME_NOT_UNIQUE);
        }
        return true;
    }

    /**
     * Check if the input email is correct in format and unique by counting all the emails in database
     * @param email email string
     * @return true if username is unique, else false
     * @throws ExceptionService INVALID_EMAIL_FORMAT, EMAIL_NOT_UNIQUE
     */
    public Boolean isEmailUnique(String email) throws Exception {
        checkEmailFormat(email);
        Integer countUser = userAccountRepository.countAllUsersByEmail(email);
        if (countUser > 0) {
            ExceptionService.throwException(ExceptionService.EMAIL_NOT_UNIQUE);
        }
        return true;
    }

    /**
     * Check if the username or email is correct in format and active
     * @param username username string
     * @param email email string
     * @return Boolean: true if the username or email is active
     * @throws ExceptionService TOO_MANY_PARAMS, ACCOUNT_NOT_ACTIVE
     */
    public Boolean isAccountActive(String username, String email) throws Exception {
        if (username != null && email != null) {
            ExceptionService.throwException(ExceptionService.TOO_MANY_PARAMS);
        }
        else if (username != null) {
            checkUsernameFormat(username);
            if (userAccountRepository.countAllUsersByUsername(username) != 1) {
                ExceptionService.throwException(ExceptionService.ACCOUNT_NOT_ACTIVE);
            }
        }
        else if (email != null) {
            checkEmailFormat(email);
            if (userAccountRepository.countAllUsersByEmail(email) != 1) {
                ExceptionService.throwException(ExceptionService.ACCOUNT_NOT_ACTIVE);
            }
        }
        return true;
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
     * @param username username string provided from user
     * @param email email string provided from user
     * @param password raw password string provided from user
     */
    public void checkUserPassword(String username, String email, String password) throws Exception {
        String passwordHash = null;
        isAccountActive(username, email);
        if (username != null && email == null) {
            passwordHash = userAccountRepository.findHashPasswordByUsername(username);
        }
        else if (username == null && email != null) {
            passwordHash = userAccountRepository.findHashPasswordByEmail(email);
        }
        if (!isPasswordCorrect(password, passwordHash)) {
            ExceptionService.throwException(ExceptionService.INCORRECT_PASSWORD);
        }
    }

    /**
     * Get user login information from database and generate token
     * @param username username string
     * @param email email string
     * @param password password string
     * @return user login information with given username or email
     * @throws ExceptionService TOO_MANY_PARAMS, ACCOUNT_NOT_ACTIVE, INCORRECT_PASSWORD
     */
    public Map<String, Object> getUserLoginInfo(String username, String email, String password) throws Exception  {
        checkUserPassword(username, email, password);

        Map<String, Object> userLoginInfo = new HashMap<>();
        UserAccountModel userInfoFromDatabase = new UserAccountModel();
        if (username != null) {
            userInfoFromDatabase = userAccountRepository.findUserInfoByUsername(username);
        } else if (email != null) {
            userInfoFromDatabase = userAccountRepository.findUserInfoByEmail(email);
        }

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
        return userAccountRepository.findUserInfoByEmail(email).getUsername();
    }

    /**
     * Convert HTML file to string and insert a key in the string
     * @param fileName the HTML file to be converted
     * @param key actual sting of either License Key or Authentication Code
     * @param keyType either LICENSE Type or AUTHENTICATION Type
     * @return the string of HTML file with an input key
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
    private UserAccountModel addAccountToDatabase(String username, String email, String password) {
        UserAccountModel userAccountModel = new UserAccountModel();
        userAccountModel.setUsername(username);
        userAccountModel.setEmail(email);
        userAccountModel.setPasswordHash(encodePassword(password));
        userAccountModel.setIsActive(true);
        userAccountModel.setRoleId(USER_ROLE_ID);
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
     * @throws ExceptionService Invalid username format, Username is not unique, Invalid email format, Email is not unique
     */
    public UserAccountModel registerAccount(String username, String email, String password, String licenseKey) throws Exception {
        isUsernameUnique(username);
        isEmailUnique(email);
        securityService.setKeyUnavailable(email, licenseKey, SecurityService.KeyType.LICENSE);
        UserAccountModel userAccountModel = addAccountToDatabase(username, email, password);
        forumService.addAllTagsForUserToDatabase(userAccountModel.getUserId());
        profileService.addNewUserProfile(userAccountModel.getUserId(), username);
        return userAccountModel;
    }

    /**
     * Generate a new license key, save it in the database, and send it to user through user email address
     * @param email email string
     * @throws ExceptionService ACTIVE_ACCOUNT
     */
    public void requestLicenseKey(String email) throws Exception {
        isEmailUnique(email);
        String licenseKey = securityService.generateLicenseKey();
        securityService.saveKey(email, licenseKey, SecurityService.KeyType.LICENSE);
        sendEmail(email, licenseKey, SecurityService.KeyType.LICENSE,"Activate Your FlowChat Account", "licenseKeyEmail.html");
    }

    /**
     * Generate a new authentication code, save it in the database, and send it to user through user email address
     * @param email email string
     * @throws ExceptionService ACCOUNT_NOT_ACTIVE
     */
    public void requestAuthenticationCode(String email) throws Exception {
        isAccountActive(null, email);
        String authCode = securityService.generateAuthenticationCode();
        securityService.saveKey(email, authCode, SecurityService.KeyType.AUTHENTICATION);
        sendEmail(email, authCode, SecurityService.KeyType.AUTHENTICATION, "Reset FlowChat Password", "authenticationCodeEmail.html");
    }

    /**
     * Change the password to the new password for the user with the given email
     * @param email email string
     * @param password password string
     */
    public void resetPassword(String email, String password, String authenticationCode) throws Exception {
        checkEmailFormat(email);
        securityService.setKeyUnavailable(email, authenticationCode, SecurityService.KeyType.AUTHENTICATION);
        String passwordHash = encodePassword(password);
        UserAccountModel userAccountModel = userAccountRepository.findUserInfoByEmail(email);
        userAccountRepository.updateUserAccountById(userAccountModel.getUserId());
        userAccountRepository.updatePassword(email, passwordHash);
    }

    /**
     * Soft delete the user account
     * @param username username string
     * @param email email string
     * @throws ExceptionService Too many parameters, Account is not active
     */
    public void deleteAccount(String username, String email, String password) throws Exception {
        checkUserPassword(username, email, password);
        UserAccountModel userAccountModel;
        if (username != null && email == null) {
            userAccountModel = userAccountRepository.findUserInfoByUsername(username);
            userAccountRepository.updateUserAccountById(userAccountModel.getUserId());
            userAccountRepository.deleteAccountByUsername(username);
        } else if (username == null && email != null) {
            userAccountModel = userAccountRepository.findUserInfoByEmail(email);
            userAccountRepository.updateUserAccountById(userAccountModel.getUserId());
            userAccountRepository.deleteAccountByEmail(email);
        }
    }

    /**
     * Get a list of userId and usernames by searching the usernames and emails with keyword in database
     * @param userId userId Integer
     * @param keyword keyword case-insensitive String
     * @param searchNum required number of post previews
     * @param excludingUserIdList a list of userId that have already retrieved
     * @return a list of userId and usernames
     * @throws Exception any exception
     */
    public List<Map<String, Object>> searchUser(Integer userId, String keyword, List<Integer> excludingUserIdList, Integer searchNum) throws Exception {
        securityService.checkUserIdWithToken(userId);
        keyword = "%" + keyword + "%";
        List<Map<String, Object>> userList = new ArrayList<>();
        List<List<String>> usernameAndUserIdList = userAccountRepository.findActiveUserByKeyword(userId, keyword, excludingUserIdList, searchNum);
        for (List<String> list : usernameAndUserIdList) {
            Map<String, Object> user = new HashMap<>();
            user.put("userId", list.get(0));
            user.put("username", list.get(1));
            userList.add(user);
        }
        return userList;
    }

}
