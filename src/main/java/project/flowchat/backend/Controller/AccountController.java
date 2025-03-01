package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
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
            Map<String, Object> data = new HashMap<>();
            Boolean isUsernameUnique = accountService.isUsernameUnique(username);
            data.put("isUsernameUnique", isUsernameUnique);
            if (isUsernameUnique) {
                responseBody.setMessage("The username is unique");
            }
            else {
                responseBody.setMessage("The username is not unique");
            }
            responseBody.setData(data);
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
            Map<String, Object> data = new HashMap<>();
            Boolean isEmailUnique = accountService.isEmailUnique(email);
            data.put("isEmailUnique", isEmailUnique);
            if (isEmailUnique) {
                responseBody.setMessage("The email is unique");
            }
            else {
                responseBody.setMessage("The email is not unique");
            }
            responseBody.setData(data);
        }
        catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @PostMapping("registerAccount")
    private ResponseBody registerAccount(@RequestBody Map<String, String> requestBody) {
        ResponseBody responseBody = new ResponseBody();
        try {
            Map<String, Object> data = accountService.registerAccount(  requestBody.get("username"),
                                                                        requestBody.get("email"),
                                                                        requestBody.get("password"),
                                                                        requestBody.get("licenseKey"));
            UserAccountModel account = (UserAccountModel) data.get("account");
            String message = (String) data.get("message");
            data = new HashMap<>();
            if (account != null) {
                data.put("isSuccess", true);
                Map<String, Object> user = new HashMap<>();
                user.put("id", account.getUserId());
                user.put("username", account.getUsername());
                user.put("role", accountService.getRoleById(account.getRoleId()));
                data.put("user", user);
                responseBody.setMessage("A new account is created");
            }
            else {
                data.put("isSuccess", false);
                data.put("user", null);
                responseBody.setMessage(message);
            }
            responseBody.setData(data);
        }
        catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @PostMapping("requestLicenseKey")
    private ResponseBody requestLicenseKey(@RequestBody Map<String, String> requestBody) {
        ResponseBody responseBody = new ResponseBody();
        try {
            Map<String, Object> data = new HashMap<>();
            accountService.requestLicenseKey(requestBody.get("email"));
            data.put("isSuccess", true);
            responseBody.setMessage("A new license key is generated and sent");
            responseBody.setData(data);
        }
        catch (Exception e) {
            responseBody.setMessage("Cannot create a new license key: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @PostMapping("requestAuthenticationCode")
    private ResponseBody requestAuthenticationCode(@RequestBody Map<String, String> requestBody) {
        ResponseBody responseBody = new ResponseBody();
        try {
            Map<String, Object> data = new HashMap<>();
            System.out.println(requestBody.get("email"));
            accountService.requestAuthenticationCode(requestBody.get("email"));
            data.put("isSuccess", true);
            responseBody.setMessage("A new authentication code is generated and sent");
            responseBody.setData(data);
        }
        catch (Exception e) {
            responseBody.setMessage("Cannot create a new authentication code: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @PostMapping("login")
    private ResponseBody login(@RequestParam String usernameOrEmail, @RequestParam String password) {
        ResponseBody responseBody = new ResponseBody();
        try {
            Map<String, Object> info = new HashMap<>();
            Boolean isAccountActive = accountService.isAccountActive(usernameOrEmail, password);
            info.put("isAccountActive", isAccountActive);
            if (isAccountActive) {
                Map<String, Object> userLoginInfo = accountService.getUserLoginInfo(usernameOrEmail);
                responseBody.setMessage("Account is active");
                info.put("user", userLoginInfo);
            }
            else {
                responseBody.setMessage("Account is not active");
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
}
