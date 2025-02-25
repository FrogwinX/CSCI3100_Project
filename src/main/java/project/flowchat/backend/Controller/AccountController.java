package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import org.hibernate.annotations.Cache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.flowchat.backend.Model.ResponseBody;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Service.AccountService;

import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("api/Account")
public class AccountController {

    @Autowired
    private final AccountService accountService;

    @GetMapping("isUsernameUnique")
    private ResponseBody isUsernameUnique(@RequestParam String username) {
        ResponseBody responseBody = new ResponseBody();
        try {
            Map<String, Object> info = new HashMap<>();
            Boolean isUsernameUnique = accountService.isUsernameUnique(username);
            info.put("isUsernameUnique", isUsernameUnique);
            if (isUsernameUnique) {
                responseBody.setMessage("The username is unique");
            }
            else {
                responseBody.setMessage("The username is not unique");
            }
            responseBody.setData(info);
        }
        catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @GetMapping("isEmailUnique")
    private ResponseBody isEmailUnique(@RequestParam String email) {
        ResponseBody responseBody = new ResponseBody();
        try {
            Map<String, Object> info = new HashMap<>();
            Boolean isEmailUnique = accountService.isEmailUnique(email);
            info.put("isEmailUnique", isEmailUnique);
            if (isEmailUnique) {
                responseBody.setMessage("The email is unique");
            }
            else {
                responseBody.setMessage("The email is not unique");
            }
            responseBody.setData(info);
        }
        catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @GetMapping("login")
    private ResponseBody login(@RequestParam String usernameOrEmail, @RequestParam String password) {
        ResponseBody responseBody = new ResponseBody();
        try {
            Map<String, Object> info = new HashMap<>();
            Boolean isAccountMatched = accountService.isAccountMatched(usernameOrEmail, password);
            Boolean isAccountActivated = accountService.isAccountActivated(usernameOrEmail);
            info.put("isAccountMatched", isAccountMatched);
            info.put("isAccountActivated", isAccountActivated);
            if (isAccountMatched) {
                Map<String, Object> userLoginInfo = accountService.getUserLoginInfo(usernameOrEmail);
                responseBody.setMessage("Username or email and password are correct");
                info.put("user", userLoginInfo);
            }
            else {
                responseBody.setMessage("Username or email and password are not correct");
                info.put("user", null);
            }
            
            responseBody.setData(info);
        }
        catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @GetMapping("registerAccount")
    private ResponseBody registerAccount() {
        return null;
    }
}
