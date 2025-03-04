package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.flowchat.backend.Model.ResponseBody;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Service.AccountService;
import project.flowchat.backend.Service.ExceptionService;

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
        } catch (ExceptionService e) {
            responseBody.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isUsernameUnique", false);
            responseBody.setData(data);
        } catch (Exception e) {
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
        } catch (ExceptionService e) {
            responseBody.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isEmailUnique", false);
            responseBody.setData(data);
        } catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @PostMapping("registerAccount")
    private ResponseBody registerAccount(@RequestBody Map<String, String> requestBody) {
        ResponseBody responseBody = new ResponseBody();
        try {
            Map<String, Object> data = new HashMap<>();
            UserAccountModel account = accountService.registerAccount(  requestBody.get("username"),
                                                                        requestBody.get("email"),
                                                                        requestBody.get("password"),
                                                                        requestBody.get("licenseKey"));
            data.put("isSuccess", true);
            Map<String, Object> user = new HashMap<>();
            user.put("id", account.getUserId());
            user.put("username", account.getUsername());
            user.put("role", accountService.getRoleById(account.getRoleId()));
            data.put("user", user);
            responseBody.setMessage("A new account is created");
            responseBody.setData(data);
        } catch (ExceptionService e) {
            responseBody.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("user", null);
            responseBody.setData(data);
        } catch (Exception e) {
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
        } catch (ExceptionService e) {
            responseBody.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            responseBody.setData(data);
        } catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @PostMapping("requestAuthenticationCode")
    private ResponseBody requestAuthenticationCode(@RequestBody Map<String, String> requestBody) {
        ResponseBody responseBody = new ResponseBody();
        try {
            Map<String, Object> data = new HashMap<>();
            accountService.requestAuthenticationCode(requestBody.get("email"));
            data.put("isSuccess", true);
            responseBody.setMessage("A new authentication code is generated and sent");
            responseBody.setData(data);
        } catch (ExceptionService e) {
            responseBody.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            responseBody.setData(data);
        } catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @PostMapping("login")
    private ResponseBody login(@RequestBody Map<String, String> requestBody) {
        ResponseBody responseBody = new ResponseBody();
        String username = requestBody.get("username");
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        try {
            Map<String, Object> info = new HashMap<>();
            Map<String, Object> userLoginInfo = accountService.getUserLoginInfo(username, email, password);
            info.put("user", userLoginInfo);
            responseBody.setMessage("Account is active and password is correct");
            responseBody.setData(info);
        } catch (ExceptionService e) {
            responseBody.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            if (e.getMessage().equals("Account is not active")) {
                data.put("isAccountActive", false);
                data.put("isPasswordCorrect", false);
            }
            else {
                data.put("isAccountActive", true);
                data.put("isPasswordCorrect", false);
            }
            data.put("user", null);
            responseBody.setData(data);
        }
        catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @PutMapping("resetPasswordByEmail")
    private ResponseBody resetPasswordByEmail(@RequestBody Map<String, String> requestBody) {
        ResponseBody responseBody = new ResponseBody();
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        String authenticationCode = requestBody.get("authenticationCode");

        try {
            Map<String, Object> data = new HashMap<>();
            accountService.resetPassword(email, password, authenticationCode);
            data.put("isSuccess", true);
            data.put("username", accountService.getNameFromEmail(email));
            responseBody.setMessage("Password is reset");
            responseBody.setData(data);
        } catch (ExceptionService e) {
            responseBody.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("username", null);
            responseBody.setData(data);
        } catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @PutMapping("deleteAccount")
    private ResponseBody deleteAccount(@RequestBody Map<String, String> requestBody) {
        ResponseBody responseBody = new ResponseBody();
        try {
            Map<String, Object> data = new HashMap<>();
            String username = requestBody.get("username");
            String email = requestBody.get("email");
            accountService.deleteAccount(username, email);
            data.put("isSuccess", true);
            responseBody.setMessage("Account is deleted");
            responseBody.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            responseBody.setMessage(e.getMessage());
            responseBody.setData(data);
        }
        catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }
}
