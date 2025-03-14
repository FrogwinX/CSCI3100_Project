package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;

import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import project.flowchat.backend.Model.PostModel;
import project.flowchat.backend.Repository.ForumRepository;

@AllArgsConstructor
@Service
public class ForumService {

    @Autowired
    private final ForumRepository forumRepository;

    /**
     * Save a post or a comment to the database
     * @param userId user id of the user that creates the post or comment
     * @param title title of the post
     * @param content content of the post or comment
     * @param tag tag for the post
     * @param image image of the post or comment, optional
     * @param attachTo 0 if it is a post, post id if it is a comment
     * @throws Exception
     */
    public void createPostOrComment(String userId, String title, String content, String tag, MultipartFile image, String attachTo) throws Exception {
        if (Integer.parseInt(attachTo) == 0) {
            // Post
            PostModel postOrComment = addPostOrCommentToDatabase(userId, title, content, attachTo);
            Integer tagId = forumRepository.getTagIdFromTagName(tag);
            if (tagId != null) {
                System.err.println(tagId);
                forumRepository.connectPostWithTag(postOrComment.getPostId(), tagId);
            }
        }
        else {
            // Comment
            PostModel postOrComment = addPostOrCommentToDatabase(userId, null, content, attachTo);
            forumRepository.addCommentCountByOne(Integer.parseInt(attachTo));
        }
    }

    /**
     * add a new record to FORUM.Post
     * @param userId userId string
     * @param title title string
     * @param content content string
     * @param attachTo attachTo string
     * @return the corresponding record in the database
     */
    private PostModel addPostOrCommentToDatabase(String userId, String title, String content, String attachTo) {
        PostModel postModel = new PostModel();
        postModel.setUserId(Integer.parseInt(userId));
        postModel.setTitle(title);
        postModel.setContent(content);
        postModel.setLikeCount(0);
        postModel.setDislikeCount(0);
        postModel.setCommentCount(0);
        postModel.setAttachTo(Integer.parseInt(attachTo));
        postModel.setIsActive(true);
        postModel.setCreatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        postModel.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        return forumRepository.save(postModel);
    }

    public void updatePostOrComment() throws Exception {

    }

    public void deletePostOrComment() throws Exception {

    }    
}
