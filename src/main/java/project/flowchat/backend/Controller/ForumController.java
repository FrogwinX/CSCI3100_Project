package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.flowchat.backend.DTO.PostContentDTO;
import project.flowchat.backend.DTO.PostPreviewDTO;
import project.flowchat.backend.DTO.ResponseBodyDTO;
import project.flowchat.backend.Service.ExceptionService;
import project.flowchat.backend.Service.ForumService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("api/Forum")
public class ForumController {

    @Autowired
    private final ForumService forumService;
    private ResponseBodyDTO responseBodyDTO;

    @GetMapping("getLatestPostPreviewList")
    private ResponseBodyDTO getLatestPostPreviewList(@RequestParam Integer userId, Integer postNumOffset, Integer postNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<PostPreviewDTO> postPreviewModelList = forumService.getLatestPostPreviewList(userId, postNumOffset, postNum);
            data.put("isSuccess", true);
            data.put("postPreviewList", postPreviewModelList);
            responseBodyDTO.setMessage("The latest post preview list is returned");
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

    @GetMapping("getRecommendedPostPreviewList")
    private ResponseBodyDTO getRecommendedPostPreviewList(@RequestParam Integer userId, Integer postNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<PostPreviewDTO> postPreviewModelList = forumService.getRecommendedPostPreviewList(userId, postNum);
            data.put("isSuccess", true);
            data.put("postPreviewList", postPreviewModelList);
            responseBodyDTO.setMessage("The recommended post preview list is returned");
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


    @GetMapping("getPostContent")
    private ResponseBodyDTO getPostContent(@RequestParam Integer postId, Integer userId) {
        try {
            Map<String, Object> data = new HashMap<>();
            PostContentDTO postContentDTO = forumService.getPostContent(postId, userId);
            data.put("isSuccess", true);
            data.put("post", postContentDTO);
            responseBodyDTO.setMessage("The post content is returned");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("post", null);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

}
