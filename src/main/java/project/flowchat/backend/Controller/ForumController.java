package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import project.flowchat.backend.Model.ResponseBody;
import project.flowchat.backend.Service.ExceptionService;
import project.flowchat.backend.Service.ForumService;

import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("api/Forum")
public class ForumController {

    @Autowired
    private final ForumService forumService;
    private ResponseBody responseBody;

    @PostMapping()
    private ResponseBody xxx() {
        try {
            Map<String, Object> data = new HashMap<>();
            throw new ExceptionService("xxx");
        } catch (ExceptionService e) {

        } catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @PostMapping(value = "createPost", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    private ResponseBody createPost(@RequestPart Map<String, String> requestBody,
                                    @RequestPart(required = false) MultipartFile file) {
        try {
            Map<String, Object> data = new HashMap<>();
            forumService.createPostOrComment(   requestBody.get("userId"),
                                                requestBody.get("title"),
                                                requestBody.get("content"),
                                                requestBody.get("tag"),
                                                file,
                                                requestBody.get("attachTo"));

            responseBody.setMessage("A new post/comment is created");
            data.put("isSucess", true);
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

    @PutMapping(value = "updatePost", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    private ResponseBody updatePost(@RequestPart Map<String, String> requestBody,
                                    @RequestPart(required = false) MultipartFile file) {
        try {
            Map<String, Object> data = new HashMap<>();
            forumService.updatePostOrComment(   requestBody.get("postId"),
                                                requestBody.get("userId"),
                                                requestBody.get("title"),
                                                requestBody.get("content"),
                                                requestBody.get("tag"),
                                                file,
                                                requestBody.get("attachTo"));

            responseBody.setMessage("A new post/comment is updated");
            data.put("isSucess", true);
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

    @PutMapping("deletePost")
    private ResponseBody deletePost(@RequestParam Map<String, String> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            forumService.deletePostOrComment(requestBody.get("postId"), requestBody.get("userId"));
            responseBody.setMessage("The post/comment is deleted");
            data.put("isSucess", true);
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

}
