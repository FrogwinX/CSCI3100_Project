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
     * @param postId postId int
     * @param tagId tagId int
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO FORUM.Post_Tag (post_id, tag_id) VALUES (?1, ?2)")
    void connectPostWithTag(int postId, int tagId);

    /**
     * Find active comments from post id, filtered out the blocked users, ordered by the descending order of likes num
     * @param postId postId Integer
     * @param userId userId Integer
     * @return a list of comments
     */
    @NativeQuery(value =    "SELECT * \n" +
                            "FROM FORUM.Post \n" +
                            "WHERE attach_to = ?1\n" +
                            "AND is_active = 1\n" +
                            "AND user_id NOT IN (\n" +
                            "SELECT user_id_to\n" +
                            "FROM PROFILE.Block\n" +
                            "WHERE user_id_from = ?2)" +
                            "ORDER BY like_count DESC\n")
    List<PostModel> findActivePostCommentByAttachTo(Integer postId, Integer userId);

    /**
     * Find post content by postId
     * @param postId postId Integer
     * @return a single post
     */
    @NativeQuery(value = "SELECT * FROM FORUM.Post WHERE post_id = ?1")
    PostModel findPostByPostId(Integer postId);

    /**
     * Find imageId by postId. A post may contain multiple images
     * @param postId postId Integer
     * @return a list of imageId
     */
    @NativeQuery(value = "SELECT image_id FROM FORUM.Post_Image WHERE post_id = ?1")
    List<Integer> findImageIdByPostId(Integer postId);

    /**
     * Find post tag(s) by postId. A post may contain multiple tags
     * @param postId postId Integer
     * @return a list of tagId
     */
    @NativeQuery(value =    "SELECT tag_name \n" +
                            "FROM FORUM.Post_Tag PT\n" +
                            "JOIN FORUM.Tag_Data TD ON PT.tag_id = TD.tag_id\n" +
                            "WHERE post_id = ?1")
    List<String> findPostTagNameByPostId(Integer postId);

    /**
     * Find some active posts, filtered out the blocked users, ordered by the descending order of post update time
     * @param userId userId Integer
     * @param postNum required number of post
     * @return a lists of posts
     */
    @NativeQuery(value =    "SELECT * \n" +
                            "FROM FORUM.Post\n" +
                            "WHERE is_active = 1 \n" +
                            "AND attach_to = 0 \n" +
                            "AND user_id NOT IN (\n" +
                            "SELECT user_id_to \n" +
                            "FROM PROFILE.Block\n" +
                            "WHERE user_id_from = ?1)\n" +
                            "ORDER BY updated_at DESC\n" +
                            "OFFSET 0 ROWS\n" +
                            "FETCH NEXT ?2 ROWS ONLY")
    List<PostModel> findLatestActivePostByRange(Integer userId, Integer postNum);

    /**
     * Find some active posts, filtered in the following users, ordered by random order
     * @param userId userId Integer
     * @param postNum required number of post
     * @return a lists of posts
     */
    @NativeQuery(value =    "SELECT *\n" +
                            "FROM FORUM.Post\n" +
                            "WHERE is_active = 1\n" +
                            "AND attach_to = 0\n" +
                            "AND user_id IN (\n" +
                            "SELECT user_id_to\n" +
                            "FROM PROFILE.Follow\n" +
                            "WHERE user_id_from = ?1)\n" +
                            "ORDER BY NEWID()\n" +
                            "OFFSET 0 ROWS\n" +
                            "FETCH NEXT ?2 ROWS ONLY")
    List<PostModel> findFollowingActivePostByRange(Integer userId, Integer postNum);

    /**
     * Find some active posts, filtered out the blocked users, ordered by the descending order of likes num
     * @param userId userId Integer
     * @param postNum required number of post
     * @return a lists of posts
     */
    @NativeQuery(value =    "SELECT * \n" +
                            "FROM FORUM.Post\n" +
                            "WHERE is_active = 1 \n" +
                            "AND attach_to = 0 \n" +
                            "AND user_id NOT IN (\n" +
                            "SELECT user_id_to \n" +
                            "FROM PROFILE.Block\n" +
                            "WHERE user_id_from = ?1)\n" +
                            "ORDER BY like_count DESC\n" +
                            "OFFSET 0 ROWS\n" +
                            "FETCH NEXT ?2 ROWS ONLY")
    List<PostModel> findPopularActivePostByRange(Integer userId, Integer postNum);

    /**
     * Find some active posts by a tag, filtered out the blocked users, ordered by the descending order of post update time
     * @param userId userId Integer
     * @param tagId tagId Integer
     * @param postNum required number of post
     * @return a lists of posts
     */
    @NativeQuery(value =    "SELECT P.post_id, user_id, title, content, like_count, dislike_count, comment_count, attach_to, is_active, created_at, updated_at\n" +
                            "FROM FORUM.Post P\n" +
                            "JOIN FORUM.Post_Tag PT \n" +
                            "ON P.post_id = PT.post_id\n" +
                            "WHERE is_active = 1 \n" +
                            "AND attach_to = 0 \n" +
                            "AND tag_id = ?2\n" +
                            "AND user_id NOT IN (\n" +
                            "SELECT user_id_to\n" +
                            "FROM PROFILE.Block\n" +
                            "WHERE user_id_from = ?1)\n" +
                            "ORDER BY updated_at DESC\n" +
                            "OFFSET 0 ROWS\n" +
                            "FETCH NEXT ?3 ROWS ONLY")
    List<PostModel> findLatestActivePostByRangeAndTag(Integer userId, Integer tagId, Integer postNum);

    /**
     * Find some active posts from a tag, filtered out the blocked users, ordered by the descending order of likes num
     * @param userId userId Integer
     * @param tagId tagId Integer
     * @param postNum required number of post
     * @return a lists of posts
     */
    @NativeQuery(value =    "SELECT P.post_id, user_id, title, content, like_count, dislike_count, comment_count, attach_to, is_active, created_at, updated_at\n" +
                            "FROM FORUM.Post P\n" +
                            "JOIN FORUM.Post_Tag PT \n" +
                            "ON P.post_id = PT.post_id\n" +
                            "WHERE is_active = 1 \n" +
                            "AND attach_to = 0 \n" +
                            "AND tag_id = ?2\n" +
                            "AND user_id NOT IN (\n" +
                            "SELECT user_id_to\n" +
                            "FROM PROFILE.Block\n" +
                            "WHERE user_id_from = ?1)\n" +
                            "ORDER BY like_count DESC\n" +
                            "OFFSET 0 ROWS\n" +
                            "FETCH NEXT ?3 ROWS ONLY")
    List<PostModel> findPopularActivePostByRangeAndTag(Integer userId, Integer tagId, Integer postNum);

    /**
     * Find the two tags with the highest interaction scores from the user
     * @param userId userId Integer
     * @return two or less than two tagId
     */
    @NativeQuery(value =    "SELECT tag_id\n" +
                            "FROM FORUM.Recommendation\n" +
                            "WHERE user_id = ?1\n" +
                            "ORDER BY score DESC\n" +
                            "OFFSET 0 ROWS\n" +
                            "FETCH NEXT 2 ROWS ONLY")
    List<Integer> findRecommendedTagByHighestScore(Integer userId);

    /**
     * Find some active posts by keywords, filtered out the blocked users, ordered by the descending order of likes num
     * @param userId userId Integer
     * @param keyword keyword case-insensitive String
     * @param searchNum required number of queries
     * @return a lists of posts
     */
    @NativeQuery(value =    "SELECT *\n" +
                            "FROM FORUM.Post\n" +
                            "WHERE is_active = 1\n" +
                            "AND attach_to = 0\n" +
                            "AND (title LIKE ?2\n" +
                            "OR content LIKE ?2)\n" +
                            "AND user_id NOT IN (\n" +
                            "SELECT user_id_to\n" +
                            "FROM PROFILE.Block\n" +
                            "WHERE user_id_from = ?1)\n" +
                            "ORDER BY like_count DESC\n" +
                            "OFFSET 0 ROWS\n" +
                            "FETCH NEXT ?3 ROWS ONLY\n")
    List<PostModel> findActivePostByRangeAndKeyword(Integer userId, String keyword, Integer searchNum);

    /**
     * Add the comment count by 1 of the given post id
     * @param postId postId int
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET comment_count = comment_count + 1 WHERE post_id = ?1")
    void addCommentCountByOne(int postId);

    /**
     * Insert record into FORUM.Post_Image
     * @param postId postId int
     * @param imageId imageId int
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO FORUM.Post_Image (post_id, image_id) VALUES (?1, ?2)")
    void connectPostWithImage(int postId, int imageId);

    /**
     * Delete all tag from FORUM.Post_Tag with the given post id
     * @param postId postId int
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM FORUM.Post_Tag WHERE post_id = ?1")
    void deleteTagInPost(int postId);

    /**
     * Reduce comment count of the post or comment by the given count
     * @param postId postId int
     * @param count count int
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET comment_count = comment_count - ?2 WHERE post_id = ?1")
    void removeCommentCountByNum(int postId, int count);

    /**
     * Add comment count of the post or comment by the given count
     * @param postId postId int
     * @param count count int
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET comment_count = comment_count + ?2 WHERE post_id = ?1")
    void addCommentCountByNum(int postId, int count);

    /**
     * Find the image id with the given post id
     * @param postId postId int
     * @return corresponding image id
     */
    @NativeQuery("SELECT image_id FROM FORUM.Post_Image WHERE post_id = ?1")
    Integer findImageId(int postId);

    /**
     * Delete relevant record in Post_Image table
     * @param imageId imageId int
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM FORUM.Post_Image WHERE image_id = ?1")
    void deleteInPostImage(int imageId);

    /**
     * Delete relevant record in Image_Data table
     * @param imageId imageId int
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM FORUM.Image_Data WHERE image_id = ?1")
    void deleteInImageData(int imageId);

    /**
     * Minus the comment count by 1 of the given post id
     * @param postId postId int
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET comment_count = comment_count - 1 WHERE post_id = ?1")
    void minusCommentCountByOne(int postId);

    /**
     * Find if user liked that post or comment before
     * @param postId postId int
     * @param userId userId int
     * @return post id if user liked that post or comment before, null if user did not like that post or comment
     */
    @NativeQuery("SELECT post_id FROM FORUM.[Like] WHERE post_id = ?1 AND user_id = ?2")
    Integer isLikeClick(int postId, int userId);

    /**
     * Add a record in Like table
     * @param postId postId int
     * @param userId userId int
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO FORUM.[Like] VALUES (?1, ?2)")
    void addLikeRelationship(int postId, int userId);

    /**
     * Add 1 to like count in Post table
     * @param postId postId int
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET like_count = like_count + 1 WHERE post_id = ?1")
    void addLikeCount(int postId);

    /**
     * Find if user disliked that post or comment before
     * @param postId postId int
     * @param userId userId int
     * @return post id if user disliked that post or comment before, null if user did not dislike that post or comment
     */
    @NativeQuery("SELECT post_id FROM FORUM.Dislike WHERE post_id = ?1 AND user_id = ?2")
    Integer isDislikeClick(int postId, int userId);

    /**
     * Add a record in Dislike table
     * @param postId postId int
     * @param userId userId int
     */
    @Modifying
    @Transactional
    @NativeQuery("INSERT INTO FORUM.Dislike VALUES (?1, ?2)")
    void addDislikeRelationship(int postId, int userId);

    /**
     * Add 1 to dislike count in Post table
     * @param postId postId int
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET dislike_count = dislike_count + 1 WHERE post_id = ?1")
    void addDislikeCount(int postId);

    /**
     * Remove a record from Like table with the corresponding post id and user id
     * @param postId postId int
     * @param userId userId int
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM FORUM.[Like] WHERE post_id = ?1 AND user_id = ?2")
    void removeLikeRelationship(int postId, int userId);

    /**
     * Minus like count of a post or comment with the given postId by one in Post table
     * @param postId postId int
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET like_count = like_count - 1 WHERE post_id = ?1")
    void minusLikeCount(int postId);

    /**
     * Remove a record from Dislike table with the corresponding post id and user id
     * @param postId postId int
     * @param userId userId int
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM FORUM.Dislike WHERE post_id = ?1 AND user_id = ?2")
    void removeDislikeRelationship(int postId, int userId);

    /**
     * Minus dislike count of a post or comment with the given postId by one in Post table
     * @param postId postId int
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET dislike_count = dislike_count - 1 WHERE post_id = ?1")
    void minusDislikeCount(int postId);
}
