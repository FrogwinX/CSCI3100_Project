package project.flowchat.backend.Repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.PostModel;

import java.util.List;


@Repository
public interface ForumRepository extends JpaRepository<PostModel, Integer> {
    /**
     * Get tag id from tag name
     * @param tagName tag name string
     * @return corresponding tag id
     */
    @NativeQuery("SELECT tag_id from FORUM.Tag_Data where tag_name = ?1")
    Integer getTagIdFromTagName(String tagName);

    /**
     * Insert record into Post_Tag
     * @param postId postId Integer
     * @param tagId  tagId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO FORUM.Post_Tag (post_id, tag_id) VALUES (?1, ?2)")
    void connectPostWithTag(Integer postId, Integer tagId);

    /**
     * Find active comments from post id, ordered by the descending order of likes num
     * @param postId postId Integer
     * @return a list of comments
     */
    @NativeQuery("SELECT * \n" +
            "FROM FORUM.Post \n" +
            "WHERE attach_to = ?1\n" +
            "AND is_active = 1\n" +
            "ORDER BY like_count DESC\n")
    List<PostModel> findActivePostCommentByAttachTo(Integer postId); // To be changed

    /**
     * Find post content by postId
     * @param postId postId Integer
     * @return a single post
     */
    @NativeQuery("SELECT * FROM FORUM.Post WHERE post_id = ?1")
    PostModel findPostByPostId(Integer postId);

    /**
     * Find imageId by postId. A post may contain multiple images
     * @param postId postId Integer
     * @return a list of imageId
     */
    @NativeQuery("SELECT image_id FROM FORUM.Post_Image WHERE post_id = ?1")
    List<Integer> findImageIdByPostId(Integer postId);

    /**
     * Find post tag(s) by postId. A post may contain multiple tags
     * @param postId postId Integer
     * @return a list of tag names
     */
    @NativeQuery("SELECT tag_name \n" +
            "FROM FORUM.Post_Tag PT\n" +
            "JOIN FORUM.Tag_Data TD ON PT.tag_id = TD.tag_id\n" +
            "WHERE post_id = ?1")
    List<String> findPostTagNameByPostId(Integer postId);

    /**
     * Find post tagId by postId. A post may contain multiple tags
     * @param postId postId Integer
     * @return a list of tagId
     */
    @NativeQuery("SELECT tag_id\n" +
            "FROM FORUM.Post_Tag\n" +
            "WHERE post_id = ?1")
    List<Integer> findTagIdByPostId(Integer postId);

    /**
     * Find some active posts, ordered by the descending order of post update time
     * @param excludingPostIdList a list of postId that have already retrieved
     * @param postNum required number of post
     * @return a lists of posts
     */
    @NativeQuery(   "SELECT TOP (?2) * \n" +
                    "FROM FORUM.Post\n" +
                    "WHERE is_active = 1 \n" +
                    "AND attach_to = 0 \n" +
                    "AND post_id NOT IN ?1\n" +
                    "ORDER BY updated_at DESC")
    List<PostModel> findLatestActivePostByRange(List<Integer> excludingPostIdList, Integer postNum);

    /**
     * Find some active posts, filtered in the following users, ordered by descending order of popularity score
     * @param userId  userId Integer
     * @param excludingPostIdList a list of postId that have already retrieved
     * @param postNum required number of post
     * @return a lists of posts
     */
    @NativeQuery("SELECT *\n" +
            "FROM FORUM.Post\n" +
            "WHERE is_active = 1\n" +
            "AND attach_to = 0\n" +
            "AND user_id IN (\n" +
            "SELECT user_id_to\n" +
            "FROM PROFILE.Follow\n" +
            "WHERE user_id_from = ?1)\n" +
            "AND post_id NOT IN ?2\n" +
            "ORDER BY popularity_score DESC\n" +
            "OFFSET 0 ROWS\n" +
            "FETCH NEXT ?3 ROWS ONLY")
    List<PostModel> findFollowingActivePostByRange(Integer userId, List<Integer> excludingPostIdList, Integer postNum);

    @NativeQuery(   "SELECT TOP (?3) *\n" +
            "FROM FORUM.Post\n" +
            "WHERE is_active = 1\n" +
            "AND attach_to = 0\n" +
            "AND user_id = ?1\n" +
            "AND post_id NOT IN ?2\n" +
            "ORDER BY updated_at DESC")
    List<PostModel> findUserActivePostByRange(Integer userId, List<Integer> excludingPostIdList, Integer postNum);

