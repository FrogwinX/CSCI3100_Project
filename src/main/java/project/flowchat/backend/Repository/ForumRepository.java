package project.flowchat.backend.Repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.PostModel;
import project.flowchat.backend.Model.UserAccountModel;


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
     * Add the comment count by 1 of the given post id
     * @param postId
     */
    @Modifying
    @Transactional
    @NativeQuery("UPDATE FORUM.Post SET comment_count = comment_count + 1 WHERE post_id = ?1")
    void addCommentCountByOne(int postId);
}
