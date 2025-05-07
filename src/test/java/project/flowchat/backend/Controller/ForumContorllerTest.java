package project.flowchat.backend.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
// Import TestConfiguration and Bean
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;
import project.flowchat.backend.DTO.PostDTO;
import project.flowchat.backend.DTO.ResponseBodyDTO;
import project.flowchat.backend.DTO.UserInfoDTO; // Added for searchUser test
import project.flowchat.backend.Service.ExceptionService;
import project.flowchat.backend.Service.ForumService;
import project.flowchat.backend.Service.SecurityService; // Import the missing dependency
import project.flowchat.backend.Config.JWTFilter; // Import the JWTFilter

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull; // Added for null check

@WebMvcTest(ForumController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable filters in MockMvc
public class ForumContorllerTest {

    // --- Add this Test Configuration ---
    @TestConfiguration
    static class ForumControllerTestConfig {
        @Bean
        public ResponseBodyDTO responseBodyDTO() {
            // Provide a dummy bean instance to satisfy the dependency during test context loading.
            // The actual controller logic should create new instances per request.
            return new ResponseBodyDTO();
        }
    }
    // --- End of Test Configuration ---

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ForumService forumService;

    @MockBean // Add MockBean for the missing dependency
    private SecurityService securityService;

    @MockBean // Add MockBean for JWTFilter
    private JWTFilter jwtFilter;

    @Autowired
    private ObjectMapper objectMapper;

    private Integer userId;
    private List<Integer> excludingPostIdList;
    private List<Integer> excludingUserIdList; // Added for searchUser tests
    private Integer postNum;
    private Integer searchNum; // Added for search tests
    private List<PostDTO> postPreviewList;
    private PostDTO samplePost;
    private UserInfoDTO sampleUser;

    @BeforeEach
    void setUp() {
        userId = 1;
        excludingPostIdList = new ArrayList<>(Arrays.asList(10, 11));
        excludingUserIdList = new ArrayList<>(Arrays.asList(20, 21)); // Initialize excludingUserIdList
        postNum = 5;
        searchNum = 10; // Initialize searchNum

        postPreviewList = new ArrayList<>();
        PostDTO post1 = new PostDTO();
        post1.setPostId(1);
        post1.setTitle("Test Post 1");
        post1.setUserId(userId);
        post1.setUsername("user1");
        post1.setContent("Content 1");
        post1.setLikeCount(10);
        post1.setIsLiked(false);
        post1.setDislikeCount(1);
        post1.setIsDisliked(false);
        post1.setCommentCount(2);
        post1.setUpdatedAt("2025-05-06T10:00:00Z");

        PostDTO post2 = new PostDTO();
        post2.setPostId(2);
        post2.setTitle("Test Post 2");
        post2.setUserId(2);
        post2.setUsername("user2");
        post2.setContent("Content 2");
        // ... set other fields
        postPreviewList.add(post1);
        postPreviewList.add(post2);

        samplePost = new PostDTO();
        samplePost.setPostId(5);
        samplePost.setUserId(userId);
        samplePost.setUsername("user1");
        samplePost.setTitle("Sample Post Title");
        samplePost.setContent("Detailed content of the sample post.");
        samplePost.setImageAPIList(Arrays.asList("api/Image/1", "api/Image/2"));
        samplePost.setTagNameList(Arrays.asList("java", "spring"));
        samplePost.setLikeCount(25);
        samplePost.setIsLiked(true);
        samplePost.setDislikeCount(3);
        samplePost.setIsDisliked(false);
        samplePost.setCommentCount(8);
        samplePost.setUpdatedAt("2025-05-05T12:30:00Z");
        samplePost.setCommentList(null); // Assuming getPostContent doesn't fetch comments initially

        sampleUser = new UserInfoDTO();
        sampleUser.setUserId(3);
        sampleUser.setUsername("testUser");
        sampleUser.setDescription("A user for testing");
        sampleUser.setAvatar("api/Image/avatar/3");
        sampleUser.setUpdatedAt(ZonedDateTime.now());
        sampleUser.setIsUserBlocked(false);
        sampleUser.setIsUserFollowed(true);
        }

        // --- Existing Tests ---

        @Test
        void createPostOrComment_GenericException() throws Exception {
        // Prepare file part (can be any file, as the exception is generic from the service)
        MockMultipartFile file = new MockMultipartFile(
            "imageList",            // Request part name
            "test-image.jpg",       // Original filename
            MediaType.IMAGE_JPEG_VALUE, // Content type
            "fakeImageData".getBytes()  // File content
        );

        // Prepare JSON body part
        Map<String, Object> requestBodyMap = new HashMap<>();
        String title = "Generic Error Post";
        String content = "Content for generic error post.";
        List<String> tags = Arrays.asList("generic", "error");
        Integer attachTo = 0; // Creating a post (not a comment)

        requestBodyMap.put("userId", userId);
        requestBodyMap.put("title", title);
        requestBodyMap.put("content", content);
        requestBodyMap.put("tag", tags);
        requestBodyMap.put("attachTo", attachTo);

        String requestBodyJson = objectMapper.writeValueAsString(requestBodyMap);
        MockMultipartFile requestBodyPart = new MockMultipartFile(
            "requestBody",      // Request part name for JSON
            "",                 // Original filename for JSON part (can be empty)
            MediaType.APPLICATION_JSON_VALUE, // Content type for JSON part
            requestBodyJson.getBytes()
        );

        String genericErrorMessage = "A fatal service error occurred during post creation";

        // Given: Configure mock ForumService to throw a generic RuntimeException
        // Use any() matchers for parameters not critical to triggering this generic exception path
        doThrow(new RuntimeException(genericErrorMessage)).when(forumService)
            .createPostOrComment(anyInt(), anyString(), anyString(), anyList(), anyList(), anyInt());

        // When & Then
        mockMvc.perform(multipart("/api/Forum/createPostOrComment")
                .file(file) // Add the image file part
                .file(requestBodyPart)) // Add the JSON body part
            .andExpect(status().isOk()) // Controller handles exceptions and returns 200 OK
            .andExpect(jsonPath("$.message", containsString("Fail: java.lang.RuntimeException: " + genericErrorMessage)))
            .andExpect(jsonPath("$.data", is(nullValue()))); // Expecting null data as per controller's generic exception handling

        // Verify that the service method was called, capturing arguments to ensure they were passed
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<MultipartFile>> fileListCaptor = ArgumentCaptor.forClass(List.class);
        verify(forumService).createPostOrComment(
            eq(userId),       // Verify with specific userId from the request
            eq(title),        // Verify with specific title
            eq(content),      // Verify with specific content
            eq(tags),         // Verify with specific tags
            fileListCaptor.capture(), // Capture the list of files passed to the service
            eq(attachTo)      // Verify with specific attachTo value
        );

        // Assertions on captured files (ensures the file was correctly passed to the service layer)
        List<MultipartFile> capturedFiles = fileListCaptor.getValue();
        assertNotNull(capturedFiles, "File list should not be null");
        assertEquals(1, capturedFiles.size(), "Exactly one file should have been captured");
        assertEquals(file.getOriginalFilename(), capturedFiles.get(0).getOriginalFilename(), "Captured file name should match");
        assertEquals(file.getContentType(), capturedFiles.get(0).getContentType(), "Captured file content type should match");
        }
    @Test
    void getLatestPostPreviewList_Success() throws Exception {
        // Given: Configure mock ForumService to return a list of posts
        given(forumService.getLatestPostPreviewList(userId, excludingPostIdList, postNum))
                .willReturn(postPreviewList);

        // When & Then: Perform GET request and verify the response
        mockMvc.perform(get("/api/Forum/getLatestPostPreviewList")
                        .param("userId", userId.toString())
                        .param("excludingPostIdList", excludingPostIdList.get(0).toString(), excludingPostIdList.get(1).toString()) // Pass list elements individually
                        .param("postNum", postNum.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("The latest post preview list is returned")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.postPreviewList", hasSize(postPreviewList.size())))
                .andExpect(jsonPath("$.data.postPreviewList[0].postId", is(postPreviewList.get(0).getPostId())))
                .andExpect(jsonPath("$.data.postPreviewList[0].title", is(postPreviewList.get(0).getTitle())))
                .andExpect(jsonPath("$.data.postPreviewList[1].postId", is(postPreviewList.get(1).getPostId())));

        // Verify that the service method was called
        verify(forumService).getLatestPostPreviewList(userId, excludingPostIdList, postNum);
    }

    @Test
    void getLatestPostPreviewList_ServiceException() throws Exception {
        // Given: Configure mock ForumService to throw a specific ExceptionService
        String errorMessage = ExceptionService.POST_DELETED; // Example error
        given(forumService.getLatestPostPreviewList(userId, excludingPostIdList, postNum))
                .willThrow(new ExceptionService(errorMessage));

        // When & Then: Perform GET request and verify the error response
        mockMvc.perform(get("/api/Forum/getLatestPostPreviewList")
                        .param("userId", userId.toString())
                        .param("excludingPostIdList", excludingPostIdList.get(0).toString(), excludingPostIdList.get(1).toString())
                        .param("postNum", postNum.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // Controller handles exceptions and returns 200 OK
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is(errorMessage)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)))
                .andExpect(jsonPath("$.data.postPreviewList", is(nullValue()))); // Expecting null as per controller logic

        // Verify that the service method was called
        verify(forumService).getLatestPostPreviewList(userId, excludingPostIdList, postNum);
    }

     @Test
    void getLatestPostPreviewList_GenericException() throws Exception {
        // Given: Configure mock ForumService to throw a generic Exception
        String genericErrorMessage = "Unexpected error";
        given(forumService.getLatestPostPreviewList(userId, excludingPostIdList, postNum))
                .willThrow(new RuntimeException(genericErrorMessage)); // Use RuntimeException or any generic Exception

        // When & Then: Perform GET request and verify the generic error response
        mockMvc.perform(get("/api/Forum/getLatestPostPreviewList")
                        .param("userId", userId.toString())
                        .param("excludingPostIdList", excludingPostIdList.get(0).toString(), excludingPostIdList.get(1).toString())
                        .param("postNum", postNum.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // Controller handles exceptions and returns 200 OK
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", containsString("Fail: java.lang.RuntimeException: " + genericErrorMessage))) // Check for the generic error message format
                .andExpect(jsonPath("$.data", is(nullValue()))); // Expecting null data as per controller logic

        // Verify that the service method was called
        verify(forumService).getLatestPostPreviewList(userId, excludingPostIdList, postNum);
    }

    @Test
    void likeOrDislike_Success_Like() throws Exception {
        Map<String, Object> requestBody = new HashMap<>();
        Integer postId = 5;
        String action = "like";
        requestBody.put("postId", postId);
        requestBody.put("userId", userId);
        requestBody.put("action", action);

        // Given: Configure mock ForumService (void method)
        doNothing().when(forumService).likeOrDislike(anyInt(), anyInt(), anyString());

        // When & Then
        mockMvc.perform(post("/api/Forum/likeOrDislike")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody))) // Serialize request body
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The post/comment is liked/disliked")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)));

        // Verify
        verify(forumService).likeOrDislike(
            eq(postId),
            eq(userId),
            eq(action)
        );
    }

     @Test
    void likeOrDislike_Success_Dislike() throws Exception {
        Map<String, Object> requestBody = new HashMap<>();
        Integer postId = 6;
        String action = "dislike";
        requestBody.put("postId", postId);
        requestBody.put("userId", userId);
        requestBody.put("action", action);

        // Given
        doNothing().when(forumService).likeOrDislike(anyInt(), anyInt(), anyString());

        // When & Then
        mockMvc.perform(post("/api/Forum/likeOrDislike")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The post/comment is liked/disliked")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)));

        // Verify
        verify(forumService).likeOrDislike(
            eq(postId),
            eq(userId),
            eq(action)
        );
    }

    @Test
    void likeOrDislike_ServiceException_AlreadyLiked() throws Exception {
        Map<String, Object> requestBody = new HashMap<>();
        Integer postId = 7;
        String action = "like";
        requestBody.put("postId", postId);
        requestBody.put("userId", userId);
        requestBody.put("action", action);

        String errorMessage = ExceptionService.ALREADY_LIKED_THIS_POST;

        // Given: Configure mock ForumService to throw exception
        doThrow(new ExceptionService(errorMessage)).when(forumService).likeOrDislike(
            eq(postId), eq(userId), eq(action)
        );

        // When & Then
        mockMvc.perform(post("/api/Forum/likeOrDislike")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(errorMessage)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));

        // Verify
        verify(forumService).likeOrDislike(
            eq(postId),
            eq(userId),
            eq(action)
        );
    }

     @Test
    void likeOrDislike_GenericException() throws Exception {
        Map<String, Object> requestBody = new HashMap<>();
        Integer postId = 8;
        String action = "like";
        requestBody.put("postId", postId);
        requestBody.put("userId", userId);
        requestBody.put("action", action);

        String genericErrorMessage = "Database connection failed";

        // Given: Configure mock ForumService to throw generic exception
        doThrow(new RuntimeException(genericErrorMessage)).when(forumService).likeOrDislike(
            eq(postId), eq(userId), eq(action)
        );

        // When & Then
        mockMvc.perform(post("/api/Forum/likeOrDislike")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("Fail: java.lang.RuntimeException: " + genericErrorMessage)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        // Verify
        verify(forumService).likeOrDislike(
            eq(postId),
            eq(userId),
            eq(action)
        );
    }

    @Test
    void createPostOrComment_Success_WithImage() throws Exception {
        // Prepare file part
        MockMultipartFile file = new MockMultipartFile(
            "imageList",          // Request part name (must match @RequestPart value)
            "test-image.jpg",   // Original filename
            MediaType.IMAGE_JPEG_VALUE, // Content type
            "fakeImageData".getBytes() // File content
        );

        // Prepare JSON body part
        Map<String, Object> requestBodyMap = new HashMap<>();
        String title = "New Post Title";
        String content = "Post content here.";
        List<String> tags = Arrays.asList("java", "spring");
        Integer attachTo = 0; // Creating a post
        requestBodyMap.put("userId", userId);
        requestBodyMap.put("title", title);
        requestBodyMap.put("content", content);
        requestBodyMap.put("tag", tags);
        requestBodyMap.put("attachTo", attachTo);

        String requestBodyJson = objectMapper.writeValueAsString(requestBodyMap);
        MockMultipartFile requestBodyPart = new MockMultipartFile(
            "requestBody",      // Request part name (must match @RequestPart name)
            "",                 // Original filename (can be empty for JSON part)
            MediaType.APPLICATION_JSON_VALUE, // Content type
            requestBodyJson.getBytes()
        );

        // Given: Configure mock ForumService (void method)
        doNothing().when(forumService).createPostOrComment(anyInt(), anyString(), anyString(), anyList(), anyList(), anyInt());

        // When & Then
        mockMvc.perform(multipart("/api/Forum/createPostOrComment")
                        .file(file) // Add the image file part
                        .file(requestBodyPart)) // Add the JSON body part
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("A new post/comment is created")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)));

        // Verify using ArgumentCaptor for the file list
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<MultipartFile>> fileListCaptor = ArgumentCaptor.forClass(List.class);
        verify(forumService).createPostOrComment(
            eq(userId),
            eq(title),
            eq(content),
            eq(tags),
            fileListCaptor.capture(), // Capture the file list
            eq(attachTo)
        );

        // Assert details about the captured file list
        List<MultipartFile> capturedFiles = fileListCaptor.getValue();
        assertNotNull(capturedFiles);
        assertEquals(1, capturedFiles.size());
        assertEquals(file.getOriginalFilename(), capturedFiles.get(0).getOriginalFilename());
        assertEquals(file.getContentType(), capturedFiles.get(0).getContentType());
    }

    @Test
    void createPostOrComment_Success_NoImage() throws Exception {
        // Prepare JSON body part only
        Map<String, Object> requestBodyMap = new HashMap<>();
        String title = "Post Without Image";
        String content = "Content here.";
        List<String> tags = Arrays.asList("testing");
        Integer attachTo = 0;
        requestBodyMap.put("userId", userId);
        requestBodyMap.put("title", title);
        requestBodyMap.put("content", content);
        requestBodyMap.put("tag", tags);
        requestBodyMap.put("attachTo", attachTo);

        String requestBodyJson = objectMapper.writeValueAsString(requestBodyMap);
        MockMultipartFile requestBodyPart = new MockMultipartFile(
            "requestBody", "", MediaType.APPLICATION_JSON_VALUE, requestBodyJson.getBytes()
        );

        // Given
        doNothing().when(forumService).createPostOrComment(anyInt(), anyString(), anyString(), anyList(), isNull(), anyInt()); // Expect null for files

        // When & Then
        mockMvc.perform(multipart("/api/Forum/createPostOrComment")
                        // No .file(file) call
                        .file(requestBodyPart))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("A new post/comment is created")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)));

        // Verify
        verify(forumService).createPostOrComment(
            eq(userId),
            eq(title),
            eq(content),
            eq(tags),
            isNull(), // Explicitly verify that the file list passed to the service is null
            eq(attachTo)
        );
    }

    @Test
    void createPostOrComment_ServiceException_FileNotImage() throws Exception {
        // Prepare invalid file part
        MockMultipartFile file = new MockMultipartFile(
            "imageList", "not-an-image.txt", MediaType.TEXT_PLAIN_VALUE, "This is text".getBytes()
        );

        // Prepare JSON body part
        Map<String, Object> requestBodyMap = new HashMap<>();
        requestBodyMap.put("userId", userId);
        requestBodyMap.put("title", "Bad File Post");
        requestBodyMap.put("content", "Trying to upload text.");
        requestBodyMap.put("tag", Arrays.asList("error"));
        requestBodyMap.put("attachTo", 0);

        String requestBodyJson = objectMapper.writeValueAsString(requestBodyMap);
        MockMultipartFile requestBodyPart = new MockMultipartFile(
            "requestBody", "", MediaType.APPLICATION_JSON_VALUE, requestBodyJson.getBytes()
        );

        String errorMessage = ExceptionService.FILE_NOT_IMAGE;

        // Given: Configure mock service to throw exception
        doThrow(new ExceptionService(errorMessage)).when(forumService)
            .createPostOrComment(anyInt(), anyString(), anyString(), anyList(), anyList(), anyInt());


        // When & Then
        mockMvc.perform(multipart("/api/Forum/createPostOrComment")
                        .file(file)
                        .file(requestBodyPart))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(errorMessage)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));

        // Verify
         @SuppressWarnings("unchecked")
        ArgumentCaptor<List<MultipartFile>> fileListCaptor = ArgumentCaptor.forClass(List.class);
        verify(forumService).createPostOrComment(
            anyInt(), anyString(), anyString(), anyList(), fileListCaptor.capture(), anyInt()
        );
        assertEquals(1, fileListCaptor.getValue().size());
        assertEquals("not-an-image.txt", fileListCaptor.getValue().get(0).getOriginalFilename());
    }

    @Test
    void getRecommendedPostPreviewList_Success() throws Exception {
        // Given
        given(forumService.getRecommendedPostPreviewList(userId, excludingPostIdList, postNum))
                .willReturn(postPreviewList); // Reuse existing sample data

        // When & Then
        mockMvc.perform(get("/api/Forum/getRecommendedPostPreviewList")
                        .param("userId", userId.toString())
                        .param("excludingPostIdList", excludingPostIdList.get(0).toString(), excludingPostIdList.get(1).toString())
                        .param("postNum", postNum.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The recommended post preview list is returned")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.postPreviewList", hasSize(postPreviewList.size())));

        // Verify
        verify(forumService).getRecommendedPostPreviewList(userId, excludingPostIdList, postNum);
    }

    @Test
    void getRecommendedPostPreviewList_ServiceException() throws Exception {
        // Given
        String errorMessage = "Recommendation engine error"; // Example custom error
        given(forumService.getRecommendedPostPreviewList(userId, excludingPostIdList, postNum))
                .willThrow(new ExceptionService(errorMessage));

        // When & Then
        mockMvc.perform(get("/api/Forum/getRecommendedPostPreviewList")
                        .param("userId", userId.toString())
                        .param("excludingPostIdList", excludingPostIdList.get(0).toString(), excludingPostIdList.get(1).toString())
                        .param("postNum", postNum.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(errorMessage)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)))
                .andExpect(jsonPath("$.data.postPreviewList", is(nullValue())));

        // Verify
        verify(forumService).getRecommendedPostPreviewList(userId, excludingPostIdList, postNum);
    }

    @Test
    void getFollowingPostPreviewList_Success() throws Exception {
        // Given
        given(forumService.getFollowingPostPreviewList(userId, excludingPostIdList, postNum))
                .willReturn(postPreviewList); // Reuse existing sample data

        // When & Then
        mockMvc.perform(get("/api/Forum/getFollowingPostPreviewList")
                        .param("userId", userId.toString())
                        .param("excludingPostIdList", excludingPostIdList.get(0).toString(), excludingPostIdList.get(1).toString())
                        .param("postNum", postNum.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The following post preview list is returned")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.postPreviewList", hasSize(postPreviewList.size())));

        // Verify
        verify(forumService).getFollowingPostPreviewList(userId, excludingPostIdList, postNum);
    }

    @Test
    void getFollowingPostPreviewList_GenericException() throws Exception {
        // Given
        String genericErrorMessage = "Failed to fetch following posts";
        given(forumService.getFollowingPostPreviewList(userId, excludingPostIdList, postNum))
                .willThrow(new RuntimeException(genericErrorMessage));

        // When & Then
        mockMvc.perform(get("/api/Forum/getFollowingPostPreviewList")
                        .param("userId", userId.toString())
                        .param("excludingPostIdList", excludingPostIdList.get(0).toString(), excludingPostIdList.get(1).toString())
                        .param("postNum", postNum.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("Fail: java.lang.RuntimeException: " + genericErrorMessage)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        // Verify
        verify(forumService).getFollowingPostPreviewList(userId, excludingPostIdList, postNum);
    }

    @Test
    void deletePostOrComment_Success() throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        Integer postIdToDelete = 15;
        requestBody.put("postId", postIdToDelete);
        requestBody.put("userId", userId);

        // Given
        doNothing().when(forumService).deletePostOrComment(anyInt(), anyInt());

        // When & Then
        mockMvc.perform(put("/api/Forum/deletePostOrComment") // Assuming PUT, adjust if DELETE
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The post/comment is deleted")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)));

        // Verify
        verify(forumService).deletePostOrComment(eq(postIdToDelete), eq(userId));
    }

    @Test
    void deletePostOrComment_ServiceException_InvalidCreator() throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        Integer postIdToDelete = 16;
        requestBody.put("postId", postIdToDelete);
        requestBody.put("userId", userId);

        String errorMessage = ExceptionService.INVALID_POST_CREATOR;

        // Given
        doThrow(new ExceptionService(errorMessage)).when(forumService)
            .deletePostOrComment(eq(postIdToDelete), eq(userId));

        // When & Then
        mockMvc.perform(put("/api/Forum/deletePostOrComment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(errorMessage)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));

        // Verify
        verify(forumService).deletePostOrComment(eq(postIdToDelete), eq(userId));
    }

    @Test
    void getPostContent_Success() throws Exception {
        Integer postIdToGet = samplePost.getPostId();

        // Given
        given(forumService.getPostContentByPostId(postIdToGet, userId)).willReturn(samplePost);

        // When & Then
        mockMvc.perform(get("/api/Forum/getPostContent")
                        .param("postId", postIdToGet.toString())
                        .param("userId", userId.toString()) // userId is also a @RequestParam
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The post content is returned")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.post.postId", is(samplePost.getPostId())))
                .andExpect(jsonPath("$.data.post.title", is(samplePost.getTitle())))
                .andExpect(jsonPath("$.data.post.content", is(samplePost.getContent())))
                .andExpect(jsonPath("$.data.post.isLiked", is(samplePost.getIsLiked())));

        // Verify
        verify(forumService).getPostContentByPostId(postIdToGet, userId);
    }

    @Test
    void getPostContent_ServiceException_PostDeleted() throws Exception {
        Integer postIdToGet = 99;
        String errorMessage = ExceptionService.POST_DELETED;

        // Given
        given(forumService.getPostContentByPostId(postIdToGet, userId))
            .willThrow(new ExceptionService(errorMessage));

        // When & Then
        mockMvc.perform(get("/api/Forum/getPostContent")
                        .param("postId", postIdToGet.toString())
                        .param("userId", userId.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(errorMessage)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)))
                .andExpect(jsonPath("$.data.post", is(nullValue())));

        // Verify
        verify(forumService).getPostContentByPostId(postIdToGet, userId);
    }

    @Test
    void getCommentList_Success() throws Exception {
        Integer postIdForComments = samplePost.getPostId();
        List<PostDTO> commentList = Arrays.asList(postPreviewList.get(0), postPreviewList.get(1)); // Reuse some posts as comments

        // Given
        given(forumService.getCommentByPostId(postIdForComments, userId)).willReturn(commentList);

        // When & Then
        mockMvc.perform(get("/api/Forum/getCommentList")
                        .param("postId", postIdForComments.toString())
                        .param("userId", userId.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The comment list is returned")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.commentList", hasSize(commentList.size())))
                .andExpect(jsonPath("$.data.commentList[0].postId", is(commentList.get(0).getPostId())));

        // Verify
        verify(forumService).getCommentByPostId(postIdForComments, userId);
    }

    @Test
    void getCommentList_GenericException() throws Exception {
        Integer postIdForComments = samplePost.getPostId();
        String genericErrorMessage = "Error fetching comments";

        // Given
        given(forumService.getCommentByPostId(postIdForComments, userId))
            .willThrow(new RuntimeException(genericErrorMessage));

        // When & Then
        mockMvc.perform(get("/api/Forum/getCommentList")
                        .param("postId", postIdForComments.toString())
                        .param("userId", userId.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("Fail: java.lang.RuntimeException: " + genericErrorMessage)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        // Verify
        verify(forumService).getCommentByPostId(postIdForComments, userId);
    }

     @Test
    void unlikeOrUndislike_Success_Unlike() throws Exception {
        Map<String, Object> requestBody = new HashMap<>();
        Integer postId = 20;
        String action = "unlike"; // Corresponds to INTERACTION_UNLIKE in service
        requestBody.put("postId", postId);
        requestBody.put("userId", userId);
        requestBody.put("action", action);

        // Given
        doNothing().when(forumService).unlikeOrUndislike(anyInt(), anyInt(), anyString());

        // When & Then
        mockMvc.perform(delete("/api/Forum/unlikeOrUndislike") // Assuming DELETE mapping
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The post/comment is un-liked/un-disliked")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)));

        // Verify
        verify(forumService).unlikeOrUndislike(eq(postId), eq(userId), eq(action));
    }

    @Test
    void unlikeOrUndislike_ServiceException_NotLiked() throws Exception {
        Map<String, Object> requestBody = new HashMap<>();
        Integer postId = 21;
        String action = "unlike";
        requestBody.put("postId", postId);
        requestBody.put("userId", userId);
        requestBody.put("action", action);

        String errorMessage = ExceptionService.POST_NOT_LIKED;

        // Given
        doThrow(new ExceptionService(errorMessage)).when(forumService)
            .unlikeOrUndislike(eq(postId), eq(userId), eq(action));

        // When & Then
        mockMvc.perform(delete("/api/Forum/unlikeOrUndislike")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(errorMessage)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));

        // Verify
        verify(forumService).unlikeOrUndislike(eq(postId), eq(userId), eq(action));
    }

    // --- Tests for remaining endpoints ---

    @Test
    void updatePostOrComment_Success() throws Exception {
        // Prepare file part (optional, can be null)
        MockMultipartFile file = new MockMultipartFile(
            "imageList", "updated-image.png", MediaType.IMAGE_PNG_VALUE, "fakePngData".getBytes()
        );

        // Prepare JSON body part
        Map<String, Object> requestBodyMap = new HashMap<>();
        Integer postIdToUpdate = samplePost.getPostId();
        String updatedTitle = "Updated Post Title";
        String updatedContent = "Updated content.";
        List<String> updatedTags = Arrays.asList("updated", "test");
        Integer attachTo = 0; // Assuming update doesn't change attachment type
        requestBodyMap.put("postId", postIdToUpdate);
        requestBodyMap.put("userId", userId);
        requestBodyMap.put("title", updatedTitle);
        requestBodyMap.put("content", updatedContent);
        requestBodyMap.put("tag", updatedTags);
        requestBodyMap.put("attachTo", attachTo); // Include if needed by service method

        String requestBodyJson = objectMapper.writeValueAsString(requestBodyMap);
        MockMultipartFile requestBodyPart = new MockMultipartFile(
            "requestBody", "", MediaType.APPLICATION_JSON_VALUE, requestBodyJson.getBytes()
        );

        // Given
        doNothing().when(forumService).updatePostOrComment(anyInt(), anyInt(), anyString(), anyString(), anyList(), anyList(), anyInt());

        // When & Then
        // Use multipart() for endpoints expecting @RequestPart, and set method to PUT
        mockMvc.perform(multipart("/api/Forum/updatePostOrComment")
                        .file(file) // Add the image file part
                        .file(requestBodyPart) // Add the JSON body part
                        .with(request -> { // Set the HTTP method to PUT for multipart request
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("A new post/comment is updated"))) // Check message from controller
                .andExpect(jsonPath("$.data.isSuccess", is(true)));

        // Verify
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<MultipartFile>> fileListCaptor = ArgumentCaptor.forClass(List.class);
        verify(forumService).updatePostOrComment(
            eq(postIdToUpdate),
            eq(userId),
            eq(updatedTitle),
            eq(updatedContent),
            eq(updatedTags),
            fileListCaptor.capture(),
            eq(attachTo)
        );
        assertEquals(1, fileListCaptor.getValue().size()); // Check captured file
    }

    @Test
    void updatePostOrComment_ServiceException_InvalidCreator() throws Exception {
        // Prepare JSON body part
        Map<String, Object> requestBodyMap = new HashMap<>();
        Integer postIdToUpdate = 99; // Some other post ID
        requestBodyMap.put("postId", postIdToUpdate);
        requestBodyMap.put("userId", userId);
        requestBodyMap.put("title", "Attempt to update");
        requestBodyMap.put("content", "Invalid update attempt content"); // Added content
        requestBodyMap.put("tag", new ArrayList<>());
        requestBodyMap.put("attachTo", 0);


        String requestBodyJson = objectMapper.writeValueAsString(requestBodyMap);
        MockMultipartFile requestBodyPart = new MockMultipartFile(
            "requestBody", "", MediaType.APPLICATION_JSON_VALUE, requestBodyJson.getBytes()
        );

        String errorMessage = ExceptionService.INVALID_POST_CREATOR;

        // Given
        // allow matching a null 'imageList' part (any() will match null or non-null)
        doThrow(new ExceptionService(errorMessage)).when(forumService)
            .updatePostOrComment(anyInt(), anyInt(), anyString(), anyString(), anyList(), any(), anyInt());

        // When & Then
        // Use multipart with PUT method since the endpoint expects multipart/form-data
        mockMvc.perform(multipart("/api/Forum/updatePostOrComment")
                        .file(requestBodyPart) // Send only the JSON body part
                        .with(request -> { // Set the HTTP method to PUT for multipart request
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(errorMessage)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));

        // Verify
        // Verify with isNull() for the file list as no image file was sent in this test case
        verify(forumService).updatePostOrComment(
            eq(postIdToUpdate),
            eq(userId),
            anyString(),
            anyString(),
            anyList(),
            isNull(), // Expecting null because no 'imageList' part was sent
            anyInt()
        );
    }

    @Test
    void searchUser_Success() throws Exception {
        String query = "test";
        List<UserInfoDTO> userList = Arrays.asList(sampleUser);

        // Given - Updated to match service signature (Integer, String, List<Integer>, Integer)
        given(forumService.searchUser(userId, query, excludingUserIdList, searchNum)).willReturn(userList);

        // When & Then - Updated to include all required request parameters
        mockMvc.perform(get("/api/Forum/searchUser")
                        .param("userId", userId.toString())
                        .param("keyword", query) // Changed param name to 'keyword'
                        .param("excludingUserIdList", excludingUserIdList.get(0).toString(), excludingUserIdList.get(1).toString())
                        .param("searchNum", searchNum.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The search result is returned"))) // Updated message
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.userList", hasSize(1)))
                .andExpect(jsonPath("$.data.userList[0].userId", is(sampleUser.getUserId())))
                .andExpect(jsonPath("$.data.userList[0].username", is(sampleUser.getUsername())));

        // Verify - Updated to match service signature
        verify(forumService).searchUser(userId, query, excludingUserIdList, searchNum);
    }

    @Test
    void searchUser_GenericException() throws Exception {
        String query = "error";
        String genericErrorMessage = "Search service unavailable";

        // Given - Updated to match service signature (Integer, String, List<Integer>, Integer)
        given(forumService.searchUser(userId, query, excludingUserIdList, searchNum)).willThrow(new RuntimeException(genericErrorMessage));

        // When & Then - Updated to include all required request parameters
        mockMvc.perform(get("/api/Forum/searchUser")
                        .param("userId", userId.toString())
                        .param("keyword", query) // Changed param name to 'keyword'
                        .param("excludingUserIdList", excludingUserIdList.get(0).toString(), excludingUserIdList.get(1).toString())
                        .param("searchNum", searchNum.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("Fail: java.lang.RuntimeException: " + genericErrorMessage)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        // Verify - Updated to match service signature
        verify(forumService).searchUser(userId, query, excludingUserIdList, searchNum);
    }

    @Test
    void searchPost_Success() throws Exception {
        String query = "sample";
        List<PostDTO> searchResult = Arrays.asList(samplePost);
        // searchNum is already defined in setUp

        // Given - Matches the service signature
        given(forumService.searchPost(userId, query, excludingPostIdList, searchNum)).willReturn(searchResult);

        // When & Then - Updated to include all required request parameters
        mockMvc.perform(get("/api/Forum/searchPost")
                        .param("userId", userId.toString())
                        .param("keyword", query) // Changed param name to 'keyword' to match controller
                        .param("excludingPostIdList", excludingPostIdList.get(0).toString(), excludingPostIdList.get(1).toString())
                        .param("searchNum", searchNum.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The search result is returned"))) // Updated message to match controller
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.postPreviewList", hasSize(1))) // Updated data field name
                .andExpect(jsonPath("$.data.postPreviewList[0].postId", is(samplePost.getPostId())))
                .andExpect(jsonPath("$.data.postPreviewList[0].title", is(samplePost.getTitle())));

        // Verify - Matches the service signature
        verify(forumService).searchPost(userId, query, excludingPostIdList, searchNum);
    }

    @Test
    void searchPost_ServiceException() throws Exception {
        String query = "invalid-search";
        String errorMessage = "Invalid search query format"; // Example custom error
        Integer searchNum = 10; // Added for the updated signature

        // Given - Matches the service signature
        given(forumService.searchPost(userId, query, excludingPostIdList, searchNum)).willThrow(new ExceptionService(errorMessage));

        // When & Then - Updated to include all required request parameters
        mockMvc.perform(get("/api/Forum/searchPost")
                        .param("userId", userId.toString())
                        .param("keyword", query) // Changed param name to 'keyword'
                        .param("excludingPostIdList", excludingPostIdList.get(0).toString(), excludingPostIdList.get(1).toString())
                        .param("searchNum", searchNum.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(errorMessage)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)))
                .andExpect(jsonPath("$.data.postPreviewList", is(nullValue()))); // Updated data field name

        // Verify - Matches the service signature
        verify(forumService).searchPost(userId, query, excludingPostIdList, searchNum);
    }

    @Test
    void getAllTag_Success() throws Exception {
        // Updated sample data to match service return type List<Map<String, Object>>
        List<Map<String, Object>> tags = new ArrayList<>();
        Map<String, Object> tag1 = new HashMap<>();
        tag1.put("tagId", 1); // Assuming IDs are integers
        tag1.put("tagName", "java");
        tags.add(tag1);
        Map<String, Object> tag2 = new HashMap<>();
        tag2.put("tagId", 2);
        tag2.put("tagName", "spring");
        tags.add(tag2);

        // Given
        given(forumService.getAllTag()).willReturn(tags);

        // When & Then
        mockMvc.perform(get("/api/Forum/getAllTag")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The tag list is returned"))) // Updated message
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.tagList", hasSize(tags.size())))
                // Check specific fields within the map objects in the list
                .andExpect(jsonPath("$.data.tagList[0].tagId", is(tags.get(0).get("tagId"))))
                .andExpect(jsonPath("$.data.tagList[0].tagName", is(tags.get(0).get("tagName"))))
                .andExpect(jsonPath("$.data.tagList[1].tagId", is(tags.get(1).get("tagId"))))
                .andExpect(jsonPath("$.data.tagList[1].tagName", is(tags.get(1).get("tagName"))));

        // Verify
        verify(forumService).getAllTag();
    }

    @Test
    void getAllTag_GenericException() throws Exception {
        String genericErrorMessage = "Failed to retrieve tags from database";

        // Given
        given(forumService.getAllTag()).willThrow(new RuntimeException(genericErrorMessage));

        // When & Then
        mockMvc.perform(get("/api/Forum/getAllTag")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("Fail: java.lang.RuntimeException: " + genericErrorMessage)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        // Verify
        verify(forumService).getAllTag();
    }
}