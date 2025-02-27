package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.flowchat.backend.Model.LicenseModel;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Repository.LicenseRepository;
import project.flowchat.backend.Repository.UserAccountRepository;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@AllArgsConstructor
@Service
public class AccountService {

    @Autowired
    private final UserAccountRepository userAccountRepository;
    private final LicenseRepository licenseRepository;

    private static final Integer USERROLEID = 2;

    /**
     * Check if the input username is unique by counting all the usernames in database
     * @param username
     * @return Boolean: true if username is unique, else false
     */
    public Boolean isUsernameUnique(String username) {
        Integer countUser = userAccountRepository.countAllUsersByUsername(username);
        return countUser == 0;
    }

    /**
     * Check if the input email is unique by counting all the emails in database
     * @param email
     * @return Boolean: true if email is unique, else false
     */
    public Boolean isEmailUnique(String email) {
        Integer countUser = userAccountRepository.countAllUsersByEmail(email);
        return countUser == 0;
    }

    public String getRoleById(Integer roleId) {
        return userAccountRepository.findRoleById(roleId);
    }

    private static String encodePassword(String rawPassword) {
        return BCrypt.hashpw(rawPassword, BCrypt.gensalt());
    }

    private static Boolean isPasswordCorrect(String rawPassword, String hashPassword) {
        return BCrypt.checkpw(rawPassword, hashPassword);
    }

    private static String generateLicenseKey() {
        Random rand = new Random();
        int num;
        String key = "";
        for (int i=0; i<16; i++) {
            do {
                num = rand.nextInt(42);
            } while (num >= 10 && num <= 16);
            key += (char) (num + '0');
        }
        return key;
    }

    private void saveLicenseKey(String email) {
        LicenseModel licenseModel = new LicenseModel();
        licenseModel.setLicenseKey(generateLicenseKey());
        licenseModel.setEmail(email);
        licenseModel.setCreatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        licenseModel.setExpiresAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")).plusWeeks(1));
        licenseModel.setIsAvailable(true);
        System.out.println(licenseModel.getLicenseKey());
        licenseRepository.save(licenseModel);
    }

    private Boolean isLicenseKeyAvailable(String email, String key) {
        return licenseRepository.isLicenseKeyAvailable(email, key);
    }

    private void setLicenseKeyUnavailable(String email, String key) {
        licenseRepository.setLicenseKeyUnavailable(email, key);
    }

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

    public Map<String, Object> registerAccount(String username, String email, String password, String licenseKey) throws Exception {
        Map<String, Object> data = new HashMap<>();
        String message = "";
        if (!isUsernameUnique(username)) {
            message = "Username is not unique.";
            data.put("account", null);
            data.put("message", message);
            return data;
        }
        if (!isEmailUnique(email)) {
            message = "Email is not unique.";
            data.put("account", null);
            data.put("message", message);
            return data;
        }

        Boolean isKeyAvailable = isLicenseKeyAvailable(email, licenseKey);
        if (isKeyAvailable == null || !isKeyAvailable) {
            message = "Email and license key are mismatched.";
            data.put("account", null);
            data.put("message", message);
            return data;
        }

        setLicenseKeyUnavailable(email, licenseKey);
        UserAccountModel userAccountModel = createAccount(username, email, password);
        message = "A new account is created.";

        data.put("account", userAccountModel);
        data.put("message", message);
        return data;
    }

    public Boolean generateLicenseKey(String email) {
        saveLicenseKey(email);
        return true;
    }

}
