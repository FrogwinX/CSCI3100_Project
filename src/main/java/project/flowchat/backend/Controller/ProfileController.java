package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.flowchat.backend.DTO.ResponseBodyDTO;
import project.flowchat.backend.Service.ExceptionService;
import project.flowchat.backend.Service.ProfileService;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://kind-wave-0b69df000.6.azurestaticapps.net"})
@RequestMapping("api/Profile")
public class ProfileController {

    @Autowired
    private final ProfileService profileService;
    private ResponseBodyDTO responseBodyDTO;

    @PostMapping("followUser")
    private ResponseBodyDTO followUser(@RequestBody Map<String, Integer> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            profileService.followUser(requestBody.get("userIdFrom"), requestBody.get("userIdTo"));
            data.put("isSuccess", true);
            responseBodyDTO.setMessage("The user is followed");
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

    @DeleteMapping("unfollowUser")
    private ResponseBodyDTO unfollowUser(@RequestBody Map<String, Integer> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            profileService.unfollowUser(requestBody.get("userIdFrom"), requestBody.get("userIdTo"));
            data.put("isSuccess", true);
            responseBodyDTO.setMessage("The user is unfollowed");
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
}
