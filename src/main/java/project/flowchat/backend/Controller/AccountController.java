package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.flowchat.backend.Model.ResponseBody;
import project.flowchat.backend.Service.AccountService;

@AllArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("api/Account")
public class AccountController {

    @Autowired
    private final AccountService accountService;

    @GetMapping("login")
    private ResponseBody login() {
        return null;
    }

    @GetMapping("registerAccount")
    private ResponseBody registerAccount() {
        return null;
    }
}
