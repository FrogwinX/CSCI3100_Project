package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.flowchat.backend.DTO.ResponseBodyDTO;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Service.AccountService;
import project.flowchat.backend.Service.ExceptionService;

import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://kind-wave-0b69df000.6.azurestaticapps.net"})
@RequestMapping("api/Account")
public class AccountController {

    @Autowired
    private final AccountService accountService;
    private ResponseBodyDTO responseBodyDTO;

    @GetMapping("isUsernameUnique")
    private ResponseBodyDTO isUsernameUnique(@RequestParam String username) {
        try {
            Map<String, Object> data = new HashMap<>();
            Boolean isUsernameUnique = accountService.isUsernameUnique(username);
            data.put("isUsernameUnique", isUsernameUnique);
            responseBodyDTO.setMessage("The username is unique");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            responseBodyDTO.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isUsernameUnique", false);
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @GetMapping("isEmailUnique")
    private ResponseBodyDTO isEmailUnique(@RequestParam String email) {
        try {
            Map<String, Object> data = new HashMap<>();
            Boolean isEmailUnique = accountService.isEmailUnique(email);
            data.put("isEmailUnique", isEmailUnique);
            responseBodyDTO.setMessage("The email is unique");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            responseBodyDTO.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isEmailUnique", false);
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @PostMapping("registerAccount")
    private ResponseBodyDTO registerAccount(@RequestBody Map<String, String> requestBody) {
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
            responseBodyDTO.setMessage("A new account is created");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            responseBodyDTO.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("user", null);
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @PostMapping("requestLicenseKey")
    private ResponseBodyDTO requestLicenseKey(@RequestBody Map<String, String> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            accountService.requestLicenseKey(requestBody.get("email"));
            data.put("isSuccess", true);
            responseBodyDTO.setMessage("A new license key is generated and sent");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            responseBodyDTO.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            responseBodyDTO.setData(data);
        } catch (Exception e) { 
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @PostMapping("requestAuthenticationCode")
    private ResponseBodyDTO requestAuthenticationCode(@RequestBody Map<String, String> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            accountService.requestAuthenticationCode(requestBody.get("email"));
            data.put("isSuccess", true);
            responseBodyDTO.setMessage("A new authentication code is generated and sent");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            responseBodyDTO.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @PostMapping("login")
    private ResponseBodyDTO login(@RequestBody Map<String, String> requestBody) {
        String username = requestBody.get("username");
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        try {
            Map<String, Object> info = new HashMap<>();
            Map<String, Object> userLoginInfo = accountService.getUserLoginInfo(username, email, password);
            info.put("isAccountActive", true);
            info.put("isPasswordCorrect", true);
            info.put("user", userLoginInfo);
            responseBodyDTO.setMessage("Account is active and password is correct");
            responseBodyDTO.setData(info);
        } catch (ExceptionService e) {
            responseBodyDTO.setMessage(e.getMessage());
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
            responseBodyDTO.setData(data);
        }
        catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @PutMapping("resetPasswordByEmail")
    private ResponseBodyDTO resetPasswordByEmail(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        String authenticationCode = requestBody.get("authenticationCode");

        try {
            Map<String, Object> data = new HashMap<>();
            accountService.resetPasswordByEmail(email, password, authenticationCode);
            data.put("isSuccess", true);
            data.put("username", accountService.getNameFromEmail(email));
            responseBodyDTO.setMessage("Password is reset");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            responseBodyDTO.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("username", null);
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @PutMapping("resetPasswordByOldPassword")
    private ResponseBodyDTO resetPasswordByOldPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String oldPassword = requestBody.get("oldPassword");
        String newPassword = requestBody.get("newPassword");

        try {
            Map<String, Object> data = new HashMap<>();
            accountService.resetPasswordByOldPassword(email, oldPassword, newPassword);
            data.put("isSuccess", true);
            data.put("username", accountService.getNameFromEmail(email));
            responseBodyDTO.setMessage("Password is reset");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            responseBodyDTO.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("username", null);
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @PutMapping("deleteAccount")
    private ResponseBodyDTO deleteAccount(@RequestBody Map<String, String> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            String username = requestBody.get("username");
            String email = requestBody.get("email");
            String password = requestBody.get("password");
            accountService.deleteAccount(username, email, password);
            data.put("isSuccess", true);
            responseBodyDTO.setMessage("Account is deleted");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        }
        catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

}
