package project.flowchat.backend.Service;


import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import project.flowchat.backend.Model.LicenseModel;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Repository.LicenseRepository;
import project.flowchat.backend.Repository.UserAccountRepository;

import java.io.BufferedReader;
import java.io.FileReader;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@AllArgsConstructor
@Service
public class AccountService {

    @Autowired
    private final UserAccountRepository userAccountRepository;
    private final LicenseRepository licenseRepository;
    private JavaMailSender mailSender;

    private static final Integer USERROLEID = 2;

    public Boolean isUsernameUnique(String username) {
        Integer countUser = userAccountRepository.countAllUsersByUsername(username);
        return countUser == 0;
    }

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

    private static String convertHtml2String(String htmlPath, String key, String keyType) throws Exception {
        try {
            StringBuilder htmlBody = new StringBuilder();
            BufferedReader br = new BufferedReader(new FileReader(htmlPath));
            String nextline;
            int rageNum = 0, rangeSize = 0;
            switch (keyType) {
                case "license":
                    rageNum = 4;
                    rangeSize = 4;
                    break;
                case "authentication":
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
        catch (Exception e) {
            throw e;
        }
    }

    @Async
    private void sendEmail(String userEmail, String key, String keyType, String subject, String htmlPath) throws Exception {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
            mimeMessageHelper.setTo(userEmail);
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(convertHtml2String(htmlPath, key, keyType), true);
            mailSender.send(mimeMessage);
        }
        catch (Exception e) {
            throw e;
        }
    }

    private static String generateLicenseKey() {
        Random rand = new Random();
        int num;
        String key = "";
        for (int i=0; i<16; i++) {
            do {
                num = rand.nextInt(43);
            } while (num >= 10 && num <= 16);
            key += (char) (num + '0');
        }
        return key;
    }

    private static String generateAuthCode() {
        Random rand = new Random();
        String code = "";
        for (int i=0; i<6; i++) {
            code += (char) (rand.nextInt(10) + '0');
        }
        return code;
    }

    private void saveKey(String email, String key, String keyType) {
        LicenseModel licenseModel = new LicenseModel();
        licenseModel.setLicenseKey(key);
        licenseModel.setEmail(email);
        licenseModel.setCreatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        switch (keyType) {
            case "license" -> licenseModel.setExpiresAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")).plusWeeks(1));
            case "authentication" -> licenseModel.setExpiresAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")).plusMinutes(5));
        }
        licenseModel.setIsAvailable(true);
        licenseRepository.save(licenseModel);
    }

    private void setKeyUnavailable(String email, String key) {
        licenseRepository.setKeyUnavailable(email, key);
    }

    private String isKeyAvailable(String email, String key) {
        LicenseModel licenseModel = licenseRepository.getKeyInfo(email, key);
        if (licenseModel == null) {
            return "Key not match";
        }
        else if (!licenseModel.getIsAvailable()) {
            return "Key is not available";
        }
        ZonedDateTime keyExpiredTime = licenseModel.getExpiresAt();
        Comparator<ZonedDateTime> timeComparator = Comparator.naturalOrder();
        if (timeComparator.compare(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")), keyExpiredTime) > 0) {
            setKeyUnavailable(email, key);
            return "Key is expired";
        }
        return "Key is available";
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

        String keyMessage = isKeyAvailable(email, licenseKey);
        switch (keyMessage) {
            case "Key not match":
            case "Key is not available":
            case "Key is expired":
                data.put("account", null);
                data.put("message", keyMessage);
                return data;
            case "Key is available":
                setKeyUnavailable(email, licenseKey);
        }

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

        UserAccountModel userAccountModel = createAccount(username, email, password);
        message = "A new account is created";

        data.put("account", userAccountModel);
        data.put("message", message);
        return data;
    }

    public Boolean requestLicenseKey(String email) {
        try {
            String licenseKey = generateLicenseKey();
            saveKey(email, licenseKey, "license");
            sendEmail(email, licenseKey, "license","Activate Your FlowChat Account", "src/main/resources/licenseKeyEmail.html");
            return true;
        } catch (Exception e) {
            System.err.println(e);
            return false;
        }
    }

    public Boolean requestAuthenticationCode(String email) {
        try {
            String authCode = generateAuthCode();
            saveKey(email, authCode, "authentication");
            sendEmail(email, authCode, "authentication", "Reset FlowChat Password", "src/main/resources/authenticationCodeEmail.html");
            return true;
        } catch (Exception e) {
            System.err.println(e);
            return false;
        }
    }
}
