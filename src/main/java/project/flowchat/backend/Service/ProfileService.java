package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import project.flowchat.backend.DTO.UserInfoDTO;
import project.flowchat.backend.DTO.UserProfileDTO;
import project.flowchat.backend.Model.UserAccountModel;
import project.flowchat.backend.Model.UserProfileModel;
import project.flowchat.backend.Repository.ForumRepository;
import project.flowchat.backend.Repository.ImageRepository;
import project.flowchat.backend.Repository.UserAccountRepository;
import project.flowchat.backend.Repository.UserProfileRepository;

@AllArgsConstructor
@Service
public class ProfileService {

    @Autowired
    private final UserProfileRepository userProfileRepository;
    private final UserAccountRepository userAccountRepository;
    private final ImageRepository imageRepository;
    private final ForumRepository forumRepository;
    private final SecurityService securityService;
    private final ImageService imageService;

    public String getUserAvatarByUserId(Integer userId) {
        Integer avatarId = userProfileRepository.findAvatarIdByUserId(userId);
        if (avatarId == null) {
            return null;
        }
        return imageService.getImageAPI(avatarId);
    }

    public Boolean isUserFollowing(Integer userIdFrom, Integer userIdTo) {
        return userProfileRepository.checkIfUserFollowed(userIdFrom, userIdTo) != null;
    }

    public Boolean isUserBlocking(Integer userIdFrom, Integer userIdTo) {
        return userProfileRepository.checkIfUserBlocked(userIdFrom, userIdTo) != null;
    }

    /**
     * Check if the username contains invalid characters
     * @param username username String
     * @throws ExceptionService INVALID_USERNAME_FORMAT if there is any invalid characters
     */
    private void checkUsernameFormat(String username) throws Exception {
        if (username == null || username.isEmpty() || username.contains(";") || username.contains("@")) {
            ExceptionService.throwException(ExceptionService.INVALID_USERNAME_FORMAT);
        }
    }

    /**
     * Check if the input username is correct in format and unique by counting all the usernames in database
     * @param username username string
     * @return true if username is unique, else false
     * @throws ExceptionService INVALID_USERNAME_FORMAT, USERNAME_NOT_UNIQUE
     */
    public Boolean isUsernameUnique(String username) throws Exception {
        checkUsernameFormat(username);
        Integer countUser = userAccountRepository.countAllUsersByUsername(username);
        if (countUser > 0) {
            ExceptionService.throwException(ExceptionService.USERNAME_NOT_UNIQUE);
        }
        return true;
    }

    /**
     * Follow a user
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     * @throws Exception CANNOT_FOLLOW_YOURSELF, USER_DELETED, USER_ALREADY_FOLLOWED
     */
    public void followUser(Integer userIdFrom, Integer userIdTo) throws Exception{
        securityService.checkUserIdWithToken(userIdFrom);
        if (userIdFrom == userIdTo) {
            ExceptionService.throwException(ExceptionService.CANNOT_FOLLOW_YOURSELF);
        }
        if (!userAccountRepository.findIfUserActive(userIdTo)) {
            ExceptionService.throwException(ExceptionService.USER_DELETED);
        }
        if (isUserFollowing(userIdFrom, userIdTo)) {
            ExceptionService.throwException(ExceptionService.USER_ALREADY_FOLLOWED);
        }
        userProfileRepository.followUser(userIdFrom, userIdTo);
    }

    /**
     * Unfollow a user
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     * @throws Exception USER_NOT_FOLLOWED
     */
    public void unfollowUser(Integer userIdFrom, Integer userIdTo) throws Exception {
        securityService.checkUserIdWithToken(userIdFrom);
        if (!isUserFollowing(userIdFrom, userIdTo)) {
            ExceptionService.throwException(ExceptionService.USER_NOT_FOLLOWED);
        }
        userProfileRepository.unfollowUser(userIdFrom, userIdTo);
    }

    /**
     * Block a user
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     * @throws Exception CANNOT_BLOCK_YOURSELF, USER_DELETED, USER_ALREADY_BLOCKED
     */
    public void blockUser(Integer userIdFrom, Integer userIdTo) throws Exception {
        securityService.checkUserIdWithToken(userIdFrom);
        if (userIdFrom == userIdTo) {
            ExceptionService.throwException(ExceptionService.CANNOT_BLOCK_YOURSELF);
        }
        if (!userAccountRepository.findIfUserActive(userIdTo)) {
            ExceptionService.throwException(ExceptionService.USER_DELETED);
        }
        if (isUserBlocking(userIdFrom, userIdTo)) {
            ExceptionService.throwException(ExceptionService.USER_ALREADY_BLOCKED);
        }
        userProfileRepository.blockUser(userIdFrom, userIdTo);
    }

    /**
     * Unblock a user
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     * @throws Exception USER_NOT_BLOCKED
     */
    public void unblockUser(Integer userIdFrom, Integer userIdTo) throws Exception {
        securityService.checkUserIdWithToken(userIdFrom);
        if (!isUserBlocking(userIdFrom, userIdTo)) {
            ExceptionService.throwException(ExceptionService.USER_NOT_BLOCKED);
        }
        userProfileRepository.unblockUser(userIdFrom, userIdTo);
    }
    
