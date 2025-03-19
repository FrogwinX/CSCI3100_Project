package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import project.flowchat.backend.DTO.PostContentDTO;
import project.flowchat.backend.Model.PostModel;
import project.flowchat.backend.DTO.PostDTO;
import project.flowchat.backend.DTO.PostPreviewDTO;
import project.flowchat.backend.Repository.ForumRepository;
import project.flowchat.backend.Repository.UserAccountRepository;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static java.lang.Integer.min;

@AllArgsConstructor
@Service
public class ForumService {

    @Autowired
    private final ForumRepository forumRepository;
    private final UserAccountRepository userAccountRepository;
    private final ImageService imageService;
    private final SecurityService securityService;

    /* This hashPostSet is used to avoid any repeated post preview in get post preview list */
    private HashSet<Integer> hashPostSet;

    /**
     * Map data from PostModel (Database) to PostDTO (API Response Body)
     * @param post any unbanned post
     * @param viewUserId viewUserId
     * @param postDTO any subclass of PostDTO for type up-casting
     * @return a parent type PostDTO object for type down-casting
     */
    private PostDTO setPostDTO(PostModel post, Integer viewUserId, PostDTO postDTO) {
        Integer postId = post.getPostId();

        postDTO.setPostId(postId);
        postDTO.setUsername(userAccountRepository.findUsernameByUserId(post.getUserId()));
        postDTO.setTitle(post.getTitle());

        List<Integer> imageIdList = forumRepository.findPostImageIdByPostId(postId);
        if (!imageIdList.isEmpty()) {
            List<String> imageAPIList = new ArrayList<>();
            for (Integer imageId : imageIdList) {
                imageAPIList.add(imageService.deploymentGetImageAPI + imageId);
            }
            postDTO.setImageAPIList(imageAPIList);
        }
        else {
            postDTO.setImageAPIList(null);
        }

        List<String> tagNameList = forumRepository.findPostTagNameByPostId(postId);
        if (!tagNameList.isEmpty()) {
            postDTO.setTagNameList(tagNameList);
        }
        else {
            postDTO.setTagNameList(null);
        }

        postDTO.setLikeCount(post.getLikeCount());
        postDTO.setIsLiked(forumRepository.countLikeByUserIdAndPostId(postId, viewUserId) == 1);

        postDTO.setDislikeCount(post.getDislikeCount());
        postDTO.setIsDisliked(forumRepository.countDislikeByUserIdAndPostId(postId, viewUserId) == 1);

        postDTO.setCommentCount(post.getCommentCount());
        postDTO.setUpdatedAt(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(post.getUpdatedAt()));

        return postDTO;
    }

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
    public void createPostOrComment(int userId, String title, String content, List<String> tag, MultipartFile image, int attachTo) throws Exception {
        securityService.checkUserIdWithToken(userId);
        Integer imageId = null;
        if (image != null) {
            imageId = imageService.saveImage(image);
        }

        PostModel postOrComment;
        if (attachTo == 0) {
            // Post
            postOrComment = addPostOrCommentToDatabase(userId, title, content, attachTo);
            addTag(postOrComment.getPostId(), tag);
        }
        else {
            // Comment
            postOrComment = addPostOrCommentToDatabase(userId, null, content, attachTo);
            forumRepository.addCommentCountByOne(attachTo);
            PostModel parent = forumRepository.findById(attachTo).get();
            while (parent.getAttachTo() != 0) {
                forumRepository.addCommentCountByOne(parent.getAttachTo());
                parent = forumRepository.findById(parent.getAttachTo()).get();
            }
        }
        if (imageId != null) {
            forumRepository.connectPostWithImage(postOrComment.getPostId(), imageId);
        }

    }

    /**
     * add a new record to FORUM.Post
     * @param userId userId int
     * @param title title string
     * @param content content string
     * @param attachTo attachTo int
     * @return the corresponding record in the database
     */
    private PostModel addPostOrCommentToDatabase(int userId, String title, String content, int attachTo) {
        PostModel postModel = new PostModel();
        postModel.setUserId(userId);
        postModel.setTitle(title);
        postModel.setContent(content);
        postModel.setLikeCount(0);
        postModel.setDislikeCount(0);
        postModel.setCommentCount(0);
        postModel.setAttachTo(attachTo);
        postModel.setIsActive(true);
        postModel.setCreatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        postModel.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        return forumRepository.save(postModel);
    }

