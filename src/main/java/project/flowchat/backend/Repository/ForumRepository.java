package project.flowchat.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.PostModel;

import java.util.List;


@Repository
public interface ForumRepository extends JpaRepository<PostModel, Integer> {

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

}
