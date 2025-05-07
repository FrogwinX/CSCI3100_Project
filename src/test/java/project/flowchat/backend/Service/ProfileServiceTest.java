package project.flowchat.backend.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;
import project.flowchat.backend.DTO.UserInfoDTO;
import project.flowchat.backend.DTO.UserProfileDTO;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Model.UserProfileModel;
import project.flowchat.backend.Repository.ForumRepository;
import project.flowchat.backend.Repository.ImageRepository;
import project.flowchat.backend.Repository.UserAccountRepository;
import project.flowchat.backend.Repository.UserProfileRepository;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;
    @Mock
    private UserAccountRepository userAccountRepository;
    @Mock
    private ImageRepository imageRepository;
    @Mock
    private ForumRepository forumRepository;
    @Mock
    private SecurityService securityService;
    @Mock
    private ImageService imageService;

    @InjectMocks
    private ProfileService profileService;

    private Integer userId1;
    private Integer userId2;
    private UserProfileModel userProfile1;
    private UserAccountModel userAccount1;

    @BeforeEach
    void setUp() {
        userId1 = 1;
        userId2 = 2;
        userProfile1 = new UserProfileModel();
        userProfile1.setUserId(userId1);
        userProfile1.setUsername("testuser1");
        userProfile1.setDescription("Test description");
        userProfile1.setAvatarId(10);
        userProfile1.setUpdatedAt(ZonedDateTime.now());

        userAccount1 = new UserAccountModel();
        userAccount1.setUserId(userId1);
        userAccount1.setUsername("testuser1");
        userAccount1.setIsActive(true);
    }

    @Test
    void getUserAvatarByUserId_Exists() {
        Integer avatarId = 10;
        String expectedApiLink = "/api/images/10";
        when(userProfileRepository.findAvatarIdByUserId(userId1)).thenReturn(avatarId);
        when(imageService.getImageAPI(avatarId)).thenReturn(expectedApiLink);

        String actualApiLink = profileService.getUserAvatarByUserId(userId1);

        assertEquals(expectedApiLink, actualApiLink);
        verify(userProfileRepository).findAvatarIdByUserId(userId1);
        verify(imageService).getImageAPI(avatarId);
    }

    @Test
    void getUserAvatarByUserId_NotExists() {
        when(userProfileRepository.findAvatarIdByUserId(userId1)).thenReturn(null);

        String actualApiLink = profileService.getUserAvatarByUserId(userId1);

        assertNull(actualApiLink);
        verify(userProfileRepository).findAvatarIdByUserId(userId1);
        verify(imageService, never()).getImageAPI(anyInt());
    }

    @Test
    void isUserFollowing_True() {
        when(userProfileRepository.checkIfUserFollowed(userId1, userId2)).thenReturn(1); // Return non-null

        Boolean result = profileService.isUserFollowing(userId1, userId2);

        assertTrue(result);
        verify(userProfileRepository).checkIfUserFollowed(userId1, userId2);
    }

    @Test
    void isUserFollowing_False() {
        when(userProfileRepository.checkIfUserFollowed(userId1, userId2)).thenReturn(null);

        Boolean result = profileService.isUserFollowing(userId1, userId2);

        assertFalse(result);
        verify(userProfileRepository).checkIfUserFollowed(userId1, userId2);
    }

    @Test
    void isUserBlocking_True() {
        when(userProfileRepository.checkIfUserBlocked(userId1, userId2)).thenReturn(1); // Return non-null

        Boolean result = profileService.isUserBlocking(userId1, userId2);

        assertTrue(result);
        verify(userProfileRepository).checkIfUserBlocked(userId1, userId2);
    }

    @Test
    void isUserBlocking_False() {
        when(userProfileRepository.checkIfUserBlocked(userId1, userId2)).thenReturn(null);

        Boolean result = profileService.isUserBlocking(userId1, userId2);

        assertFalse(result);
        verify(userProfileRepository).checkIfUserBlocked(userId1, userId2);
    }

    @Test
    void isUsernameUnique_True() throws Exception {
        String uniqueUsername = "uniqueUser";
        when(userAccountRepository.countAllUsersByUsername(uniqueUsername)).thenReturn(0);

        Boolean result = profileService.isUsernameUnique(uniqueUsername);

        assertTrue(result);
        verify(userAccountRepository).countAllUsersByUsername(uniqueUsername);
    }

    @Test
    void isUsernameUnique_False() {
        String existingUsername = "existingUser";
        when(userAccountRepository.countAllUsersByUsername(existingUsername)).thenReturn(1);

        Exception exception = assertThrows(Exception.class, () -> {
            profileService.isUsernameUnique(existingUsername);
        });

        assertEquals(ExceptionService.USERNAME_NOT_UNIQUE, exception.getMessage());
        verify(userAccountRepository).countAllUsersByUsername(existingUsername);
    }

    @Test
    void isUsernameUnique_InvalidFormat_Semicolon() {
        String invalidUsername = "user;name";

        Exception exception = assertThrows(Exception.class, () -> {
            profileService.isUsernameUnique(invalidUsername);
        });

        assertEquals(ExceptionService.INVALID_USERNAME_FORMAT, exception.getMessage());
        verify(userAccountRepository, never()).countAllUsersByUsername(anyString());
    }

     @Test
    void isUsernameUnique_InvalidFormat_AtSymbol() {
        String invalidUsername = "user@name";

        Exception exception = assertThrows(Exception.class, () -> {
            profileService.isUsernameUnique(invalidUsername);
        });

        assertEquals(ExceptionService.INVALID_USERNAME_FORMAT, exception.getMessage());
        verify(userAccountRepository, never()).countAllUsersByUsername(anyString());
    }

    @Test
    void isUsernameUnique_InvalidFormat_Null() {
        String invalidUsername = null;

        Exception exception = assertThrows(Exception.class, () -> {
            profileService.isUsernameUnique(invalidUsername);
        });

        assertEquals(ExceptionService.INVALID_USERNAME_FORMAT, exception.getMessage());
        verify(userAccountRepository, never()).countAllUsersByUsername(anyString());
    }

     @Test
    void isUsernameUnique_InvalidFormat_Empty() {
        String invalidUsername = "";

        Exception exception = assertThrows(Exception.class, () -> {
            profileService.isUsernameUnique(invalidUsername);
        });

        assertEquals(ExceptionService.INVALID_USERNAME_FORMAT, exception.getMessage());
        verify(userAccountRepository, never()).countAllUsersByUsername(anyString());
    }


    @Test
    void followUser_Success() throws Exception {
        when(userAccountRepository.findIfUserActive(userId2)).thenReturn(true);
        when(userProfileRepository.checkIfUserFollowed(userId1, userId2)).thenReturn(null); // Not following yet

        profileService.followUser(userId1, userId2);

        verify(securityService).checkUserIdWithToken(userId1);
        verify(userAccountRepository).findIfUserActive(userId2);
        verify(userProfileRepository).checkIfUserFollowed(userId1, userId2);
        verify(userProfileRepository).followUser(userId1, userId2);
    }

    @Test
    void followUser_CannotFollowSelf() throws Exception {
        Exception exception = assertThrows(Exception.class, () -> {
            profileService.followUser(userId1, userId1);
        });

        assertEquals(ExceptionService.CANNOT_FOLLOW_YOURSELF, exception.getMessage());
        verify(securityService).checkUserIdWithToken(userId1);
        verify(userAccountRepository, never()).findIfUserActive(anyInt());
        verify(userProfileRepository, never()).checkIfUserFollowed(anyInt(), anyInt());
        verify(userProfileRepository, never()).followUser(anyInt(), anyInt());
    }

    @Test
    void followUser_UserDeleted() throws Exception {
        when(userAccountRepository.findIfUserActive(userId2)).thenReturn(false);

        Exception exception = assertThrows(Exception.class, () -> {
            profileService.followUser(userId1, userId2);
        });

        assertEquals(ExceptionService.USER_DELETED, exception.getMessage());
        verify(securityService).checkUserIdWithToken(userId1);
        verify(userAccountRepository).findIfUserActive(userId2);
        verify(userProfileRepository, never()).checkIfUserFollowed(anyInt(), anyInt());
        verify(userProfileRepository, never()).followUser(anyInt(), anyInt());
    }

    @Test
    void followUser_AlreadyFollowed() throws Exception {
        when(userAccountRepository.findIfUserActive(userId2)).thenReturn(true);
        when(userProfileRepository.checkIfUserFollowed(userId1, userId2)).thenReturn(1); // Already following

        Exception exception = assertThrows(Exception.class, () -> {
            profileService.followUser(userId1, userId2);
        });

        assertEquals(ExceptionService.USER_ALREADY_FOLLOWED, exception.getMessage());
        verify(securityService).checkUserIdWithToken(userId1);
        verify(userAccountRepository).findIfUserActive(userId2);
        verify(userProfileRepository).checkIfUserFollowed(userId1, userId2);
        verify(userProfileRepository, never()).followUser(anyInt(), anyInt());
    }

    @Test
    void unfollowUser_Success() throws Exception {
        when(userProfileRepository.checkIfUserFollowed(userId1, userId2)).thenReturn(1); // Is following

        profileService.unfollowUser(userId1, userId2);

        verify(securityService).checkUserIdWithToken(userId1);
        verify(userProfileRepository).checkIfUserFollowed(userId1, userId2);
        verify(userProfileRepository).unfollowUser(userId1, userId2);
    }

    @Test
    void unfollowUser_NotFollowed() throws Exception {
        when(userProfileRepository.checkIfUserFollowed(userId1, userId2)).thenReturn(null); // Not following

        Exception exception = assertThrows(Exception.class, () -> {
            profileService.unfollowUser(userId1, userId2);
        });

        assertEquals(ExceptionService.USER_NOT_FOLLOWED, exception.getMessage());
        verify(securityService).checkUserIdWithToken(userId1);
        verify(userProfileRepository).checkIfUserFollowed(userId1, userId2);
        verify(userProfileRepository, never()).unfollowUser(anyInt(), anyInt());
    }


    @Test
    void blockUser_Success() throws Exception {
        when(userAccountRepository.findIfUserActive(userId2)).thenReturn(true);
        when(userProfileRepository.checkIfUserBlocked(userId1, userId2)).thenReturn(null); // Not blocking yet

        profileService.blockUser(userId1, userId2);

        verify(securityService).checkUserIdWithToken(userId1);
        verify(userAccountRepository).findIfUserActive(userId2);
        verify(userProfileRepository).checkIfUserBlocked(userId1, userId2);
        verify(userProfileRepository).blockUser(userId1, userId2);
    }

     @Test
    void blockUser_CannotBlockSelf() throws Exception {
        Exception exception = assertThrows(Exception.class, () -> {
            profileService.blockUser(userId1, userId1);
        });

        assertEquals(ExceptionService.CANNOT_BLOCK_YOURSELF, exception.getMessage());
        verify(securityService).checkUserIdWithToken(userId1);
        verify(userAccountRepository, never()).findIfUserActive(anyInt());
        verify(userProfileRepository, never()).checkIfUserBlocked(anyInt(), anyInt());
        verify(userProfileRepository, never()).blockUser(anyInt(), anyInt());
    }

    @Test
    void blockUser_UserDeleted() throws Exception {
        when(userAccountRepository.findIfUserActive(userId2)).thenReturn(false);

        Exception exception = assertThrows(Exception.class, () -> {
            profileService.blockUser(userId1, userId2);
        });

        assertEquals(ExceptionService.USER_DELETED, exception.getMessage());
        verify(securityService).checkUserIdWithToken(userId1);
        verify(userAccountRepository).findIfUserActive(userId2);
        verify(userProfileRepository, never()).checkIfUserBlocked(anyInt(), anyInt());
        verify(userProfileRepository, never()).blockUser(anyInt(), anyInt());
    }

     @Test
    void blockUser_AlreadyBlocked() throws Exception {
        when(userAccountRepository.findIfUserActive(userId2)).thenReturn(true);
        when(userProfileRepository.checkIfUserBlocked(userId1, userId2)).thenReturn(1); // Already blocking

        Exception exception = assertThrows(Exception.class, () -> {
            profileService.blockUser(userId1, userId2);
        });

        assertEquals(ExceptionService.USER_ALREADY_BLOCKED, exception.getMessage());
        verify(securityService).checkUserIdWithToken(userId1);
        verify(userAccountRepository).findIfUserActive(userId2);
        verify(userProfileRepository).checkIfUserBlocked(userId1, userId2);
        verify(userProfileRepository, never()).blockUser(anyInt(), anyInt());
    }


    @Test
    void unblockUser_Success() throws Exception {
        when(userProfileRepository.checkIfUserBlocked(userId1, userId2)).thenReturn(1); // Is blocking

        profileService.unblockUser(userId1, userId2);

        verify(securityService).checkUserIdWithToken(userId1);
        verify(userProfileRepository).checkIfUserBlocked(userId1, userId2);
        verify(userProfileRepository).unblockUser(userId1, userId2);
    }

    @Test
    void unblockUser_NotBlocked() throws Exception {
        when(userProfileRepository.checkIfUserBlocked(userId1, userId2)).thenReturn(null); // Not blocking

        Exception exception = assertThrows(Exception.class, () -> {
            profileService.unblockUser(userId1, userId2);
        });

        assertEquals(ExceptionService.USER_NOT_BLOCKED, exception.getMessage());
        verify(securityService).checkUserIdWithToken(userId1);
        verify(userProfileRepository).checkIfUserBlocked(userId1, userId2);
        verify(userProfileRepository, never()).unblockUser(anyInt(), anyInt());
    }

    @Test
    void addNewUserProfile() {
        String username = "newUser";
        profileService.addNewUserProfile(userId1, username);

        // Capture the argument passed to save
        ArgumentCaptor<UserProfileModel> argumentCaptor = ArgumentCaptor.forClass(UserProfileModel.class);
        verify(userProfileRepository).save(argumentCaptor.capture());

        UserProfileModel savedProfile = argumentCaptor.getValue();
        assertEquals(userId1, savedProfile.getUserId());
        assertEquals(username, savedProfile.getUsername());
        assertEquals("", savedProfile.getDescription());
        assertNull(savedProfile.getAvatarId());
        assertNotNull(savedProfile.getUpdatedAt());
    }

    // --- Tests for updatePersonalProfile ---
    // (Requires mocking MultipartFile, more complex setup)
    @Test
    void updatePersonalProfile_UpdateAll() throws Exception {
        String newUsername = "updatedUser";
        String newDescription = "Updated description";
        MultipartFile mockAvatar = mock(MultipartFile.class);
        Integer oldAvatarId = 10;
        Integer newAvatarId = 20;
        String newAvatarApi = "/api/images/20";

        userProfile1.setAvatarId(oldAvatarId); // Set initial avatar

        when(userProfileRepository.findById(userId1)).thenReturn(Optional.of(userProfile1));
        when(userAccountRepository.findById(userId1)).thenReturn(Optional.of(userAccount1));
        when(userAccountRepository.countAllUsersByUsername(newUsername)).thenReturn(0); // Username is unique
        when(mockAvatar.isEmpty()).thenReturn(false); // New avatar provided
        when(imageService.saveImage(mockAvatar)).thenReturn(newAvatarId);
        when(imageService.getImageAPI(newAvatarId)).thenReturn(newAvatarApi);

        Map<String, String> result = profileService.updatePersonalProfile(userId1, newUsername, newDescription, mockAvatar);

        verify(securityService).checkUserIdWithToken(userId1);
        verify(userProfileRepository).findById(userId1);
        verify(userAccountRepository).findById(userId1);
        verify(userAccountRepository).countAllUsersByUsername(newUsername);
        verify(userAccountRepository).save(any(UserAccountModel.class)); // Verify account saved
        verify(imageRepository).deleteById(oldAvatarId); // Verify old avatar deleted
        verify(imageService).checkIsImage(mockAvatar);
        verify(imageService).saveImage(mockAvatar);
        verify(userProfileRepository).save(any(UserProfileModel.class)); // Verify profile saved
        verify(imageService).getImageAPI(newAvatarId);

        assertEquals(newUsername, result.get("username"));
        assertEquals(newDescription, result.get("description"));
        assertEquals(newAvatarApi, result.get("avatar"));

        // Also check if the models were updated correctly before save (using captors if needed)
        assertEquals(newUsername, userProfile1.getUsername());
        assertEquals(newDescription, userProfile1.getDescription());
        assertEquals(newAvatarId, userProfile1.getAvatarId());
        assertEquals(newUsername, userAccount1.getUsername());
    }

     @Test
    void updatePersonalProfile_RemoveAvatar() throws Exception {
        MultipartFile mockEmptyAvatar = mock(MultipartFile.class);
        Integer oldAvatarId = 10;

        userProfile1.setAvatarId(oldAvatarId); // Set initial avatar

        when(userProfileRepository.findById(userId1)).thenReturn(Optional.of(userProfile1));
        when(mockEmptyAvatar.isEmpty()).thenReturn(true); // Empty avatar means remove
        when(imageService.getImageAPI(null)).thenReturn(null); // Expect null API link

        // Update only avatar (remove it)
        Map<String, String> result = profileService.updatePersonalProfile(userId1, null, null, mockEmptyAvatar);

        verify(securityService).checkUserIdWithToken(userId1);
        verify(userProfileRepository).findById(userId1);
        verify(userAccountRepository, never()).findById(anyInt()); // Username not updated
        verify(userAccountRepository, never()).countAllUsersByUsername(anyString());
        verify(userAccountRepository, never()).save(any(UserAccountModel.class));
        verify(imageRepository).deleteById(oldAvatarId); // Verify old avatar deleted
        verify(imageService, never()).checkIsImage(any());
        verify(imageService, never()).saveImage(any());
        verify(userProfileRepository).save(any(UserProfileModel.class)); // Verify profile saved
        verify(imageService).getImageAPI(null); // Verify API requested for null ID

        assertEquals(userProfile1.getUsername(), result.get("username")); // Unchanged
        assertEquals(userProfile1.getDescription(), result.get("description")); // Unchanged
        assertNull(result.get("avatar")); // Avatar should be null

        assertNull(userProfile1.getAvatarId()); // Check model state
    }

    @Test
    void updatePersonalProfile_UsernameNotUnique() throws Exception {
        String nonUniqueUsername = "existingUser";
        when(userProfileRepository.findById(userId1)).thenReturn(Optional.of(userProfile1));
        when(userAccountRepository.countAllUsersByUsername(nonUniqueUsername)).thenReturn(1); // Username exists

        Exception exception = assertThrows(Exception.class, () -> {
             profileService.updatePersonalProfile(userId1, nonUniqueUsername, null, null);
        });

        assertEquals(ExceptionService.USERNAME_NOT_UNIQUE, exception.getMessage());

        verify(securityService).checkUserIdWithToken(userId1);
        verify(userProfileRepository).findById(userId1);
        verify(userAccountRepository).countAllUsersByUsername(nonUniqueUsername);
        verify(userAccountRepository, never()).findById(anyInt());
        verify(userAccountRepository, never()).save(any(UserAccountModel.class));
        verify(imageRepository, never()).deleteById(anyInt());
        verify(imageService, never()).saveImage(any());
        verify(userProfileRepository, never()).save(any(UserProfileModel.class));
    }


    // --- Tests for getProfileContent ---
    @Test
    void getProfileContent_Success() throws Exception {
        Integer userIdFrom = 1;
        Integer userIdTo = 2;
        UserProfileModel targetProfile = new UserProfileModel();
        targetProfile.setUserId(userIdTo);
        targetProfile.setUsername("targetUser");
        targetProfile.setDescription("Target Desc");
        targetProfile.setAvatarId(15);
        targetProfile.setUpdatedAt(ZonedDateTime.now());
        String avatarApi = "/api/images/15";

        when(userProfileRepository.findProfileByUserId(userIdTo)).thenReturn(targetProfile);
        // *** Explicitly stub the call inside getUserAvatarByUserId ***
        when(userProfileRepository.findAvatarIdByUserId(userIdTo)).thenReturn(targetProfile.getAvatarId());
        when(imageService.getImageAPI(targetProfile.getAvatarId())).thenReturn(avatarApi);
        when(forumRepository.countPostByUserId(userIdTo)).thenReturn(5); 
        when(forumRepository.countCommentByUserId(userIdTo)).thenReturn(10); 
        when(userProfileRepository.countFollowingByUserId(userIdTo)).thenReturn(3); 
        when(userProfileRepository.countFollowerByUserId(userIdTo)).thenReturn(7); 
        when(forumRepository.countPostLikeByUserId(userIdTo)).thenReturn(20); // Can be null
        when(forumRepository.countCommentLikeByUserId(userIdTo)).thenReturn(30); // Can be null
        when(forumRepository.countPostDislikeByUserId(userIdTo)).thenReturn(2); // Can be null
        when(forumRepository.countCommentDislikeByUserId(userIdTo)).thenReturn(1); // Can be null
        when(userProfileRepository.checkIfUserBlocked(userIdFrom, userIdTo)).thenReturn(null); // Not blocked
        when(userProfileRepository.checkIfUserFollowed(userIdFrom, userIdTo)).thenReturn(1); // Is followed

        UserProfileDTO result = profileService.getProfileContent(userIdFrom, userIdTo);

        verify(securityService).checkUserIdWithToken(userIdFrom);
        verify(userProfileRepository).findProfileByUserId(userIdTo);
        // *** Verify the call inside getUserAvatarByUserId ***
        verify(userProfileRepository).findAvatarIdByUserId(userIdTo);
        verify(imageService).getImageAPI(targetProfile.getAvatarId());
        // Verify all counts and checks
        verify(forumRepository).countPostByUserId(userIdTo);
        verify(forumRepository).countCommentByUserId(userIdTo);
        verify(userProfileRepository).countFollowingByUserId(userIdTo);
        verify(userProfileRepository).countFollowerByUserId(userIdTo);
        verify(forumRepository).countPostLikeByUserId(userIdTo);
        verify(forumRepository).countCommentLikeByUserId(userIdTo);
        verify(forumRepository).countPostDislikeByUserId(userIdTo);
        verify(forumRepository).countCommentDislikeByUserId(userIdTo);
        verify(userProfileRepository).checkIfUserBlocked(userIdFrom, userIdTo);
        verify(userProfileRepository).checkIfUserFollowed(userIdFrom, userIdTo);

        assertEquals(userIdTo, result.getUserId());
        assertEquals(targetProfile.getUsername(), result.getUsername());
        assertEquals(targetProfile.getDescription(), result.getDescription());
        assertEquals(avatarApi, result.getAvatar());
        assertEquals(targetProfile.getUpdatedAt(), result.getUpdatedAt());
        assertEquals(5, result.getPostCount());
        assertEquals(10, result.getCommentCount());
        assertEquals(3, result.getFollowingCount());
        assertEquals(7, result.getFollowerCount());
        assertEquals(50, result.getLikeCount()); // 20 + 30
        assertEquals(3, result.getDislikeCount()); // 2 + 1
        assertFalse(result.getIsUserBlocked());
        assertTrue(result.getIsUserFollowed());
    }

     @Test
    void getProfileContent_ProfileNotExist() throws Exception {
        Integer userIdFrom = 1;
        Integer userIdTo = 99; // Non-existent user

        when(userProfileRepository.findProfileByUserId(userIdTo)).thenReturn(null);

        Exception exception = assertThrows(Exception.class, () -> {
             profileService.getProfileContent(userIdFrom, userIdTo);
        });

        assertEquals(ExceptionService.PROFILE_NOT_EXIST, exception.getMessage());
        verify(securityService).checkUserIdWithToken(userIdFrom);
        verify(userProfileRepository).findProfileByUserId(userIdTo);
        verify(imageService, never()).getImageAPI(any());
        // Verify other repo methods not called
    }

    // --- Tests for getUserList ---
    @Test
    void getUserList_Following() throws Exception {
        List<Integer> excludeList = Collections.singletonList(3);
        Integer userNum = 5;
        List<UserProfileModel> mockProfileList = new ArrayList<>();
        UserProfileModel followedUser = new UserProfileModel();
        followedUser.setUserId(userId2);
        followedUser.setUsername("followedUser");
        followedUser.setDescription("Desc");
        followedUser.setAvatarId(12);
        followedUser.setUpdatedAt(ZonedDateTime.now());
        mockProfileList.add(followedUser);
        String avatarApi = "/api/images/12";

        when(userProfileRepository.findFollowingListByUserId(userId1, excludeList, userNum)).thenReturn(mockProfileList);
        // *** Explicitly stub the call inside getUserAvatarByUserId ***
        when(userProfileRepository.findAvatarIdByUserId(userId2)).thenReturn(followedUser.getAvatarId());
        when(imageService.getImageAPI(followedUser.getAvatarId())).thenReturn(avatarApi);
        when(userProfileRepository.checkIfUserBlocked(userId1, userId2)).thenReturn(null); // Not blocked
        when(userProfileRepository.checkIfUserFollowed(userId1, userId2)).thenReturn(1); // Is followed (should be true for following list)

        List<UserInfoDTO> result = profileService.getUserList(userId1, excludeList, userNum, "following");

        verify(securityService).checkUserIdWithToken(userId1);
        verify(userProfileRepository).findFollowingListByUserId(userId1, excludeList, userNum);
        verify(userProfileRepository, never()).findFollowerListByUserId(anyInt(), anyList(), anyInt());
        verify(userProfileRepository, never()).findBlockingListByUserId(anyInt(), anyList(), anyInt());
        verify(userProfileRepository, never()).findSearchListByKeyword(anyString(), anyList(), anyInt());
        // *** Verify the call inside getUserAvatarByUserId ***
        verify(userProfileRepository).findAvatarIdByUserId(userId2);
        verify(imageService).getImageAPI(followedUser.getAvatarId());
        verify(userProfileRepository).checkIfUserBlocked(userId1, userId2);
        verify(userProfileRepository).checkIfUserFollowed(userId1, userId2);

        assertEquals(1, result.size());
        UserInfoDTO userInfo = result.get(0);
        assertEquals(userId2, userInfo.getUserId());
        assertEquals(followedUser.getUsername(), userInfo.getUsername());
        assertEquals(followedUser.getDescription(), userInfo.getDescription());
        assertEquals(avatarApi, userInfo.getAvatar());
        assertEquals(followedUser.getUpdatedAt(), userInfo.getUpdatedAt());
        assertFalse(userInfo.getIsUserBlocked());
        assertTrue(userInfo.getIsUserFollowed());
    }

    @Test
    void getUserList_Search() throws Exception {
        List<Integer> excludeList = new ArrayList<>();
        Integer userNum = 10;
        String keyword = "searchKey";
        List<UserProfileModel> mockProfileList = new ArrayList<>();
        // Add a user to the search results
        UserProfileModel foundUser = new UserProfileModel();
        foundUser.setUserId(userId2);
        foundUser.setUsername("searchResultUser");
        foundUser.setDescription("Found desc");
        foundUser.setAvatarId(null); // No avatar
        foundUser.setUpdatedAt(ZonedDateTime.now());
        mockProfileList.add(foundUser);

        when(userProfileRepository.findSearchListByKeyword(keyword, excludeList, userNum)).thenReturn(mockProfileList);
        when(userProfileRepository.findAvatarIdByUserId(userId2)).thenReturn(null);
        when(userProfileRepository.checkIfUserBlocked(userId1, userId2)).thenReturn(1); // Is blocked
        when(userProfileRepository.checkIfUserFollowed(userId1, userId2)).thenReturn(null); // Not followed

        List<UserInfoDTO> result = profileService.getUserList(userId1, excludeList, userNum, keyword);

        verify(securityService).checkUserIdWithToken(userId1);
        verify(userProfileRepository, never()).findFollowingListByUserId(anyInt(), anyList(), anyInt());
        verify(userProfileRepository, never()).findFollowerListByUserId(anyInt(), anyList(), anyInt());
        verify(userProfileRepository, never()).findBlockingListByUserId(anyInt(), anyList(), anyInt());
        verify(userProfileRepository).findSearchListByKeyword(keyword, excludeList, userNum);

        verify(userProfileRepository).findAvatarIdByUserId(userId2);
        verify(imageService, never()).getImageAPI(any());

        verify(userProfileRepository).checkIfUserBlocked(userId1, userId2);
        verify(userProfileRepository).checkIfUserFollowed(userId1, userId2);

        assertEquals(1, result.size());
        UserInfoDTO userInfo = result.get(0);
        assertEquals(userId2, userInfo.getUserId());
        assertEquals(foundUser.getUsername(), userInfo.getUsername());
        assertEquals(foundUser.getDescription(), userInfo.getDescription());
        assertNull(userInfo.getAvatar());
        assertEquals(foundUser.getUpdatedAt(), userInfo.getUpdatedAt());
        assertTrue(userInfo.getIsUserBlocked());
        assertFalse(userInfo.getIsUserFollowed());
    }

    // Add similar tests for "follower" and "blocking" types in getUserList
}