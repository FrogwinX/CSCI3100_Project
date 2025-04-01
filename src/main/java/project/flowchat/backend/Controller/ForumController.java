package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import project.flowchat.backend.DTO.PostDTO;
import project.flowchat.backend.DTO.ResponseBodyDTO;
import org.springframework.web.multipart.MultipartFile;
import project.flowchat.backend.Service.AccountService;
import project.flowchat.backend.Service.ExceptionService;
import project.flowchat.backend.Service.ForumService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://kind-wave-0b69df000.6.azurestaticapps.net"})
@RequestMapping("api/Forum")
public class ForumController {

    @Autowired
    private final AccountService accountService;
    private final ForumService forumService;
    private ResponseBodyDTO responseBodyDTO;

    @GetMapping("getLatestPostPreviewList")
    private ResponseBodyDTO getLatestPostPreviewList(@RequestParam Integer userId,
                                                     @RequestParam(value = "excludingPostIdList") List<Integer> excludingPostIdList,
                                                     @RequestParam Integer postNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<PostDTO> postPreviewModelList = forumService.getLatestPostPreviewList(userId, excludingPostIdList, postNum);
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
    private ResponseBodyDTO getRecommendedPostPreviewList(@RequestParam Integer userId,
                                                          @RequestParam(value = "excludingPostIdList") List<Integer> excludingPostIdList,
                                                          @RequestParam Integer postNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<PostDTO> postPreviewModelList = forumService.getRecommendedPostPreviewList(userId, excludingPostIdList, postNum);
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

    @GetMapping("getFollowingPostPreviewList")
    private ResponseBodyDTO getFollowingPostPreviewList(@RequestParam Integer userId,
                                                        @RequestParam(value = "excludingPostIdList") List<Integer> excludingPostIdList,
                                                        @RequestParam Integer postNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<PostDTO> postPreviewModelList = forumService.getFollowingPostPreviewList(userId, excludingPostIdList, postNum);
            data.put("isSuccess", true);
            data.put("postPreviewList", postPreviewModelList);
            responseBodyDTO.setMessage("The following post preview list is returned");
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

    @SuppressWarnings("unchecked")
    @PostMapping(value = "createPostOrComment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    private ResponseBodyDTO createPostOrComment(@RequestPart Map<String, Object> requestBody,
                                    @RequestPart(required = false, value = "imageList") List<MultipartFile> files) {
        try {
            Map<String, Object> data = new HashMap<>();
            forumService.createPostOrComment(   (Integer) requestBody.get("userId"),
                                                (String) requestBody.get("title"),
                                                (String) requestBody.get("content"),
                                                (List<String>) requestBody.get("tag"),
                                                (List<MultipartFile>) files,
                                                (Integer) requestBody.get("attachTo"));

            responseBodyDTO.setMessage("A new post/comment is created");
            data.put("isSuccess", true);
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

    @SuppressWarnings("unchecked")
    @PutMapping(value = "updatePostOrComment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    private ResponseBodyDTO updatePostOrComment(@RequestPart Map<String, Object> requestBody,
                                    @RequestPart(required = false, value = "imageList") List<MultipartFile> files) {
        try {
            Map<String, Object> data = new HashMap<>();
            forumService.updatePostOrComment(   (Integer) requestBody.get("postId"),
                                                (Integer) requestBody.get("userId"),
                                                (String) requestBody.get("title"),
                                                (String) requestBody.get("content"),
                                                (List<String>) requestBody.get("tag"),
                                                (List<MultipartFile>) files,
                                                (Integer) requestBody.get("attachTo"));

            responseBodyDTO.setMessage("A new post/comment is updated");
            data.put("isSuccess", true);
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

    @PutMapping("deletePostOrComment")
    private ResponseBodyDTO deletePostOrComment(@RequestBody Map<String, Object> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            forumService.deletePostOrComment((Integer) requestBody.get("postId"), (Integer) requestBody.get("userId"));
            responseBodyDTO.setMessage("The post/comment is deleted");
            data.put("isSuccess", true);
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

    @GetMapping("getPostContent")
    private ResponseBodyDTO getPostContent(@RequestParam Integer postId, Integer userId) {
        try {
            Map<String, Object> data = new HashMap<>();
            PostDTO postContentDTO = forumService.getPostContentByPostId(postId, userId);
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

    @GetMapping("getCommentList")
    private ResponseBodyDTO getCommentList(@RequestParam Integer postId, Integer userId) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<PostDTO> commentDTO = forumService.getCommentByPostId(postId, userId);
            data.put("isSuccess", true);
            data.put("commentList", commentDTO);
            responseBodyDTO.setMessage("The comment list is returned");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("commentList", null);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @PostMapping("likeOrDislike")
    private ResponseBodyDTO likeOrDislike(@RequestBody Map<String, Object> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            forumService.likeOrDislike( (Integer) requestBody.get("postId"),
                                        (Integer) requestBody.get("userId"),
                                        (String) requestBody.get("action"));
            data.put("isSuccess", true);
            responseBodyDTO.setMessage("The post/comment is liked/disliked");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @DeleteMapping("unlikeOrUndislike")
    private ResponseBodyDTO unlikeOrUndislike(@RequestBody Map<String, Object> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            forumService.unlikeOrUndislike((Integer) requestBody.get("postId"),
                                        (Integer) requestBody.get("userId"), 
                                        (String) requestBody.get("action"));
            data.put("isSuccess", true);
            responseBodyDTO.setMessage("The post/comment is un-liked/un-disliked");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @GetMapping("searchUser")
    private ResponseBodyDTO searchUser(@RequestParam Integer userId,
                                       @RequestParam String keyword,
                                       @RequestParam(value = "excludingUserIdList") List<Integer> excludingUserIdList,
                                       @RequestParam Integer searchNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<Map<String, Object>> userList = accountService.searchUser(userId, keyword, excludingUserIdList, searchNum);
            data.put("isSuccess", true);
            data.put("userList", userList);
            responseBodyDTO.setMessage("The search result is returned");
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

    @GetMapping("searchPost")
    private ResponseBodyDTO searchPost(@RequestParam Integer userId,
                                       @RequestParam String keyword,
                                       @RequestParam(value = "excludingPostIdList") List<Integer> excludingPostIdList,
                                       @RequestParam Integer searchNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<PostDTO> postPreviewList = forumService.searchPost(userId, keyword, excludingPostIdList, searchNum);
            data.put("isSuccess", true);
            data.put("postPreviewList", postPreviewList);
            responseBodyDTO.setMessage("The search result is returned");
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

    @GetMapping("getAllTag")
    private ResponseBodyDTO getAllTag() {
        try {
            Map<String, Object> data = new HashMap<>();
            List<Map<String, Object>> tagList = forumService.getAllTag();
            data.put("isSuccess", true);
            data.put("tagList", tagList);
            responseBodyDTO.setMessage("The tag list is returned");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("tagList", null);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

}
