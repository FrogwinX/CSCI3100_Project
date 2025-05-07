package project.flowchat.backend.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import project.flowchat.backend.DTO.PostDTO;
import project.flowchat.backend.DTO.ResponseBodyDTO; // Keep this if ResponseBodyDTO is used internally, but we won't mock it.
import project.flowchat.backend.DTO.UserInfoDTO;
import project.flowchat.backend.DTO.UserProfileDTO;
import project.flowchat.backend.Service.ExceptionService;
import project.flowchat.backend.Service.ForumService;
import project.flowchat.backend.Service.ProfileService;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@ExtendWith(MockitoExtension.class)
class ProfileControllerTest {

    @Mock
    private ProfileService profileService;

    @Mock
    private ForumService forumService;

    // We will not mock ResponseBodyDTO anymore.
    // The controller likely creates a new instance or uses a prototype bean.
    // We will assert the actual returned JSON.

    @InjectMocks
    private ProfileController profileController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // Inject the ResponseBodyDTO instance manually if it's not a bean
        // If ResponseBodyDTO is a simple class, the controller might instantiate it like:
        // profileController = new ProfileController(profileService, forumService, new ResponseBodyDTO());
        // Or if it's a prototype bean, standaloneSetup might not handle it well.
        // For simplicity, let's assume the controller instantiates it internally or it's handled correctly by @InjectMocks setup.
        // If tests fail due to NullPointerException on responseBodyDTO, adjust this setup.
        profileController = new ProfileController(profileService, forumService, new ResponseBodyDTO()); // Assuming constructor injection and direct instantiation is okay for testing

