package project.flowchat.backend.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import project.flowchat.backend.Model.LicenseModel;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Repository.LicenseRepository;
import project.flowchat.backend.Repository.UserAccountRepository;

import java.security.Key;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class SecurityService {

    @Autowired
    private final UserAccountRepository userAccountRepository;
    private final LicenseRepository licenseRepository;

    protected enum KeyType {
        LICENSE,
        AUTHENTICATION,
        TOKEN
    }

    /**
     * Turn key from String to Key object
     * @return key for signing JWT
     */
    protected Key getTokenKey() throws Exception {
        KeyGenerator gen = KeyGenerator.getInstance("HmacSHA256");
        SecretKey k = gen.generateKey();
        String tokenKey = Base64.getEncoder().encodeToString(k.getEncoded());
        byte[] keyBytes = Decoders.BASE64.decode(tokenKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate JWT with username as subject
     * @param user UserAccountModel Object
     * @return JWT for user with that username
     */
    protected String generateToken(UserAccountModel user) throws Exception {
        Map<String, Object> claims = new HashMap<>();
        String role = userAccountRepository.findRoleById(user.getRoleId());
        claims.put("role", role);
        claims.put("id", user.getUserId());
        return Jwts.builder()
                .claims()
                .add(claims)
                .and()
                .subject(user.getUsername())
                .signWith(getTokenKey())
                .compact();
    }

    /**
     * Generate a 16-char random license key
     * @return 16-char random license key string
     */
    protected String generateLicenseKey() {
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

    /**
     * Generate a 6-digit random authentication code
     * @return 6-digit random authentication code string
     */
    protected String generateAuthenticationCode() {
        Random rand = new Random();
        String code = "";
        for (int i=0; i<6; i++) {
            code += (char) (rand.nextInt(10) + '0');
        }
        return code;
    }

    /**
     * Set a license key or authentication code to unavailable by matching the email address and key
     * @param email email string
     * @param key license key or authentication code
     */
    protected void setKeyUnavailable(String email, String key, KeyType keyType) throws Exception {
        if (key == null || (keyType == KeyType.LICENSE && key.length() != 16) || (keyType == KeyType.AUTHENTICATION && key.length() != 6)) {
            throw new ExceptionService("Key Type not match");
        }
        LicenseModel licenseModel = licenseRepository.getKeyInfo(email, key);
        if (licenseModel == null) {
            throw new ExceptionService("Key not match");
        }
        else if (!licenseModel.getIsAvailable()) {
            throw new ExceptionService("Key is not available");
        }
        licenseRepository.setKeyUnavailable(email, key);
        ZonedDateTime keyExpiredTime = licenseModel.getExpiresAt();
        Comparator<ZonedDateTime> timeComparator = Comparator.naturalOrder();
        if (timeComparator.compare(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")), keyExpiredTime) > 0) {
            throw new ExceptionService("Key is expired");
        }
    }

    /**
     * Save a key information to database
     * @param email email string
     * @param key license key or authentication code
     * @param keyType LICENSE or AUTHENTICATION
     */
    protected void saveKey(String email, String key, KeyType keyType) {
        LicenseModel licenseModel = new LicenseModel();
        licenseModel.setLicenseKey(key);
        licenseModel.setEmail(email);
        licenseModel.setCreatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        switch (keyType) {
            case LICENSE -> licenseModel.setExpiresAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")).plusWeeks(1));
            case AUTHENTICATION -> licenseModel.setExpiresAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")).plusMinutes(10));
        }
        licenseModel.setIsAvailable(true);
        licenseRepository.save(licenseModel);
    }
}
