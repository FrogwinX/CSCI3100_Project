package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.flowchat.backend.Repository.AccountRepository;

@AllArgsConstructor
@Service
public class AccountService {

    @Autowired
    private final AccountRepository accountRepository;

    public String encodePassword(String rawPassword) {
        return BCrypt.hashpw(rawPassword, BCrypt.gensalt());
    }

    public boolean isPasswordCorrect(String rawPassword, String hashPassword) {
        return BCrypt.checkpw(rawPassword, hashPassword);
    }

}
