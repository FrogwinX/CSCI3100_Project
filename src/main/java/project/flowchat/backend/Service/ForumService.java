package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import project.flowchat.backend.Model.PostModel;
import project.flowchat.backend.Repository.ForumRepository;

@AllArgsConstructor
@Service
public class ForumService {

    @Autowired
    private final ForumRepository forumRepository;
    private final ImageService imageService;

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
        PostModel postOrComment;
        if (Integer.parseInt(attachTo) == 0) {
            // Post
            postOrComment = addPostOrCommentToDatabase(userId, title, content, attachTo);
            addTag(postOrComment.getPostId(), tag);
        }
        else {
            // Comment
            postOrComment = addPostOrCommentToDatabase(userId, null, content, attachTo);
            forumRepository.addCommentCountByOne(Integer.parseInt(attachTo));
            PostModel parent = forumRepository.findById(Integer.parseInt(attachTo)).get();
            while (parent.getAttachTo() != 0) {
                forumRepository.addCommentCountByOne(parent.getAttachTo());
                parent = forumRepository.findById(parent.getAttachTo()).get();
            }

        }
        if (image != null) {
            int imageId = imageService.saveImage(image);
            forumRepository.connectPostWithImage(postOrComment.getPostId(), imageId);
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

    /**
     * Update post or comment title, content, tag or image
     * @param postId post id of the post or comment that need to update
     * @param userId user id of the user that creates the post or comment
     * @param title new title of the post, null if user does need to update
     * @param content new content of the post or comment, null if user does not need update
     * @param tag new tag of the post, null if user does need to update, empty string if user wants to delete tag
     * @param image new image of the post or comment, null if user does not need update, empty image if user wants to delete image
     * @param attachTo 0 if it is a post, post id if it is a comment, can only change from non-zero to non-zero
     * @throws Exception
     */
    @Transactional
    public void updatePostOrComment(String postId, String userId, String title, String content, String tag, MultipartFile image, String attachTo) throws Exception {
        Optional<PostModel> postModelOptional = forumRepository.findById(Integer.parseInt(postId));
        PostModel postModel = postModelOptional.get();
        if (Integer.parseInt(userId) != postModel.getUserId()) {
            throw new ExceptionService("The post or comment is not created by that user");
        }

        if (!postModel.getIsActive()) {
            throw new ExceptionService("The post or comment is not active");
        }

        if (content != null) postModel.setContent(content);
        if (postModel.getAttachTo() == 0) {
            // post
            if (title != null) postModel.setTitle(title);
            if (tag != null) {
                forumRepository.deleteTagInPost(Integer.parseInt(postId));
                addTag(Integer.parseInt(postId), tag);
            }
        }
        else {
            // comment
            if (Integer.parseInt(attachTo) != 0) {
                int removeCommentCount = postModel.getCommentCount() + 1;
                forumRepository.removeCommentCountByNum(postModel.getAttachTo(), removeCommentCount);

                PostModel parent = forumRepository.findById(postModel.getAttachTo()).get();
                while (parent.getAttachTo() != 0) {
                    forumRepository.removeCommentCountByNum(parent.getAttachTo(), removeCommentCount);
                    parent = forumRepository.findById(parent.getAttachTo()).get();
                }

                postModel.setAttachTo(Integer.parseInt(attachTo));
                forumRepository.addCommentCountByNum(Integer.parseInt(attachTo), removeCommentCount);

                parent = forumRepository.findById(Integer.parseInt(attachTo)).get();
                while (parent.getAttachTo() != 0) {
                    forumRepository.addCommentCountByNum(parent.getAttachTo(), removeCommentCount);
                    parent = forumRepository.findById(parent.getAttachTo()).get();
                }
            }
            else {
                throw new ExceptionService("Cannot make a comment become a post");
            }
        }

        if (image != null) {
            if (image.isEmpty()) {
                deleteImage(Integer.parseInt(postId));
            }
            else {
                Integer imageId = forumRepository.findImageId(Integer.parseInt(postId));
                if (imageId == null) {
                    // Add new image
                    imageId = imageService.saveImage(image);
                    forumRepository.connectPostWithImage(Integer.parseInt(postId), imageId);
                }
                else {
                    // Change image
                    imageService.changeImage(image, imageId);
                }
            }
        }
        postModel.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        forumRepository.save(postModel);
    }

    /**
     * Add tag for post with given post id
     * @param postId postId int
     * @param tag tag string
     */
    private void addTag(int postId, String tag) {
        Integer tagId = forumRepository.getTagIdFromTagName(tag);
        if (tagId != null) {
            forumRepository.connectPostWithTag(postId, tagId);
        }
    }

    /**
     * Set post or comment is_active to false, delete image and tag in the database
     * @param postId post id of the post or comment that user want to delete
     * @param userId user id of user who wants to delete the post or comment
     * @throws Exception
     */
    @Transactional
    public void deletePostOrComment(String postId, String userId) throws Exception {
        Optional<PostModel> postModelOptional = forumRepository.findById(Integer.parseInt(postId));
        PostModel postModel = postModelOptional.get();
        if (Integer.parseInt(userId) != postModel.getUserId()) {
            throw new ExceptionService("The post or comment is not created by that user");
        }

        if (!postModel.getIsActive()) {
            throw new ExceptionService("The post or comment is not active");
        }

        postModel.setIsActive(false);
        deleteImage(Integer.parseInt(postId));

        if (postModel.getAttachTo() == 0) {
            // Post
            forumRepository.deleteTagInPost(Integer.parseInt(postId));
        }
        else {
            // Comment
            forumRepository.minusCommentCountByOne(postModel.getAttachTo());
            PostModel parent = forumRepository.findById(postModel.getAttachTo()).get();
            
            while (parent.getAttachTo() != 0) {
                forumRepository.minusCommentCountByOne(parent.getAttachTo());
                parent = forumRepository.findById(parent.getAttachTo()).get();
            }
        }

        postModel.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        forumRepository.save(postModel);
    }
    
    /**
     * Delete data in Post_Image and Image_Data
     * @param postId
     */
    private void deleteImage(int postId) {
        Integer imageId = forumRepository.findImageId(postId);
        if (imageId != null) {
            forumRepository.deleteInPostImage(imageId);
            forumRepository.deleteInImageData(imageId);
        }
    }
}
