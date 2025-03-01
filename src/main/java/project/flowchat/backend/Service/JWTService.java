package project.flowchat.backend.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Repository.UserAccountRepository;

import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JWTService {

    @Autowired
    private final UserAccountRepository userAccountRepository;

    private String key;


    /**
     * Generate key for validating JWT
     */
    public JWTService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
        try {
            KeyGenerator gen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey k = gen.generateKey();
            key = Base64.getEncoder().encodeToString(k.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }

    /**
     * Generate JWT with username as subject
     * @param username
     * @return String: JWT for user with that username
     */
    public String generateToken(UserAccountModel user) {
        Map<String, Object> claims = new HashMap<>();
        String role = userAccountRepository.findRoleById(user.getRoleId());
        claims.put("role", role);
        claims.put("id", user.getUserId());
        return Jwts.builder()
                .claims()
                .add(claims)
                .and()
                .subject(user.getUsername())
                .signWith(getKey())
                .compact();
    }

    /**
     * Turn key from String to Key object
     * @return Key: key for signing JWT
     */
    public Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(key);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