    @NativeQuery(   "SELECT TOP (?3) *\n" +
            "FROM FORUM.Post\n" +
            "WHERE is_active = 1\n" +
            "AND attach_to != 0\n" +
            "AND user_id = ?1\n" +
            "AND post_id NOT IN ?2\n" +
            "ORDER BY updated_at DESC")
    List<PostModel> findUserActiveCommentByRange(Integer userId, List<Integer> excludingCommentIdList, Integer commentNum);

    /**
     * Find some active posts, ordered by the descending order of popularity score
     * @param excludingPostIdList a list of postId that have already retrieved
     * @param postNum required number of post
     * @return a lists of posts
     */
    @NativeQuery("SELECT TOP (?2) * \n" +
            "FROM FORUM.Post\n" +
            "WHERE is_active = 1 \n" +
            "AND attach_to = 0 \n" +
            "AND post_id NOT IN ?1\n" +
            "ORDER BY popularity_score DESC")
    List<PostModel> findPopularActivePostByRange(List<Integer> excludingPostIdList, Integer postNum);

    /**
     * Find some active posts by a tag, ordered by the descending order of post update time
     * @param tagId tagId Integer
     * @param excludingPostIdList a list of postId that have already retrieved
     * @param postNum required number of post
     * @return a lists of posts
     */
    @NativeQuery("SELECT TOP (?3) P.post_id, user_id, title, content, like_count, dislike_count, comment_count, view_count, popularity_score, attach_to, is_active, created_at, updated_at\n" +
            "FROM FORUM.Post P\n" +
            "JOIN FORUM.Post_Tag PT \n" +
            "ON P.post_id = PT.post_id\n" +
            "WHERE is_active = 1 \n" +
            "AND attach_to = 0 \n" +
            "AND tag_id = ?1\n" +
            "AND P.post_id NOT IN ?2\n" +
            "ORDER BY updated_at DESC")
    List<PostModel> findLatestActivePostByRangeAndTag(Integer tagId, List<Integer> excludingPostIdList, Integer postNum);

    /**
     * Find some active posts from a tag, ordered by the descending order of popularity score
     * @param tagId tagId Integer
     * @param excludingPostIdList a list of postId that have already retrieved
     * @param postNum required number of post
     * @return a lists of posts
     */
    @NativeQuery("SELECT TOP (?3) P.post_id, user_id, title, content, like_count, dislike_count, comment_count, view_count, popularity_score, attach_to, is_active, created_at, updated_at\n" +
            "FROM FORUM.Post P\n" +
            "JOIN FORUM.Post_Tag PT \n" +
            "ON P.post_id = PT.post_id\n" +
            "WHERE is_active = 1 \n" +
            "AND attach_to = 0 \n" +
            "AND tag_id = ?1\n" +
            "AND P.post_id NOT IN ?2\n" +
            "ORDER BY popularity_score DESC")
    List<PostModel> findPopularActivePostByRangeAndTag(Integer tagId, List<Integer> excludingPostIdList, Integer postNum);

    /**
     * Add the new tagId with the userId to Recommendation table
     * @param userId userId Integer
     * @param tagId tagId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO FORUM.Recommendation (user_id, tag_id) VALUES (?1, ?2)")
    void addRecommendationTagIdByUserId(Integer userId, Integer tagId);

    /**
     * Find the two tags with the highest interaction scores from the user
     * @param userId userId Integer
     * @return two or less than two tagId
     */
    @NativeQuery("SELECT tag_id\n" +
            "FROM FORUM.Recommendation\n" +
            "WHERE user_id = ?1\n" +
            "ORDER BY score DESC\n" +
            "OFFSET 0 ROWS\n" +
            "FETCH NEXT 5 ROWS ONLY")
    List<Integer> findRecommendedTagByHighestScore(Integer userId);

    /**
     * Find some active posts starting from the offset by keywords, ordered by the descending order of popularity score
     *
     * @param keyword   keyword case-insensitive String
     * @param searchNum required number of queries
     * @param excludingPostIdList a list of postId that have already retrieved
     * @return a lists of posts
     */
    @NativeQuery("SELECT TOP (?3) *\n" +
            "FROM FORUM.Post\n" +
            "WHERE is_active = 1\n" +
            "AND attach_to = 0\n" +
            "AND (title LIKE ?1\n" +
            "OR content LIKE ?1)\n" +
            "AND post_id NOT IN ?2\n" +
            "ORDER BY popularity_score DESC")
    List<PostModel> findPopularActivePostByRangeAndKeyword(String keyword, List<Integer> excludingPostIdList, Integer searchNum);

