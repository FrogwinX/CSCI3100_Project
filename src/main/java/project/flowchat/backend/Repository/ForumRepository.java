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

    @NativeQuery(value = "SELECT * FROM FORUM.Post WHERE post_id = ?1 AND is_active = 1")
    PostModel findActivePostCommentByPostId(Integer postId);

    @NativeQuery(value = "SELECT * FROM FORUM.Post WHERE attach_to = ?1 AND is_active = 1")
    List<PostModel> findActivePostCommentByAttachTo(Integer postId);

    @NativeQuery(value = "SELECT image_id FROM FORUM.Post_Image WHERE post_id = ?1")
    List<Integer> findPostImageIdByPostId(Integer postId);

    @NativeQuery(value =    "SELECT tag_name \n" +
                            "FROM FORUM.Post_Tag PT\n" +
                            "JOIN FORUM.Tag_Data TD ON PT.tag_id = TD.tag_id\n" +
                            "WHERE post_id = ?1")
    List<String> findPostTagNameByPostId(Integer postId);

    @NativeQuery(value = "SELECT COUNT(*) FROM [FORUM].[Block] WHERE post_id = ?1 AND user_id = ?2")
    Integer countBlockByUserIdAndPostId(Integer postId, Integer userId);

    @NativeQuery(value = "SELECT COUNT(*) FROM [FORUM].[Like] WHERE post_id = ?1 AND user_id = ?2")
    Integer countLikeByUserIdAndPostId(Integer postId, Integer userId);

    @NativeQuery(value = "SELECT COUNT(*) FROM [FORUM].[Dislike] WHERE post_id = ?1 AND user_id = ?2")
    Integer countDislikeByUserIdAndPostId(Integer postId, Integer userId);

    @NativeQuery(value =    "SELECT *\n" +
                            "FROM FORUM.Post\n" +
                            "WHERE is_active = 1 AND attach_to = 0\n" +
                            "ORDER BY updated_at DESC\n" +
                            "OFFSET ?1 ROWS\n" +
                            "FETCH NEXT ?2 ROWS ONLY")
    List<PostModel> findLatestActivePostByRange(Integer postNumOffset, Integer postNum);

    @NativeQuery(value =    "SELECT *\n" +
                            "FROM FORUM.Post\n" +
                            "WHERE is_active = 1 AND attach_to = 0\n" +
                            "ORDER BY like_count DESC\n" +
                            "OFFSET ?1 ROWS\n" +
                            "FETCH NEXT ?2 ROWS ONLY")
    List<PostModel> findPopularActivePostByRange(Integer postNumOffset, Integer postNum);

    @NativeQuery(value =    "SELECT P.post_id, user_id, title, content, like_count, dislike_count, comment_count, attach_to, is_active, created_at, updated_at\n" +
                            "FROM FORUM.Post P\n" +
                            "JOIN FORUM.Post_Tag PT ON P.post_id = PT.post_id\n" +
                            "WHERE is_active = 1 AND attach_to = 0 AND tag_id = ?1\n" +
                            "ORDER BY updated_at DESC\n" +
                            "OFFSET ?2 ROWS\n" +
                            "FETCH NEXT ?3 ROWS ONLY")
    List<PostModel> findLatestActivePostByRangeAndTag(Integer tagId, Integer postNumOffset, Integer postNum);

    @NativeQuery(value =    "SELECT P.post_id, user_id, title, content, like_count, dislike_count, comment_count, attach_to, is_active, created_at, updated_at\n" +
                            "FROM FORUM.Post P\n" +
                            "JOIN FORUM.Post_Tag PT ON P.post_id = PT.post_id\n" +
                            "WHERE is_active = 1 AND attach_to = 0 AND tag_id = ?1\n" +
                            "ORDER BY like_count DESC\n" +
                            "OFFSET ?2 ROWS\n" +
                            "FETCH NEXT ?3 ROWS ONLY")
    List<PostModel> findPopularActivePostByRangeAndTag(Integer tagId, Integer postNumOffset, Integer postNum);

    @NativeQuery(value =    "SELECT tag_id \n" +
                            "FROM FORUM.Recommendation \n" +
                            "ORDER BY score DESC \n" +
                            "OFFSET 0 ROWS\n" +
                            "FETCH NEXT 2 ROWS ONLY")
    List<Integer> findRecommendedTagByHighestScore();

    /**
     * Add the comment count by 1 of the given post id
     * @param postId
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
}