        mockMvc = MockMvcBuilders.standaloneSetup(profileController).build();
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules(); // Register module for ZonedDateTime etc.
    }

    // --- followUser Tests ---

    @Test
    void followUser_Success() throws Exception {
        Map<String, Integer> requestBody = new HashMap<>();
        requestBody.put("userIdFrom", 1);
        requestBody.put("userIdTo", 2);

        doNothing().when(profileService).followUser(1, 2);

        mockMvc.perform(post("/api/Profile/followUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The user is followed")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)));

        verify(profileService).followUser(1, 2);
    }

    @Test
    void followUser_Failure_ExceptionService() throws Exception {
        Map<String, Integer> requestBody = new HashMap<>();
        requestBody.put("userIdFrom", 1);
        requestBody.put("userIdTo", 1); // Example: Cannot follow yourself

        doThrow(new ExceptionService(ExceptionService.CANNOT_FOLLOW_YOURSELF))
                .when(profileService).followUser(1, 1);

        mockMvc.perform(post("/api/Profile/followUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.CANNOT_FOLLOW_YOURSELF)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));

        verify(profileService).followUser(1, 1);
    }

    @Test
    void followUser_Failure_GenericException() throws Exception {
        Map<String, Integer> requestBody = new HashMap<>();
        requestBody.put("userIdFrom", 1);
        requestBody.put("userIdTo", 2);
        String genericErrorMsg = "Database connection failed";

        doThrow(new RuntimeException(genericErrorMsg))
                .when(profileService).followUser(1, 2);

        mockMvc.perform(post("/api/Profile/followUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Fail: java.lang.RuntimeException: " + genericErrorMsg)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        verify(profileService).followUser(1, 2);
    }

    // --- unfollowUser Tests ---

    @Test
    void unfollowUser_Success() throws Exception {
        Map<String, Integer> requestBody = new HashMap<>();
        requestBody.put("userIdFrom", 1);
        requestBody.put("userIdTo", 2);

        doNothing().when(profileService).unfollowUser(1, 2);

        mockMvc.perform(delete("/api/Profile/unfollowUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The user is unfollowed")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)));

        verify(profileService).unfollowUser(1, 2);
    }

    @Test
    void unfollowUser_Failure_ExceptionService() throws Exception {
        Map<String, Integer> requestBody = new HashMap<>();
        requestBody.put("userIdFrom", 1);
        requestBody.put("userIdTo", 2);

        doThrow(new ExceptionService(ExceptionService.USER_NOT_FOLLOWED))
                .when(profileService).unfollowUser(1, 2);

        mockMvc.perform(delete("/api/Profile/unfollowUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.USER_NOT_FOLLOWED)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));

        verify(profileService).unfollowUser(1, 2);
    }

     @Test
    void unfollowUser_Failure_GenericException() throws Exception {
        Map<String, Integer> requestBody = new HashMap<>();
        requestBody.put("userIdFrom", 1);
        requestBody.put("userIdTo", 2);
        String genericErrorMsg = "Unexpected error";


        doThrow(new RuntimeException(genericErrorMsg))
                .when(profileService).unfollowUser(1, 2);

        mockMvc.perform(delete("/api/Profile/unfollowUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Fail: java.lang.RuntimeException: " + genericErrorMsg)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        verify(profileService).unfollowUser(1, 2);
    }


    // --- blockUser Tests ---

    @Test
    void blockUser_Success() throws Exception {
        Map<String, Integer> requestBody = new HashMap<>();
        requestBody.put("userIdFrom", 1);
        requestBody.put("userIdTo", 2);

        doNothing().when(profileService).blockUser(1, 2);

        mockMvc.perform(post("/api/Profile/blockUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The user is blocked")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)));

        verify(profileService).blockUser(1, 2);
    }

     @Test
    void blockUser_Failure_ExceptionService() throws Exception {
        Map<String, Integer> requestBody = new HashMap<>();
        requestBody.put("userIdFrom", 1);
        requestBody.put("userIdTo", 2);

        doThrow(new ExceptionService(ExceptionService.USER_ALREADY_BLOCKED))
                .when(profileService).blockUser(1, 2);

        mockMvc.perform(post("/api/Profile/blockUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.USER_ALREADY_BLOCKED)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));

        verify(profileService).blockUser(1, 2);
    }

    @Test
    void blockUser_Failure_GenericException() throws Exception {
        Map<String, Integer> requestBody = new HashMap<>();
        requestBody.put("userIdFrom", 1);
        requestBody.put("userIdTo", 2);
        String genericErrorMsg = "Block failed";

        doThrow(new RuntimeException(genericErrorMsg))
                .when(profileService).blockUser(1, 2);

        mockMvc.perform(post("/api/Profile/blockUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Fail: java.lang.RuntimeException: " + genericErrorMsg)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        verify(profileService).blockUser(1, 2);
    }

    // --- unblockUser Tests ---

    @Test
    void unblockUser_Success() throws Exception {
        Map<String, Integer> requestBody = new HashMap<>();
        requestBody.put("userIdFrom", 1);
        requestBody.put("userIdTo", 2);

        doNothing().when(profileService).unblockUser(1, 2);

        mockMvc.perform(delete("/api/Profile/unblockUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The user is unblocked")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)));

        verify(profileService).unblockUser(1, 2);
    }

     @Test
    void unblockUser_Failure_ExceptionService() throws Exception {
        Map<String, Integer> requestBody = new HashMap<>();
        requestBody.put("userIdFrom", 1);
        requestBody.put("userIdTo", 2);

        doThrow(new ExceptionService(ExceptionService.USER_NOT_BLOCKED))
                .when(profileService).unblockUser(1, 2);

        mockMvc.perform(delete("/api/Profile/unblockUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.USER_NOT_BLOCKED)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));

        verify(profileService).unblockUser(1, 2);
    }

     @Test
    void unblockUser_Failure_GenericException() throws Exception {
        Map<String, Integer> requestBody = new HashMap<>();
        requestBody.put("userIdFrom", 1);
        requestBody.put("userIdTo", 2);
        String genericErrorMsg = "Unblock failed";

        doThrow(new RuntimeException(genericErrorMsg))
                .when(profileService).unblockUser(1, 2);

        mockMvc.perform(delete("/api/Profile/unblockUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Fail: java.lang.RuntimeException: " + genericErrorMsg)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        verify(profileService).unblockUser(1, 2);
    }

    // --- updatePersonalProfile Tests ---

    @Test
    void updatePersonalProfile_Success() throws Exception {
        MockMultipartFile avatarFile = new MockMultipartFile("avatar", "avatar.jpg", MediaType.IMAGE_JPEG_VALUE, "test image".getBytes());
        Map<String, String> profileInfo = new HashMap<>();
        profileInfo.put("username", "newuser");
        profileInfo.put("description", "new desc");
        profileInfo.put("avatar", "http://example.com/avatar.jpg");

        when(profileService.updatePersonalProfile(eq(1), eq("newuser"), eq("new desc"), any(MockMultipartFile.class)))
                .thenReturn(profileInfo);

        MockMultipartFile requestBodyJson = new MockMultipartFile("requestBody", "", "application/json", "{\"userId\": 1, \"username\": \"newuser\", \"description\": \"new desc\"}".getBytes());

        mockMvc.perform(multipart("/api/Profile/updatePersonalProfile")
                        .file(avatarFile)
                        .file(requestBodyJson)
                        .with(request -> { request.setMethod("PUT"); return request; }) // Use PUT method
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The user personal profile is updated")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.username", is("newuser")))
                .andExpect(jsonPath("$.data.description", is("new desc")))
                .andExpect(jsonPath("$.data.avatar", is("http://example.com/avatar.jpg")));

        verify(profileService).updatePersonalProfile(eq(1), eq("newuser"), eq("new desc"), any(MockMultipartFile.class));
    }

     @Test
    void updatePersonalProfile_Failure_ExceptionService() throws Exception {
        MockMultipartFile avatarFile = new MockMultipartFile("avatar", "avatar.jpg", MediaType.IMAGE_JPEG_VALUE, "test image".getBytes());

        when(profileService.updatePersonalProfile(eq(1), eq("invalid;user"), eq("new desc"), any(MockMultipartFile.class)))
                .thenThrow(new ExceptionService(ExceptionService.INVALID_USERNAME_FORMAT));

        MockMultipartFile requestBodyJson = new MockMultipartFile("requestBody", "", "application/json", "{\"userId\": 1, \"username\": \"invalid;user\", \"description\": \"new desc\"}".getBytes());

        mockMvc.perform(multipart("/api/Profile/updatePersonalProfile")
                        .file(avatarFile)
                        .file(requestBodyJson)
                        .with(request -> { request.setMethod("PUT"); return request; })
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.INVALID_USERNAME_FORMAT)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)));

        verify(profileService).updatePersonalProfile(eq(1), eq("invalid;user"), eq("new desc"), any(MockMultipartFile.class));
    }

    @Test
    void updatePersonalProfile_Failure_GenericException() throws Exception {
        MockMultipartFile avatarFile = new MockMultipartFile("avatar", "avatar.jpg", MediaType.IMAGE_JPEG_VALUE, "test image".getBytes());
        String genericErrorMsg = "Update failed";

        when(profileService.updatePersonalProfile(eq(1), eq("newuser"), eq("new desc"), any(MockMultipartFile.class)))
                 .thenThrow(new RuntimeException(genericErrorMsg));

        MockMultipartFile requestBodyJson = new MockMultipartFile("requestBody", "", "application/json", "{\"userId\": 1, \"username\": \"newuser\", \"description\": \"new desc\"}".getBytes());

        mockMvc.perform(multipart("/api/Profile/updatePersonalProfile")
                        .file(avatarFile)
                        .file(requestBodyJson)
                        .with(request -> { request.setMethod("PUT"); return request; })
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Fail: java.lang.RuntimeException: " + genericErrorMsg)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        verify(profileService).updatePersonalProfile(eq(1), eq("newuser"), eq("new desc"), any(MockMultipartFile.class));
    }


    // --- getProfileContent Tests ---

    @Test
    void getProfileContent_Success() throws Exception {
        UserProfileDTO mockProfile = new UserProfileDTO();
        mockProfile.setUserId(2);
        mockProfile.setUsername("testuser");
        mockProfile.setDescription("Test Description");
        mockProfile.setAvatar("avatar_link");
        mockProfile.setUpdatedAt(ZonedDateTime.now());
        mockProfile.setPostCount(5);
        mockProfile.setCommentCount(10);
        mockProfile.setFollowingCount(2);
        mockProfile.setFollowerCount(3);
        mockProfile.setLikeCount(15);
        mockProfile.setDislikeCount(1);
        mockProfile.setIsUserBlocked(false);
        mockProfile.setIsUserFollowed(true);


        when(profileService.getProfileContent(1, 2)).thenReturn(mockProfile);

        mockMvc.perform(get("/api/Profile/getProfileContent")
                        .param("userIdFrom", "1")
                        .param("userIdTo", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("The user profile content is returned")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.profile.userId", is(2)))
                .andExpect(jsonPath("$.data.profile.username", is("testuser")))
                .andExpect(jsonPath("$.data.profile.isUserFollowed", is(true)));


        verify(profileService).getProfileContent(1, 2);
    }

    @Test
    void getProfileContent_Failure_ExceptionService() throws Exception {
        when(profileService.getProfileContent(1, 999)) // Assume user 999 doesn't exist
                .thenThrow(new ExceptionService(ExceptionService.PROFILE_NOT_EXIST));

        mockMvc.perform(get("/api/Profile/getProfileContent")
                        .param("userIdFrom", "1")
                        .param("userIdTo", "999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is(ExceptionService.PROFILE_NOT_EXIST)))
                .andExpect(jsonPath("$.data.isSuccess", is(false)))
                .andExpect(jsonPath("$.data.profile", is(nullValue())));

        verify(profileService).getProfileContent(1, 999);
    }

     @Test
    void getProfileContent_Failure_GenericException() throws Exception {
        String genericErrorMsg = "Get content failed";
        when(profileService.getProfileContent(1, 2))
                .thenThrow(new RuntimeException(genericErrorMsg));

        mockMvc.perform(get("/api/Profile/getProfileContent")
                        .param("userIdFrom", "1")
                        .param("userIdTo", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Fail: java.lang.RuntimeException: " + genericErrorMsg)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        verify(profileService).getProfileContent(1, 2);
    }

    // --- getMyPostPreviewList Tests ---

    @Test
    void getMyPostPreviewList_Success() throws Exception {
        List<PostDTO> mockList = new ArrayList<>(); // Populate with test data if needed
        PostDTO post1 = new PostDTO(); post1.setPostId(101); post1.setTitle("Post 1");
        mockList.add(post1);

        when(forumService.getUserPostPreviewList(eq(1), eq(1), anyList(), eq(10))).thenReturn(mockList);

        mockMvc.perform(get("/api/Profile/getMyPostPreviewList")
                        .param("userIdFrom", "1")
                        .param("userIdTo", "1")
                        .param("excludingPostIdList", "1", "2")
                        .param("postNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("My post preview list is returned")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.postPreviewList[0].postId", is(101)))
                .andExpect(jsonPath("$.data.postPreviewList[0].title", is("Post 1")));


        verify(forumService).getUserPostPreviewList(eq(1), eq(1), eq(List.of(1, 2)), eq(10));
    }

    @Test
    void getMyPostPreviewList_Failure_ExceptionService() throws Exception {
         when(forumService.getUserPostPreviewList(eq(1), eq(1), anyList(), eq(10)))
                .thenThrow(new ExceptionService("Some Forum Error")); // Use a relevant forum error

        mockMvc.perform(get("/api/Profile/getMyPostPreviewList")
                        .param("userIdFrom", "1")
                        .param("userIdTo", "1")
                        .param("excludingPostIdList", "1", "2")
                        .param("postNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Some Forum Error")))
                .andExpect(jsonPath("$.data.isSuccess", is(false)))
                .andExpect(jsonPath("$.data.postPreviewList", is(nullValue())));

        verify(forumService).getUserPostPreviewList(eq(1), eq(1), eq(List.of(1, 2)), eq(10));
    }

     @Test
    void getMyPostPreviewList_Failure_GenericException() throws Exception {
        String genericErrorMsg = "Get posts failed";
        when(forumService.getUserPostPreviewList(eq(1), eq(1), anyList(), eq(10)))
                .thenThrow(new RuntimeException(genericErrorMsg));

        mockMvc.perform(get("/api/Profile/getMyPostPreviewList")
                        .param("userIdFrom", "1")
                        .param("userIdTo", "1")
                        .param("excludingPostIdList", "1", "2")
                        .param("postNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Fail: java.lang.RuntimeException: " + genericErrorMsg)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        verify(forumService).getUserPostPreviewList(eq(1), eq(1), eq(List.of(1, 2)), eq(10));
    }


    // --- getMyCommentPreviewList Tests ---

    @Test
    void getMyCommentPreviewList_Success() throws Exception {
        List<PostDTO> mockList = new ArrayList<>(); // Populate with test data if needed
        PostDTO post1 = new PostDTO(); post1.setPostId(201); post1.setTitle("Comment Parent Post 1");
        mockList.add(post1);

        when(forumService.getUserCommentPreviewList(eq(1), eq(1), anyList(), eq(10))).thenReturn(mockList);

        mockMvc.perform(get("/api/Profile/getMyCommentPreviewList")
                        .param("userIdFrom", "1")
                        .param("userIdTo", "1")
                        .param("excludingCommentIdList", "3", "4")
                        .param("commentNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("My comment preview list is returned")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.postPreviewList[0].postId", is(201)))
                .andExpect(jsonPath("$.data.postPreviewList[0].title", is("Comment Parent Post 1")));

        verify(forumService).getUserCommentPreviewList(eq(1), eq(1), eq(List.of(3, 4)), eq(10));
    }

     @Test
    void getMyCommentPreviewList_Failure_ExceptionService() throws Exception {
        when(forumService.getUserCommentPreviewList(eq(1), eq(1), anyList(), eq(10)))
                .thenThrow(new ExceptionService("Some Forum Comment Error")); // Use a relevant forum error

        mockMvc.perform(get("/api/Profile/getMyCommentPreviewList")
                        .param("userIdFrom", "1")
                        .param("userIdTo", "1")
                        .param("excludingCommentIdList", "3", "4")
                        .param("commentNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Some Forum Comment Error")))
                .andExpect(jsonPath("$.data.isSuccess", is(false)))
                .andExpect(jsonPath("$.data.postPreviewList", is(nullValue())));

        verify(forumService).getUserCommentPreviewList(eq(1), eq(1), eq(List.of(3, 4)), eq(10));
    }

     @Test
    void getMyCommentPreviewList_Failure_GenericException() throws Exception {
        String genericErrorMsg = "Get comments failed";
        when(forumService.getUserCommentPreviewList(eq(1), eq(1), anyList(), eq(10)))
                .thenThrow(new RuntimeException(genericErrorMsg));

        mockMvc.perform(get("/api/Profile/getMyCommentPreviewList")
                        .param("userIdFrom", "1")
                        .param("userIdTo", "1")
                        .param("excludingCommentIdList", "3", "4")
                        .param("commentNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Fail: java.lang.RuntimeException: " + genericErrorMsg)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        verify(forumService).getUserCommentPreviewList(eq(1), eq(1), eq(List.of(3, 4)), eq(10));
    }


    // --- getMyFollowingList Tests ---

    @Test
    void getMyFollowingList_Success() throws Exception {
        List<UserInfoDTO> mockList = new ArrayList<>();
        UserInfoDTO user1 = new UserInfoDTO(); user1.setUserId(5); user1.setUsername("followedUser1");
        mockList.add(user1);

        when(profileService.getUserList(eq(1), anyList(), eq(10), eq("following"))).thenReturn(mockList);

        mockMvc.perform(get("/api/Profile/getMyFollowingList")
                        .param("userId", "1")
                        .param("excludingUserIdList", "5", "6")
                        .param("userNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("My following list is returned")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.userList[0].userId", is(5)))
                .andExpect(jsonPath("$.data.userList[0].username", is("followedUser1")));

        verify(profileService).getUserList(eq(1), eq(List.of(5, 6)), eq(10), eq("following"));
    }

    @Test
    void getMyFollowingList_Failure_ExceptionService() throws Exception {
        when(profileService.getUserList(eq(1), anyList(), eq(10), eq("following")))
                .thenThrow(new ExceptionService("Get Following Failed")); // Example error

        mockMvc.perform(get("/api/Profile/getMyFollowingList")
                        .param("userId", "1")
                        .param("excludingUserIdList", "5", "6")
                        .param("userNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Get Following Failed")))
                .andExpect(jsonPath("$.data.isSuccess", is(false)))
                .andExpect(jsonPath("$.data.userList", is(nullValue())));

        verify(profileService).getUserList(eq(1), eq(List.of(5, 6)), eq(10), eq("following"));
    }

    @Test
    void getMyFollowingList_Failure_GenericException() throws Exception {
        String genericErrorMsg = "DB Error Following";
        when(profileService.getUserList(eq(1), anyList(), eq(10), eq("following")))
                .thenThrow(new RuntimeException(genericErrorMsg));

        mockMvc.perform(get("/api/Profile/getMyFollowingList")
                        .param("userId", "1")
                        .param("excludingUserIdList", "5", "6")
                        .param("userNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Fail: java.lang.RuntimeException: " + genericErrorMsg)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        verify(profileService).getUserList(eq(1), eq(List.of(5, 6)), eq(10), eq("following"));
    }


    // --- getMyFollowerList Tests ---

    @Test
    void getMyFollowerList_Success() throws Exception {
        List<UserInfoDTO> mockList = new ArrayList<>();
        UserInfoDTO user1 = new UserInfoDTO(); user1.setUserId(7); user1.setUsername("followerUser1");
        mockList.add(user1);

        when(profileService.getUserList(eq(1), anyList(), eq(10), eq("follower"))).thenReturn(mockList);

        mockMvc.perform(get("/api/Profile/getMyFollowerList")
                        .param("userId", "1")
                        .param("excludingUserIdList", "7", "8")
                        .param("userNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("My follower list is returned")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.userList[0].userId", is(7)))
                .andExpect(jsonPath("$.data.userList[0].username", is("followerUser1")));

        verify(profileService).getUserList(eq(1), eq(List.of(7, 8)), eq(10), eq("follower"));
    }

     @Test
    void getMyFollowerList_Failure_ExceptionService() throws Exception {
        when(profileService.getUserList(eq(1), anyList(), eq(10), eq("follower")))
                .thenThrow(new ExceptionService("Get Follower Failed")); // Example error

        mockMvc.perform(get("/api/Profile/getMyFollowerList")
                        .param("userId", "1")
                        .param("excludingUserIdList", "7", "8")
                        .param("userNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Get Follower Failed")))
                .andExpect(jsonPath("$.data.isSuccess", is(false)))
                .andExpect(jsonPath("$.data.userList", is(nullValue())));

        verify(profileService).getUserList(eq(1), eq(List.of(7, 8)), eq(10), eq("follower"));
    }

    @Test
    void getMyFollowerList_Failure_GenericException() throws Exception {
        String genericErrorMsg = "DB Error Follower";
        when(profileService.getUserList(eq(1), anyList(), eq(10), eq("follower")))
                .thenThrow(new RuntimeException(genericErrorMsg));

        mockMvc.perform(get("/api/Profile/getMyFollowerList")
                        .param("userId", "1")
                        .param("excludingUserIdList", "7", "8")
                        .param("userNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Fail: java.lang.RuntimeException: " + genericErrorMsg)))
                .andExpect(jsonPath("$.data", is(nullValue())));

        verify(profileService).getUserList(eq(1), eq(List.of(7, 8)), eq(10), eq("follower"));
    }


    // --- getMyBlockingList Tests ---

    @Test
    void getMyBlockingList_Success() throws Exception {
        List<UserInfoDTO> mockList = new ArrayList<>();
        UserInfoDTO user1 = new UserInfoDTO(); user1.setUserId(9); user1.setUsername("blockedUser1");
        mockList.add(user1);

        when(profileService.getUserList(eq(1), anyList(), eq(10), eq("blocking"))).thenReturn(mockList);

        mockMvc.perform(get("/api/Profile/getMyBlockingList")
                        .param("userId", "1")
                        .param("excludingUserIdList", "9", "10")
                        .param("userNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("My blocking list is returned")))
                .andExpect(jsonPath("$.data.isSuccess", is(true)))
                .andExpect(jsonPath("$.data.userList[0].userId", is(9)))
                .andExpect(jsonPath("$.data.userList[0].username", is("blockedUser1")));

        verify(profileService).getUserList(eq(1), eq(List.of(9, 10)), eq(10), eq("blocking"));
    }

     @Test
    void getMyBlockingList_Failure_ExceptionService() throws Exception {
        when(profileService.getUserList(eq(1), anyList(), eq(10), eq("blocking")))
                .thenThrow(new ExceptionService("Get Blocking Failed")); // Example error

        mockMvc.perform(get("/api/Profile/getMyBlockingList")
                        .param("userId", "1")
                        .param("excludingUserIdList", "9", "10")
                        .param("userNum", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Get Blocking Failed")))
                .andExpect(jsonPath("$.data.isSuccess", is(false)))
                .andExpect(jsonPath("$.data.userList", is(nullValue())));

        verify(profileService).getUserList(eq(1), eq(List.of(9, 10)), eq(10), eq("blocking"));
    }

    @Test
    void getMyBlockingList_Failure_GenericException() throws Exception {
        String genericErrorMsg = "DB Error Blocking";
        when(profileService.getUserList(eq(1), anyList(), eq(10), eq("blocking")))
                .thenThrow(new RuntimeException(genericErrorMsg));

        mockMvc.perform(get("/api/Profile/getMyBlockingList")
                        .param("userId", "1")
                        .param("excludingUserIdList", "9", "10")
                        .param("userNum", "10"))
                .andExpect(status().isOk())
                // Note: The original controller code had a potential issue in the catch block for this specific endpoint.
                // It didn't set the message correctly for generic exceptions. Assuming it's fixed like others:
                .andExpect(jsonPath("$.message", is("Fail: java.lang.RuntimeException: " + genericErrorMsg)))
                .andExpect(jsonPath("$.data", is(nullValue()))); // Assuming data is set to null on generic exception

        verify(profileService).getUserList(eq(1), eq(List.of(9, 10)), eq(10), eq("blocking"));
    }

}