    /**
     * Add the comment count by 1 of the given post id
     *
     * @param postId postId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET comment_count = comment_count + 1 WHERE post_id = ?1")
    void addCommentCountByOne(Integer postId);

    /**
     * Insert record into FORUM.Post_Image
     *
     * @param postId  postId Integer
     * @param imageId imageId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO FORUM.Post_Image (post_id, image_id) VALUES (?1, ?2)")
    void connectPostWithImage(Integer postId, Integer imageId);

    /**
     * Delete all tag from FORUM.Post_Tag with the given post id
     *
     * @param postId postId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM FORUM.Post_Tag WHERE post_id = ?1")
    void deleteTagInPost(Integer postId);

    /**
     * Reduce comment count of the post or comment by the given count
     *
     * @param postId postId Integer
     * @param count  count int
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET comment_count = comment_count - ?2 WHERE post_id = ?1")
    void removeCommentCountByNum(Integer postId, int count);

    /**
     * Add comment count of the post or comment by the given count
     *
     * @param postId postId Integer
     * @param count  count int
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET comment_count = comment_count + ?2 WHERE post_id = ?1")
    void addCommentCountByNum(Integer postId, int count);

    /**
     * Delete relevant record in Post_Image table
     *
     * @param imageId imageId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM FORUM.Post_Image WHERE image_id = ?1")
    void deleteInPostImage(Integer imageId);

    /**
     * Delete relevant record in Image_Data table
     *
     * @param imageId imageId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM [Image].[Image_Data] WHERE image_id = ?1")
    void deleteInImageData(Integer imageId);

    /**
     * Minus the comment count by 1 of the given post id
     *
     * @param postId postId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET comment_count = comment_count - 1 WHERE post_id = ?1")
    void minusCommentCountByOne(Integer postId);

    /**
     * Find if user liked that post or comment before
     *
     * @param postId postId Integer
     * @param userId userId Integer
     * @return post id if user liked that post or comment before, null if user did not like that post or comment
     */
    @NativeQuery("SELECT post_id FROM FORUM.[Like] WHERE post_id = ?1 AND user_id = ?2")
    Integer isLikeClick(Integer postId, Integer userId);

    /**
     * Add a record in Like table
     *
     * @param postId postId Integer
     * @param userId userId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO FORUM.[Like] VALUES (?1, ?2)")
    void addLikeRelationship(Integer postId, Integer userId);

    /**
     * Add 1 to like count in Post table
     *
     * @param postId postId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET like_count = like_count + 1 WHERE post_id = ?1")
    void addLikeCount(Integer postId);

    /**
     * Find if user disliked that post or comment before
     *
     * @param postId postId Integer
     * @param userId userId Integer
     * @return post id if user disliked that post or comment before, null if user did not dislike that post or comment
     */
    @NativeQuery("SELECT post_id FROM FORUM.Dislike WHERE post_id = ?1 AND user_id = ?2")
    Integer isDislikeClick(Integer postId, Integer userId);

    /**
     * Add a record in Dislike table
     *
     * @param postId postId Integer
     * @param userId userId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO FORUM.Dislike VALUES (?1, ?2)")
    void addDislikeRelationship(Integer postId, Integer userId);

    /**
     * Add 1 to dislike count in Post table
     *
     * @param postId postId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET dislike_count = dislike_count + 1 WHERE post_id = ?1")
    void addDislikeCount(Integer postId);

    /**
     * Remove a record from Like table with the corresponding post id and user id
     *
     * @param postId postId Integer
     * @param userId userId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM FORUM.[Like] WHERE post_id = ?1 AND user_id = ?2")
    void removeLikeRelationship(Integer postId, Integer userId);

    /**
     * Minus like count of a post or comment with the given postId by one in Post table
     *
     * @param postId postId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET like_count = like_count - 1 WHERE post_id = ?1")
    void minusLikeCount(Integer postId);

    /**
     * Remove a record from Dislike table with the corresponding post id and user id
     *
     * @param postId postId Integer
     * @param userId userId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM FORUM.Dislike WHERE post_id = ?1 AND user_id = ?2")
    void removeDislikeRelationship(Integer postId, Integer userId);

    /**
     * Minus dislike count of a post or comment with the given postId by one in Post table
     *
     * @param postId postId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET dislike_count = dislike_count - 1 WHERE post_id = ?1")
    void minusDislikeCount(Integer postId);

    @NativeQuery("SELECT tag_id, tag_name FROM FORUM.Tag_Data")
    List<List<String>> findAllTagName();

    /**
     * Check if post or comment is active
     *
     * @param postId postId Integer
     * @return true if post or comment is active, false if post or comment is not active
     */
    @NativeQuery("SELECT is_active FROM FORUM.Post WHERE post_id = ?1")
    boolean postOrCommentIsActive(Integer postId);