    /**
     * Add a new user profile to the database
     * @param userId userId Integer
     * @param username username String
     */
    public void addNewUserProfile(Integer userId, String username) {
        UserProfileModel userProfileModel = new UserProfileModel();
        userProfileModel.setUserId(userId);
        userProfileModel.setUsername(username);
        userProfileModel.setDescription("");
        userProfileModel.setAvatarId(null);
        userProfileModel.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        userProfileRepository.save(userProfileModel);
    }

    /**
     * Update the personal profile of a user, set the value to null if user does not want to update it
     * @param userId userId of the user
     * @param username new username
     * @param description new description
     * @param avatar new avatar, empty file if user wants to delete it
     * @throws Exception
     */
    public void updatePersonalProfile(Integer userId, String username, String description, MultipartFile avatar) throws Exception {
        securityService.checkUserIdWithToken(userId);
        UserProfileModel userProfileModel = userProfileRepository.findById(userId).get();
        if (username != null) {
            if (isUsernameUnique(username)) {
                userProfileModel.setUsername(username);
                UserAccountModel userAccountModel = userAccountRepository.findById(userId).get();
                userAccountModel.setUsername(username);
                userAccountModel.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
                userAccountRepository.save(userAccountModel);
            }
        }
        if (description != null) {
            userProfileModel.setDescription(description);
        }
        if (avatar != null) {
            if (userProfileModel.getAvatarId() != null) {
                Integer avatarId = userProfileModel.getAvatarId();
                userProfileModel.setAvatarId(null);
                imageRepository.deleteById(avatarId);
            }
            if (!avatar.isEmpty()) {
                // Set new avatar
                imageService.checkIsImage(avatar);
                userProfileModel.setAvatarId(imageService.saveImage(avatar));
            }
        }
        userProfileModel.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        userProfileRepository.save(userProfileModel);
    }

    public UserProfileDTO getProfileContent(Integer userIdFrom, Integer userIdTo) throws Exception {
        securityService.checkUserIdWithToken(userIdFrom);
        UserProfileModel userProfileModel = userProfileRepository.findProfileByUserId(userIdTo);
        if (userProfileModel == null) {
            ExceptionService.throwException(ExceptionService.PROFILE_NOT_EXIST);
        }
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setUserId(userProfileModel.getUserId());
        userProfileDTO.setUsername(userProfileModel.getUsername());
        userProfileDTO.setDescription(userProfileModel.getDescription());
        userProfileDTO.setAvatar(getUserAvatarByUserId(userProfileModel.getUserId()));
        userProfileDTO.setUpdatedAt(userProfileModel.getUpdatedAt());
        userProfileDTO.setPostCount(forumRepository.countPostByUserId(userIdTo));
        userProfileDTO.setCommentCount(forumRepository.countCommentByUserId(userIdTo));
        userProfileDTO.setFollowingCount(userProfileRepository.countFollowingByUserId(userIdTo));
        userProfileDTO.setFollowerCount(userProfileRepository.countFollowerByUserId(userIdTo));

        Integer count1 = forumRepository.countPostLikeByUserId(userIdTo);
        Integer count2 = forumRepository.countCommentLikeByUserId(userIdTo);
        count1 = (count1 == null ? 0 : count1);
        count2 = (count2 == null ? 0 : count2);
        userProfileDTO.setLikeCount(count1 + count2);

        count1 = forumRepository.countPostDislikeByUserId(userIdTo);
        count2 = forumRepository.countCommentDislikeByUserId(userIdTo);
        count1 = (count1 == null ? 0 : count1);
        count2 = (count2 == null ? 0 : count2);
        userProfileDTO.setDislikeCount(count1 + count2);

        userProfileDTO.setIsUserBlocked(isUserBlocking(userIdFrom, userIdTo));
        return userProfileDTO;
    }

    public List<UserInfoDTO> getUserList(Integer userId, List<Integer> excludingUserIdList, Integer userNum, String type) throws Exception {
        securityService.checkUserIdWithToken(userId);
        List<UserInfoDTO> userInfoDTOList = new ArrayList<>();
        List<UserProfileModel> userProfileModelList = switch (type) {
            case "following" -> userProfileRepository.findFollowingListByUserId(userId, excludingUserIdList, userNum);
            case "follower" -> userProfileRepository.findFollowerListByUserId(userId, excludingUserIdList, userNum);
            case "blocking" -> userProfileRepository.findBlockingListByUserId(userId, excludingUserIdList, userNum);
            default -> userProfileRepository.findSearchListByKeyword(type, excludingUserIdList, userNum);
        };
        if (userProfileModelList == null) {
            ExceptionService.throwException(ExceptionService.INVALID_LIST_FORMAT);
        }
        for (UserProfileModel userProfileModel : userProfileModelList) {
            UserInfoDTO userInfoDTO = new UserInfoDTO();
            userInfoDTO.setUserId(userProfileModel.getUserId());
            userInfoDTO.setUsername(userProfileModel.getUsername());
            userInfoDTO.setDescription(userProfileModel.getDescription());
            userInfoDTO.setAvatar(getUserAvatarByUserId(userProfileModel.getUserId()));
            userInfoDTO.setUpdatedAt(userProfileModel.getUpdatedAt());
            userInfoDTO.setStatus(  isUserFollowing(userId, userProfileModel.getUserId()) ? "following" :
                                    isUserBlocking(userId, userProfileModel.getUserId()) ? "blocking" : "not following");
            userInfoDTOList.add(userInfoDTO);
        }
        return userInfoDTOList;
    }
}
