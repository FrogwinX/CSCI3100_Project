package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.flowchat.backend.Model.SystemModel;
import project.flowchat.backend.Repository.AccountRepository;
import project.flowchat.backend.Repository.SystemRepository;

import java.util.List;

@AllArgsConstructor
@Service
public class AccountService {

    @Autowired
    private final AccountRepository accountRepository;

}