    /**
     * Find if user viewed that post before
     * @param postId postId Integer
     * @param userId userId Integer
     * @return post id if user viewed that post before, null if user did not view that post
     */
    @NativeQuery("SELECT post_id FROM FORUM.[View] WHERE post_id = ?1 AND user_id = ?2")
    Integer isPostView(Integer postId, Integer userId);

    /**
     * Add a record in View table
     * @param postId postId Integer
     * @param userId userId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO FORUM.[View] VALUES (?1, ?2)")
    void addViewRelationship(Integer postId, Integer userId);

    /**
     * Add 1 to view count in Post table
     * @param postId postId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET view_count = view_count + 1 WHERE post_id = ?1")
    void addViewCount(Integer postId);

    /**
     * Find some active posts by a tag, filtered out the blocked users, ordered by the descending order of post update time
     * @param userId  userId Integer
     * @return a lists of postId
     */
    @NativeQuery("SELECT P.post_id\n" +
            "FROM FORUM.Post P\n" +
            "JOIN FORUM.[View] V\n" +
            "ON P.post_id = V.post_id\n" +
            "AND V.user_id = ?1\n" +
            "WHERE DATEADD(HOUR, 8, GETUTCDATE()) <= DATEADD(WEEK, 1, updated_at)\n")
    List<Integer> findViewPostListByUserId(Integer userId);

    /**
     * Update a new popularity score for a post
     * @param postId postId Integer
     * @param val a new popularity score
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET popularity_score = ?2 WHERE post_id = ?1")
    void updatePostPopularity(Integer postId, int val);

    /**
     * Find a list of userId and tagId that the tag interaction is not updated for at least 3 days
     * @return a list of userId and tagId
     */
    @NativeQuery("SELECT user_id, tag_id\n" +
            "FROM FORUM.Recommendation\n" +
            "WHERE DATEADD(HOUR, 8, GETUTCDATE()) > DATEADD(DAY, 3, updated_at)\n" +
            "AND score != 0")
    List<List<Integer>> findInfrequentRecommendation();

    /**
     * Find the recommendation score of the pair of userId and tagId
     * @param userId userId Integer
     * @param tagId tagId Integer
     * @return Integer
     */
    @NativeQuery("SELECT score FROM FORUM.Recommendation WHERE user_id = ?1 AND tag_id = ?2")
    Integer findRecommendationScore(Integer userId, Integer tagId);

    /**
     * Update the recommendation time of the pair of userId and tagId
     * @param userId userId Integer
     * @param tagId tagId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Recommendation SET updated_at = (DATEADD(HOUR, 8, GETUTCDATE())) WHERE user_id = ?1 AND tag_id = ?2")
    void updateRecommendationTime(Integer userId, Integer tagId);

    /**
     * Update the recommendation score of the pair of userId and tagId
     * @param userId userId Integer
     * @param tagId tagId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Recommendation SET score = ?3 WHERE user_id = ?1 AND tag_id = ?2")
    void updateRecommendationScore(Integer userId, Integer tagId, int val);

    @NativeQuery("SELECT COUNT(*) FROM FORUM.Post WHERE user_id = ?1 AND attach_to = 0")
    Integer countPostByUserId(Integer userId);

    @NativeQuery("SELECT COUNT(*) FROM FORUM.Post WHERE user_id = ?1 AND attach_to != 0")
    Integer countCommentByUserId(Integer userId);

    @NativeQuery("SELECT SUM(like_count) FROM FORUM.Post WHERE user_id = ?1 AND attach_to = 0")
    Integer countPostLikeByUserId(Integer userId);

    @NativeQuery("SELECT SUM(like_count) FROM FORUM.Post WHERE user_id = ?1 AND attach_to != 0")
    Integer countCommentLikeByUserId(Integer userId);

    @NativeQuery("SELECT SUM(dislike_count) FROM FORUM.Post WHERE user_id = ?1 AND attach_to = 0")
    Integer countPostDislikeByUserId(Integer userId);

    @NativeQuery("SELECT SUM(dislike_count) FROM FORUM.Post WHERE user_id = ?1 AND attach_to != 0")
    Integer countCommentDislikeByUserId(Integer userId);
}