    /**
     * Update post or comment title, content, tag or image, set value to null if user does not need to update that value
     * @param postId post id of the post or comment that need to update
     * @param userId user id of the user that creates the post or comment
     * @param title new title of the post
     * @param content new content of the post or comment
     * @param tag new tag of the post, empty list if user wants to delete tag
     * @param image new image of the post or comment, empty image if user wants to delete image
     * @param attachTo new post id if it is a comment, can only change from non-zero to non-zero
     * @throws Exception
     */
    @Transactional
    public void updatePostOrComment(int postId, int userId, String title, String content, List<String> tag, MultipartFile image, Integer attachTo) throws Exception {
        securityService.checkUserIdWithToken(userId);

        Optional<PostModel> postModelOptional = forumRepository.findById(postId);
        PostModel postModel = postModelOptional.get();
        if (userId != postModel.getUserId()
        && ((String) securityService.getClaims().get("role")).equals("user")) {
            throw new ExceptionService("The post/comment is not created by that user");
        }

        if (!postModel.getIsActive()) {
            throw new ExceptionService("The post/comment is not active");
        }

        if (content != null) postModel.setContent(content);
        if (postModel.getAttachTo() == 0) {
            // post
            if (title != null) postModel.setTitle(title);
            if (tag != null) {
                forumRepository.deleteTagInPost(postId);
                addTag(postId, tag);
            }
        }
        else if (attachTo != null && attachTo != 0) {
            // comment
            int removeCommentCount = postModel.getCommentCount() + 1;
            forumRepository.removeCommentCountByNum(postModel.getAttachTo(), removeCommentCount);

            PostModel parent = forumRepository.findById(postModel.getAttachTo()).get();
            while (parent.getAttachTo() != 0) {
                forumRepository.removeCommentCountByNum(parent.getAttachTo(), removeCommentCount);
                parent = forumRepository.findById(parent.getAttachTo()).get();
            }

            postModel.setAttachTo(attachTo);
            forumRepository.addCommentCountByNum(attachTo, removeCommentCount);

            parent = forumRepository.findById(attachTo).get();
            while (parent.getAttachTo() != 0) {
                forumRepository.addCommentCountByNum(parent.getAttachTo(), removeCommentCount);
                parent = forumRepository.findById(parent.getAttachTo()).get();
            }
        }
        else if (attachTo != null && attachTo == 0){
            throw new ExceptionService("Cannot make a comment become a post");
        }


        if (image != null) {
            if (image.isEmpty()) {
                deleteImage(postId);
            }
            else {
                Integer imageId = forumRepository.findImageId(postId);
                if (imageId == null) {
                    // Add new image
                    imageId = imageService.saveImage(image);
                    forumRepository.connectPostWithImage(postId, imageId);
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
     * @param tag tag list of string
     */
    private void addTag(int postId, List<String> tag) {
        Integer tagId;
        for (String oneTag: tag) {
            tagId = forumRepository.getTagIdFromTagName(oneTag);
            if (tagId != null) {
                forumRepository.connectPostWithTag(postId, tagId);
            }
        }
    }

    /**
     * Set post or comment is_active to false, delete image and tag in the database
     * @param postId post id of the post or comment that user want to delete
     * @param userId user id of user who wants to delete the post or comment
     * @throws Exception
     */
    @Transactional
    public void deletePostOrComment(int postId, int userId) throws Exception {
        securityService.checkUserIdWithToken(userId);
        Optional<PostModel> postModelOptional = forumRepository.findById(postId);
        PostModel postModel = postModelOptional.get();

        if (userId != postModel.getUserId()
        && ((String) securityService.getClaims().get("role")).equals("user")) {
            throw new ExceptionService("The post/comment is not created by that user");
        }

        if (!postModel.getIsActive()) {
            throw new ExceptionService("The post/comment is not active");
        }

        postModel.setIsActive(false);
        deleteImage(postId);

        if (postModel.getAttachTo() == 0) {
            // Post
            forumRepository.deleteTagInPost(postId);
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

    public List<PostPreviewDTO> getLatestPostPreviewList(Integer userId, Integer postNumOffset, Integer postNum) throws Exception {
        securityService.checkUserIdWithToken(userId);
        List<PostModel> postModelList = forumRepository.findLatestActivePostByRange(postNumOffset, postNum);
        List<PostPreviewDTO> postPreviewModelList = new ArrayList<>();
        for (PostModel postData : postModelList) {
            if (forumRepository.countBlockByUserIdAndPostId(postData.getPostId(), userId) == 0) {
                PostPreviewDTO postPreview = (PostPreviewDTO) setPostDTO(postData, userId, new PostPreviewDTO());
                postPreview.setDescription(postData.getContent().substring(0, min(postData.getContent().length(), 50)));
                postPreviewModelList.add(postPreview);
            }
        }
        return postPreviewModelList;
    }

    private List<PostPreviewDTO> generatePostPreviewListByTagRecommendation(String postType, Integer userId, Integer tagId, int queryPostNum, int requiredPostNum) {
        List<PostPreviewDTO> postPreviewModelList = new ArrayList<>();
        List<PostModel> tagPostList;
        int count = 0;
        tagPostList = switch (postType) {
            case "popular" -> forumRepository.findPopularActivePostByRangeAndTag(tagId, 0, queryPostNum);
            case "latest" -> forumRepository.findLatestActivePostByRangeAndTag(tagId, 0, queryPostNum);
            default -> forumRepository.findPopularActivePostByRange(0, queryPostNum);
        };
        for (PostModel postData : tagPostList) {
            Integer postId = postData.getPostId();
            if (!hashPostSet.contains(postId)) {
                PostPreviewDTO postPreview = (PostPreviewDTO) setPostDTO(postData, userId, new PostPreviewDTO());
                postPreview.setDescription(postData.getContent().substring(0, min(postData.getContent().length(), 50)));
                postPreviewModelList.add(postPreview);
                hashPostSet.add(postId);
                count++;
            }
            if (count == requiredPostNum) {
                break;
            }
        }
        return postPreviewModelList;
    }

    public List<PostPreviewDTO> getRecommendedPostPreviewList(Integer userId, Integer postNum) throws Exception {
        securityService.checkUserIdWithToken(userId);
        hashPostSet.clear();
        List<PostPreviewDTO> postPreviewModelList = new ArrayList<>();
        List<Integer> topTwoTagId = forumRepository.findRecommendedTagByHighestScore();
        if (topTwoTagId.size() == 2) {
            Integer firstTagId = topTwoTagId.get(0);
            Integer secondTagId = topTwoTagId.get(1);
            int latestFirstTagPostNum = postNum / 2 / 2;
            int popularFirstTagPostNum = postNum / 2 - latestFirstTagPostNum;
            int latestSecondTagPostNum = postNum * 3 / 10 / 2;
            int popularSecondTagPostNum = postNum * 3 / 10 - latestSecondTagPostNum;
            int remainingPostNum = postNum - latestFirstTagPostNum - popularFirstTagPostNum - latestSecondTagPostNum - popularSecondTagPostNum;

            List<PostPreviewDTO> popularPostPreviewModelList = new ArrayList<>();
            popularPostPreviewModelList.addAll(generatePostPreviewListByTagRecommendation("popular", userId, firstTagId, popularFirstTagPostNum, popularFirstTagPostNum));
            popularPostPreviewModelList.addAll(generatePostPreviewListByTagRecommendation("popular", userId, secondTagId, popularFirstTagPostNum * 2, popularSecondTagPostNum));
            Collections.shuffle(popularPostPreviewModelList);

            List<PostPreviewDTO> latestPostPreviewModelList = new ArrayList<>();
            latestPostPreviewModelList.addAll(generatePostPreviewListByTagRecommendation("latest", userId, firstTagId, popularFirstTagPostNum * 3, latestFirstTagPostNum));
            latestPostPreviewModelList.addAll(generatePostPreviewListByTagRecommendation("latest", userId, secondTagId, popularFirstTagPostNum * 4, latestSecondTagPostNum));
            Collections.shuffle(latestPostPreviewModelList);

            postPreviewModelList.addAll(popularPostPreviewModelList);
            postPreviewModelList.addAll(latestPostPreviewModelList);

            Random random = new Random();
            List<PostPreviewDTO> randomPopularPostPreviewModelList = generatePostPreviewListByTagRecommendation("random", userId, null, popularFirstTagPostNum * 5, remainingPostNum);
            for (PostPreviewDTO postPreview : randomPopularPostPreviewModelList) {
                postPreviewModelList.add(random.nextInt(postPreviewModelList.size() + 1), postPreview);
            }
        }
        else {
            postPreviewModelList.addAll(generatePostPreviewListByTagRecommendation("random", userId, null, postNum, postNum));
            Collections.shuffle(postPreviewModelList);
        }

        return postPreviewModelList;
    }

    public PostContentDTO getPostContent(Integer postId, Integer userId) throws Exception {
        securityService.checkUserIdWithToken(userId);
        PostModel postModel = forumRepository.findActivePostCommentByPostId(postId);
        PostContentDTO post = (PostContentDTO) setPostDTO(postModel, userId, new PostContentDTO());
        post.setContent(postModel.getContent());

        List<PostModel> commentModelList = forumRepository.findActivePostCommentByAttachTo(postId);
        List<PostContentDTO> commentList = new ArrayList<>();
        if (!commentModelList.isEmpty()) {
            for (PostModel commentData : commentModelList) {
                if (forumRepository.countBlockByUserIdAndPostId(commentData.getPostId(), userId) == 0) {
                    PostContentDTO comment = (PostContentDTO) setPostDTO(commentData, userId, new PostContentDTO());
                    comment.setContent(commentData.getContent());

                    Integer commentId = commentData.getPostId();
                    List<PostModel> subCommentModelList = forumRepository.findActivePostCommentByAttachTo(commentId);
                    List<PostContentDTO> subCommentList = new ArrayList<>();
                    if (!subCommentModelList.isEmpty()) {
                        for (PostModel subCommentData : subCommentModelList) {
                            if (forumRepository.countBlockByUserIdAndPostId(subCommentData.getPostId(), userId) == 0) {
                                PostContentDTO subComment = (PostContentDTO) setPostDTO(subCommentData, userId, new PostContentDTO());
                                subComment.setContent(subCommentData.getContent());
                                subComment.setCommentList(null);
                                subCommentList.add(subComment);
                            }
                        }
                    }
                    else {
                        subCommentList = null;
                    }
                    comment.setCommentList(subCommentList);
                    commentList.add(comment);
                }
            }
        }
        else {
            commentList = null;
        }
        post.setCommentList(commentList);
        return post;
    }

    /**
     * Delete data in Post_Image and Image_Data
     * @param postId postId int
     */
    private void deleteImage(int postId) {
        Integer imageId = forumRepository.findImageId(postId);
        if (imageId != null) {
            forumRepository.deleteInPostImage(imageId);
            forumRepository.deleteInImageData(imageId);
        }
    }

    public void likeOrDislike(int postId, int userId, String action) throws Exception{
        securityService.checkUserIdWithToken(userId);
        if (forumRepository.isLikeClick(postId, userId) != null) {
            throw new ExceptionService("User has liked that post/comment before");
        }
        if (forumRepository.isDislikeClick(postId, userId) != null) {
            throw new ExceptionService("User has disliked that post/comment before");
        }
        if (action.equals("like")) {
            forumRepository.addLikeRelationship(postId, userId);
            forumRepository.addLikeCount(postId);
        }
        else if (action.equals("dislike")) {
            forumRepository.addDislikeRelationship(postId, userId);
            forumRepository.addDislikeCount(postId);
        }
        else {
            throw new ExceptionService("Action not available: " + action);
        }
    }
}
