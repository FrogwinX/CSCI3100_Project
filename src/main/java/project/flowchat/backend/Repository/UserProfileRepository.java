package project.flowchat.backend.Repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.UserProfileModel;

import java.util.List;


@Repository
public interface UserProfileRepository extends JpaRepository<UserProfileModel, Integer> {

    /**
     * Find user avatarId by userID
     * @param userId userId Integer
     * @return avatarId or null
     */
    @NativeQuery("SELECT avatar_id FROM PROFILE.User_Profile WHERE user_id = ?1")
    Integer findAvatarIdByUserId(Integer userId);

    /**
     * Check if a user have followed another user before
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     * @return userIdFrom Integer if a record is found, otherwise null
     */
    @NativeQuery("SELECT user_id_from FROM PROFILE.Follow WHERE user_id_from = ?1 AND user_id_to = ?2")
    Integer checkIfUserFollowed(Integer userIdFrom, Integer userIdTo);

    /**
     * Add a record to the PROFILE.Follow table
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO PROFILE.Follow (user_id_from, user_id_to) VALUES (?1, ?2)")
    void followUser(Integer userIdFrom, Integer userIdTo);

    /**
     * Delete a record from the PROFILE.Follow table
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM PROFILE.Follow WHERE user_id_from = ?1 AND user_id_to = ?2")
    void unfollowUser(Integer userIdFrom, Integer userIdTo);

    /**
     * Check if a user have blocked another user before
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     * @return userIdFrom Integer if a record is found, otherwise null
     */
    @NativeQuery("SELECT user_id_from FROM PROFILE.Block WHERE user_id_from = ?1 AND user_id_to = ?2")
    Integer checkIfUserBlocked(Integer userIdFrom, Integer userIdTo);

    /**
     * Add a record to the PROFILE.Block table
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO PROFILE.Block (user_id_from, user_id_to) VALUES (?1, ?2)")
    void blockUser(Integer userIdFrom, Integer userIdTo);

    /**
     * Delete a record from the PROFILE.Block table
     * @param userIdFrom userIdFrom Integer
     * @param userIdTo userIdTo Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM PROFILE.Block WHERE user_id_from = ?1 AND user_id_to = ?2")
    void unblockUser(Integer userIdFrom, Integer userIdTo);

    /**
     * Find user profile by userId
     * @param userId userId Integer
     * @return UserProfileModel
     */
    @NativeQuery("SELECT * FROM PROFILE.User_Profile WHERE user_id = ?1")
    UserProfileModel findProfileByUserId(Integer userId);

    /**
     * Find the number of followings of a user
     * @param userId userId Integer
     * @return number of followings of a user
     */
    @NativeQuery("SELECT COUNT(*) FROM PROFILE.Follow WHERE user_id_from = ?1")
    Integer countFollowingByUserId(Integer userId);

    /**
     * Find the number of followers of a user
     * @param userId userId Integer
     * @return number of followers of a user
     */
    @NativeQuery("SELECT COUNT(*) FROM PROFILE.Follow WHERE user_id_to = ?1")
    Integer countFollowerByUserId(Integer userId);

    /**
     * Find a list of user profile of the followings of a user, ordered by username
     * @param userId userId Integer
     * @param excludingUserIdList a list of userId that have already retrieved
     * @param userNum required number of user profiles
     * @return a list of UserProfileModel
     */
    @NativeQuery(   "SELECT TOP (?3) UP.user_id, UP.username, UP.description, UP.avatar_id, UP.updated_at\n" +
                    "FROM PROFILE.User_Profile UP\n" +
                    "JOIN PROFILE.Follow F\n" +
                    "ON UP.user_id = F.user_id_to\n" +
                    "WHERE user_id_from = ?1\n" +
                    "AND user_id NOT IN ?2\n" +
                    "ORDER BY username ASC")
    List<UserProfileModel> findFollowingListByUserId(Integer userId, List<Integer> excludingUserIdList, Integer userNum);

    /**
     * Find a list of user profile of the followers of a user, ordered by username
     * @param userId userId Integer
     * @param excludingUserIdList a list of userId that have already retrieved
     * @param userNum required number of user profiles
     * @return a list of UserProfileModel
     */
    @NativeQuery(   "SELECT TOP (?3) UP.user_id, UP.username, UP.description, UP.avatar_id, UP.updated_at\n" +
                    "FROM PROFILE.User_Profile UP\n" +
                    "JOIN PROFILE.Follow F\n" +
                    "ON UP.user_id = F.user_id_from\n" +
                    "WHERE user_id_to = ?1\n" +
                    "AND user_id NOT IN ?2\n" +
                    "ORDER BY username ASC")
    List<UserProfileModel> findFollowerListByUserId(Integer userId, List<Integer> excludingUserIdList, Integer userNum);

    /**
     * Find a list of user profile of the blocking of a user, ordered by username
     * @param userId userId Integer
     * @param excludingUserIdList a list of userId that have already retrieved
     * @param userNum required number of user profiles
     * @return a list of UserProfileModel
     */
    @NativeQuery(   "SELECT TOP (?3) UP.user_id, UP.username, UP.description, UP.avatar_id, UP.updated_at\n" +
                    "FROM PROFILE.User_Profile UP\n" +
                    "JOIN PROFILE.Block B\n" +
                    "ON UP.user_id = B.user_id_to\n" +
                    "WHERE user_id_from = ?1\n" +
                    "AND user_id NOT IN ?2\n" +
                    "ORDER BY username ASC")
    List<UserProfileModel> findBlockingListByUserId(Integer userId, List<Integer> excludingUserIdList, Integer userNum);

    /**
     * Find a list of UserProfileModel of the active users with case-insensitive keywords in usernames or emails, ordered randomly
     * @param keyword keywords case-insensitive String
     * @param excludingUserIdList a list of userId that have already retrieved
     * @param searchNum required number of queries
     * @return a lists of UserProfileModel
     */
    @NativeQuery(   "SELECT TOP (?3) UP.user_id, UP.username, UP.description, UP.avatar_id, UP.updated_at\n" +
                    "FROM PROFILE.User_Profile UP\n" +
                    "JOIN ACCOUNT.User_Account UA\n" +
                    "ON UP.user_id = UA.user_id\n" +
                    "WHERE UA.is_active = 1\n" +
                    "AND (UA.username LIKE ?1\n" +
                    "OR UA.email LIKE ?1)\n" +
                    "AND UP.user_id NOT IN ?2\n" +
                    "ORDER BY NEWID()")
    List<UserProfileModel> findSearchListByKeyword(String keyword, List<Integer> excludingUserIdList, Integer searchNum);
}
