package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import project.flowchat.backend.Model.PostModel;
import project.flowchat.backend.DTO.PostDTO;
import project.flowchat.backend.Repository.ForumRepository;
import project.flowchat.backend.Repository.UserAccountRepository;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@AllArgsConstructor
@Service
public class ForumService {

    @Autowired
    private final ForumRepository forumRepository;
    private final UserAccountRepository userAccountRepository;
    private final ImageService imageService;
    private final SecurityService securityService;

    /**
     * Convert post data from database (PostModel) to Java Object (PostDTO)
     * @param post post data from database (PostModel)
     * @param viewUserId the user who is viewing the post
     * @return post data Java Object (PostDTO)
     */
    private PostDTO createPostDTO(PostModel post, Integer viewUserId) {
        if (post == null) {
            return null;
        }
        PostDTO postDTO = new PostDTO();
        Integer postId = post.getPostId();

        postDTO.setPostId(postId);
        postDTO.setUsername(userAccountRepository.findUsernameByUserId(post.getUserId()));
        postDTO.setTitle(post.getTitle());
        postDTO.setContent(post.getContent());

        List<Integer> imageIdList = forumRepository.findImageIdByPostId(postId);
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
        postDTO.setIsLiked(forumRepository.isLikeClick(postId, viewUserId) != null);

        postDTO.setDislikeCount(post.getDislikeCount());
        postDTO.setIsDisliked(forumRepository.isDislikeClick(postId, viewUserId) != null);

        postDTO.setCommentCount(post.getCommentCount());
        postDTO.setUpdatedAt(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(post.getUpdatedAt()));
        postDTO.setCommentList(null);

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
                // There may be multiple images in a post or comment, use forumRepository.findImageIdByPostId(postId);
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

    /**
     * Get a list of latest post previews for a user
     * @param userId userId Integer
     * @param postNum required number of post previews
     * @return latest post preview list
     * @throws Exception any exception
     */
    public List<PostDTO> getLatestPostPreviewList(Integer userId, Integer postNum) throws Exception {
        securityService.checkUserIdWithToken(userId);
        List<PostModel> postModelList = forumRepository.findLatestActivePostByRange(userId, postNum);
        List<PostDTO> postPreviewModelList = new ArrayList<>();
        for (PostModel post : postModelList) {
            PostDTO postPreview = createPostDTO(post, userId);
            postPreviewModelList.add(postPreview);
        }
        return postPreviewModelList;
    }

    /**
     * generate post previews of different post tags and post types
     * @param postType string : "popular" or "latest" or "random"
     * @param userId userId Integer
     * @param tagId tagId Integer
     * @param queryPostNum number of queries made in the database
     * @param requiredPostNum actual required number
     * @param hashSet to prevent any repeated post preview
     * @return a list of post previews
     */
    private List<PostDTO> generatePostPreviewListByTagRecommendation(String postType, Integer userId, Integer tagId, int queryPostNum, int requiredPostNum, HashSet<Integer> hashSet) {
        List<PostDTO> postPreviewModelList = new ArrayList<>();
        List<PostModel> tagPostList;
        int count = 0;
        tagPostList = switch (postType) {
            case "popular" -> forumRepository.findPopularActivePostByRangeAndTag(userId, tagId, queryPostNum);
            case "latest" -> forumRepository.findLatestActivePostByRangeAndTag(userId, tagId, queryPostNum);
            default -> forumRepository.findPopularActivePostByRange(userId, queryPostNum);
        };
        for (PostModel post : tagPostList) {
            Integer postId = post.getPostId();
            if (!hashSet.contains(postId)) {
                PostDTO postPreview = createPostDTO(post, userId);
                postPreviewModelList.add(postPreview);
                hashSet.add(postId);
                count++;
            }
            if (count == requiredPostNum) {
                break;
            }
        }
        return postPreviewModelList;
    }

    /**
     * Get a list of recommended post previews for a user
     * @param userId userId Integer
     * @param postNum required number of post previews
     * @return recommended post preview list
     * @throws Exception any exception
     */
    public List<PostDTO> getRecommendedPostPreviewList(Integer userId, Integer postNum) throws Exception {
        securityService.checkUserIdWithToken(userId);
        List<PostDTO> postPreviewModelList = new ArrayList<>();
        List<Integer> topTwoTagId = forumRepository.findRecommendedTagByHighestScore(userId);
        HashSet<Integer> hashSet = new HashSet<>();
        if (topTwoTagId.size() == 2) {
            Integer firstTagId = topTwoTagId.get(0);
            Integer secondTagId = topTwoTagId.get(1);
            int latestFirstTagPostNum = postNum / 2 / 2;
            int popularFirstTagPostNum = postNum / 2 - latestFirstTagPostNum;
            int latestSecondTagPostNum = postNum * 3 / 10 / 2;
            int popularSecondTagPostNum = postNum * 3 / 10 - latestSecondTagPostNum;

            List<PostDTO> popularPostPreviewModelList = new ArrayList<>();
            popularPostPreviewModelList.addAll(generatePostPreviewListByTagRecommendation("popular", userId, firstTagId, popularFirstTagPostNum, popularFirstTagPostNum, hashSet));
            popularPostPreviewModelList.addAll(generatePostPreviewListByTagRecommendation("popular", userId, secondTagId, popularFirstTagPostNum * 2, popularSecondTagPostNum, hashSet));
            Collections.shuffle(popularPostPreviewModelList);

            List<PostDTO> latestPostPreviewModelList = new ArrayList<>();
            latestPostPreviewModelList.addAll(generatePostPreviewListByTagRecommendation("latest", userId, firstTagId, popularFirstTagPostNum * 3, latestFirstTagPostNum, hashSet));
            latestPostPreviewModelList.addAll(generatePostPreviewListByTagRecommendation("latest", userId, secondTagId, popularFirstTagPostNum * 4, latestSecondTagPostNum, hashSet));
            Collections.shuffle(latestPostPreviewModelList);

            postPreviewModelList.addAll(popularPostPreviewModelList);
            postPreviewModelList.addAll(latestPostPreviewModelList);

            int remainingPostNum = postNum - postPreviewModelList.size();
            Random random = new Random();
            List<PostDTO> randomPopularPostPreviewModelList = generatePostPreviewListByTagRecommendation("random", userId, null, popularFirstTagPostNum * 5, remainingPostNum, hashSet);
            for (PostDTO postPreview : randomPopularPostPreviewModelList) {
                postPreviewModelList.add(random.nextInt(postPreviewModelList.size() + 1), postPreview);
            }
        }
        else {
            postPreviewModelList.addAll(generatePostPreviewListByTagRecommendation("random", userId, null, postNum, postNum, hashSet));
            Collections.shuffle(postPreviewModelList);
        }

        return postPreviewModelList;
    }

    /**
     * Get a list of following post previews for a user
     * @param userId userId Integer
     * @param postNum required number of post previews
     * @return following post preview list
     * @throws Exception any exception
     */
    public List<PostDTO> getFollowingPostPreviewList(Integer userId, Integer postNum) throws Exception {
        securityService.checkUserIdWithToken(userId);
        List<PostModel> postModelList = forumRepository.findFollowingActivePostByRange(userId, postNum);
        List<PostDTO> postPreviewModelList = new ArrayList<>();
        for (PostModel post : postModelList) {
            PostDTO postPreview = createPostDTO(post, userId);
            postPreviewModelList.add(postPreview);
        }
        return postPreviewModelList;
    }

    /**
     * Get the post data by postId
     * @param postId postId Integer
     * @param userId userId Integer
     * @return a post data
     * @throws Exception any exception
     */
    public PostDTO getPostContentByPostId(Integer postId, Integer userId) throws Exception {
        securityService.checkUserIdWithToken(userId);
        PostModel post = forumRepository.findPostByPostId(postId);
        return createPostDTO(post, userId);
    }

    /**
     * Get all comments of a post, the maximum comment layers is 2 (with sub-comment only)
     * @param postId postId Integer
     * @param userId userId Integer
     * @return a comment list, with a sub comment list for each comment
     * @throws Exception any exception
     */
    public List<PostDTO> getCommentByPostId(Integer postId, Integer userId) throws Exception {
        securityService.checkUserIdWithToken(userId);

        List<PostDTO> commentList = new ArrayList<>();
        List<PostModel> commentModelList = forumRepository.findActivePostCommentByAttachTo(postId, userId);
        if (!commentModelList.isEmpty()) {
            for (PostModel commentData : commentModelList) {
                PostDTO comment = createPostDTO(commentData, userId);
                comment.setTitle(null);

                Integer commentId = commentData.getPostId();
                List<PostDTO> subCommentList = new ArrayList<>();
                List<PostModel> subCommentModelList = forumRepository.findActivePostCommentByAttachTo(commentId, userId);
                if (!subCommentModelList.isEmpty()) {
                    for (PostModel subCommentData : subCommentModelList) {
                        PostDTO subComment = createPostDTO(subCommentData, userId);
                        subComment.setTitle(null);
                        subCommentList.add(subComment);
                    }
                }
                else {
                    subCommentList = null;
                }

                comment.setCommentList(subCommentList);
                commentList.add(comment);
            }
        }
        else {
            commentList = null;
        }
        return commentList;
    }

    /**
     * Delete data in Post_Image and Image_Data
     * @param postId postId int
     */
    private void deleteImage(int postId) {
        // There may be multiple images in a post or comment, use forumRepository.findImageIdByPostId(postId);
        Integer imageId = forumRepository.findImageId(postId);
        if (imageId != null) {
            forumRepository.deleteInPostImage(imageId);
            forumRepository.deleteInImageData(imageId);
        }
    }

    /**
     * Check if user can like or dislike that post or comment. If yes, like or dislike that post or comment. If no, throw an exception
     * @param postId post id of the post or comment that user want to like or dislike
     * @param userId user id of the user
     * @param action like or dislike
     * @throws Exception
     */
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

    /**
     * Check if user can unlike or undislike that post or comment. If yes, unlike or undislike that post or comment. If no, throw an exception
     * @param postId post id of the post or comment that user want to unlike or undislike
     * @param userId user id of the user
     * @param action unlike or undislike
     * @throws Exception
     */
    public void unlikeOrUndislike(int postId, int userId, String action) throws Exception{
        securityService.checkUserIdWithToken(userId);
        if (action.equals("unlike")) {
            if (forumRepository.isLikeClick(postId, userId) == null) {
                throw new ExceptionService("User has not liked that post/comment before");
            }
            forumRepository.removeLikeRelationship(postId, userId);
            forumRepository.minusLikeCount(postId);
        }
        else if (action.equals("undislike")) {
            if (forumRepository.isDislikeClick(postId, userId) == null) {
                throw new ExceptionService("User has not disliked that post/comment before");
            }
            forumRepository.removeDislikeRelationship(postId, userId);
            forumRepository.minusDislikeCount(postId);
        }
        else {
            throw new ExceptionService("Action not available: " + action);
        }
    }
}
