package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import project.flowchat.backend.DTO.PostDTO;
import project.flowchat.backend.DTO.ResponseBodyDTO;
import project.flowchat.backend.DTO.UserInfoDTO;
import project.flowchat.backend.DTO.UserProfileDTO;
import project.flowchat.backend.Service.ExceptionService;
import project.flowchat.backend.Service.ForumService;
import project.flowchat.backend.Service.ProfileService;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://kind-wave-0b69df000.6.azurestaticapps.net"})
@RequestMapping("api/Profile")
public class ProfileController {

    @Autowired
    private final ProfileService profileService;
    private final ForumService forumService;
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

    @PostMapping("blockUser")
    private ResponseBodyDTO blockUser(@RequestBody Map<String, Integer> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            profileService.blockUser(requestBody.get("userIdFrom"), requestBody.get("userIdTo"));
            data.put("isSuccess", true);
            responseBodyDTO.setMessage("The user is blocked");
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

    @DeleteMapping("unblockUser")
    private ResponseBodyDTO unblockUser(@RequestBody Map<String, Integer> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            profileService.unblockUser(requestBody.get("userIdFrom"), requestBody.get("userIdTo"));
            data.put("isSuccess", true);
            responseBodyDTO.setMessage("The user is unblocked");
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

    @PutMapping(value = "updatePersonalProfile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    private ResponseBodyDTO updatePersonalProfile(@RequestPart Map<String, Object> requestBody,
                                                @RequestPart(required = false, value = "avatar") MultipartFile avatar) {
        try {
            Map<String, Object> data = new HashMap<>();
            profileService.updatePersonalProfile((Integer) requestBody.get("userId"), 
                                                (String) requestBody.get("username"), 
                                                (String) requestBody.get("description"), 
                                                avatar);
            data.put("isSuccess", true);
            responseBodyDTO.setMessage("The user personal profile is updated");
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

    @GetMapping("getProfileContent")
    private ResponseBodyDTO getProfileContent(@RequestParam Integer userIdFrom, Integer userIdTo) {
        try {
            Map<String, Object> data = new HashMap<>();
            UserProfileDTO userProfileDTO = profileService.getProfileContent(userIdFrom, userIdTo);
            data.put("isSuccess", true);
            data.put("profile", userProfileDTO);
            responseBodyDTO.setMessage("The user profile content is returned");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("profile", null);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @GetMapping("getMyPostPreviewList")
    private ResponseBodyDTO getMyPostPreviewList(@RequestParam Integer userIdFrom,
                                                 @RequestParam Integer userIdTo,
                                                 @RequestParam(value = "excludingPostIdList") List<Integer> excludingPostIdList,
                                                 @RequestParam Integer postNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<PostDTO> postPreviewModelList = forumService.getUserPostPreviewList(userIdFrom, userIdTo, excludingPostIdList, postNum);
            data.put("isSuccess", true);
            data.put("postPreviewList", postPreviewModelList);
            responseBodyDTO.setMessage("My post preview list is returned");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("postPreviewList", null);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @GetMapping("getMyCommentPreviewList")
    private ResponseBodyDTO getMyCommentPreviewList(@RequestParam Integer userIdFrom,
                                                    @RequestParam Integer userIdTo,
                                                    @RequestParam(value = "excludingCommentIdList") List<Integer> excludingCommentIdList,
                                                    @RequestParam Integer commentNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<PostDTO> postPreviewModelList = forumService.getUserCommentPreviewList(userIdFrom, userIdTo, excludingCommentIdList, commentNum);
            data.put("isSuccess", true);
            data.put("postPreviewList", postPreviewModelList);
            responseBodyDTO.setMessage("My comment preview list is returned");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("postPreviewList", null);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @GetMapping("getMyFollowingList")
    private ResponseBodyDTO getMyFollowingList(@RequestParam Integer userId,
                                               @RequestParam(value = "excludingUserIdList") List<Integer> excludingUserIdList,
                                               @RequestParam Integer userNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<UserInfoDTO> userList = profileService.getUserList(userId, excludingUserIdList, userNum, "following");
            data.put("isSuccess", true);
            data.put("userList", userList);
            responseBodyDTO.setMessage("My following list is returned");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("userList", null);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @GetMapping("getMyFollowerList")
    private ResponseBodyDTO getMyFollowerList( @RequestParam Integer userId,
                                               @RequestParam(value = "excludingUserIdList") List<Integer> excludingUserIdList,
                                               @RequestParam Integer userNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<UserInfoDTO> userList = profileService.getUserList(userId, excludingUserIdList, userNum, "follower");
            data.put("isSuccess", true);
            data.put("userList", userList);
            responseBodyDTO.setMessage("My follower list is returned");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("userList", null);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @GetMapping("getMyBlockingList")
    private ResponseBodyDTO getMyBlockingList( @RequestParam Integer userId,
                                               @RequestParam(value = "excludingUserIdList") List<Integer> excludingUserIdList,
                                               @RequestParam Integer userNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<UserInfoDTO> userList = profileService.getUserList(userId, excludingUserIdList, userNum, "blocking");
            data.put("isSuccess", true);
            data.put("userList", userList);
            responseBodyDTO.setMessage("My blocking list is returned");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("userList", null);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }
}
