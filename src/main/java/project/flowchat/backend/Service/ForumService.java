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

import static java.lang.Integer.max;

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
    public void createPostOrComment(Integer userId, String title, String content, List<String> tag, MultipartFile image, Integer attachTo) throws Exception {
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
     * @param userId userId Integer
     * @param title title string
     * @param content content string
     * @param attachTo attachTo Integer
     * @return the corresponding record in the database
     */
    private PostModel addPostOrCommentToDatabase(Integer userId, String title, String content, Integer attachTo) {
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
     * @throws Exception INVALID_POST_CREATOR, POST_DELETED, MAKE_COMMENT_TO_A_POST
     */
    @Transactional
    public void updatePostOrComment(Integer postId, Integer userId, String title, String content, List<String> tag, MultipartFile image, Integer attachTo) throws Exception {
        securityService.checkUserIdWithToken(userId);

        Optional<PostModel> postModelOptional = forumRepository.findById(postId);
        PostModel postModel = postModelOptional.get();
        if (userId != postModel.getUserId()
        && ((String) securityService.getClaims().get("role")).equals("user")) {
            ExceptionService.throwException(ExceptionService.INVALID_POST_CREATOR);
        }

        if (!postModel.getIsActive()) {
            ExceptionService.throwException(ExceptionService.POST_DELETED);
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
        else if (attachTo != null && attachTo == 0) {
            ExceptionService.throwException(ExceptionService.MAKE_COMMENT_TO_A_POST);
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
     * @param postId postId Integer
     * @param tag tag list of string
     */
    private void addTag(Integer postId, List<String> tag) {
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
     * @throws Exception INVALID_POST_CREATOR, POST_DELETED
     */
    @Transactional
    public void deletePostOrComment(Integer postId, Integer userId) throws Exception {
        securityService.checkUserIdWithToken(userId);
        Optional<PostModel> postModelOptional = forumRepository.findById(postId);
        PostModel postModel = postModelOptional.get();

        if (userId != postModel.getUserId()
        && ((String) securityService.getClaims().get("role")).equals("user")) {
            ExceptionService.throwException(ExceptionService.INVALID_POST_CREATOR);
        }

        if (!postModel.getIsActive()) {
            ExceptionService.throwException(ExceptionService.POST_DELETED);
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
     * Get a list of latest post previews from the lastPostId for a user
     * @param userId userId Integer
     * @param excludingPostIdList a list of postId that have already retrieved
     * @param postNum required number of post previews
     * @return latest post preview list
     * @throws Exception any exception
     */
    public List<PostDTO> getLatestPostPreviewList(Integer userId, List<Integer> excludingPostIdList, Integer postNum) throws Exception {
        securityService.checkUserIdWithToken(userId);
        List<PostModel> postModelList = forumRepository.findLatestActivePostByRange(userId, excludingPostIdList, postNum);
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
     * @param excludingPostIdList a list of postId that have already retrieved
     * @param requiredPostNum actual required number
     * @return a list of post previews
     */
    private List<PostDTO> generatePostPreviewListByTagRecommendation(String postType, Integer userId, Integer tagId, List<Integer> excludingPostIdList, int requiredPostNum) {
        List<PostDTO> postPreviewModelList = new ArrayList<>();
        List<PostModel> tagPostList;
        tagPostList = switch (postType) {
            case "popular" -> forumRepository.findPopularActivePostByRangeAndTag(userId, tagId, excludingPostIdList, requiredPostNum);
            case "latest" -> forumRepository.findLatestActivePostByRangeAndTag(userId, tagId, excludingPostIdList, requiredPostNum);
            default -> forumRepository.findPopularActivePostByRange(userId, excludingPostIdList, requiredPostNum);
        };
        for (PostModel post : tagPostList) {
            PostDTO postPreview = createPostDTO(post, userId);
            postPreviewModelList.add(postPreview);
        }
        return postPreviewModelList;
    }

    /**
     * Add the new generated postId in the get preview list to the excludingPostIdList to prevent repeated posts
     * @param postPreviewModelList postPreviewModelList newly generated post preview list
     * @param excludingPostIdList excludingPostIdList
     * @return new excludingPostIdList
     */
    private List<Integer> addExcludingPostIdList(List<PostDTO> postPreviewModelList, List<Integer> excludingPostIdList) {
        for (PostDTO post : postPreviewModelList) {
            excludingPostIdList.add(post.getPostId());
        }
        return excludingPostIdList;
    }

    /**
     * Get a list of recommended post previews for a user
     * @param userId userId Integer
     * @param excludingPostIdList a list of postId that have already retrieved
     * @param postNum required number of post previews
     * @return recommended post preview list
     * @throws Exception any exception
     */
    public List<PostDTO> getRecommendedPostPreviewList(Integer userId, List<Integer> excludingPostIdList, Integer postNum) throws Exception {
        securityService.checkUserIdWithToken(userId);
        List<PostDTO> postPreviewModelList = new ArrayList<>();
        List<Integer> topTwoTagId = forumRepository.findRecommendedTagByHighestScore(userId);
        if (topTwoTagId.size() == 2) {
            Integer firstTagId = topTwoTagId.get(0);
            Integer secondTagId = topTwoTagId.get(1);
            List<PostDTO> list;
            int latestFirstTagPostNum = postNum / 2 / 2;
            int popularFirstTagPostNum = max(1, postNum / 2 - latestFirstTagPostNum);
            int latestSecondTagPostNum = postNum * 3 / 10 / 2;
            int popularSecondTagPostNum = postNum * 3 / 10 - latestSecondTagPostNum;

            List<PostDTO> popularPostPreviewModelList = new ArrayList<>();

            list = generatePostPreviewListByTagRecommendation("popular", userId, firstTagId, excludingPostIdList, popularFirstTagPostNum);
            excludingPostIdList = addExcludingPostIdList(list, excludingPostIdList);
            popularPostPreviewModelList.addAll(list);

            list = generatePostPreviewListByTagRecommendation("popular", userId, secondTagId, excludingPostIdList, popularSecondTagPostNum);
            excludingPostIdList = addExcludingPostIdList(list, excludingPostIdList);
            popularPostPreviewModelList.addAll(list);

            Collections.shuffle(popularPostPreviewModelList);

            List<PostDTO> latestPostPreviewModelList = new ArrayList<>();

            list = generatePostPreviewListByTagRecommendation("latest", userId, firstTagId, excludingPostIdList, latestFirstTagPostNum);
            excludingPostIdList = addExcludingPostIdList(list, excludingPostIdList);
            latestPostPreviewModelList.addAll(list);

            list = generatePostPreviewListByTagRecommendation("latest", userId, secondTagId, excludingPostIdList, latestSecondTagPostNum);
            excludingPostIdList = addExcludingPostIdList(list, excludingPostIdList);
            latestPostPreviewModelList.addAll(list);

            Collections.shuffle(latestPostPreviewModelList);

            postPreviewModelList.addAll(popularPostPreviewModelList);
            postPreviewModelList.addAll(latestPostPreviewModelList);

            int remainingPostNum = postNum - postPreviewModelList.size();
            Random random = new Random();
            List<PostDTO> randomPopularPostPreviewModelList = generatePostPreviewListByTagRecommendation("random", userId, null, excludingPostIdList, remainingPostNum);
            for (PostDTO postPreview : randomPopularPostPreviewModelList) {
                postPreviewModelList.add(random.nextInt(postPreviewModelList.size() + 1), postPreview);
            }
        }
        else {
            postPreviewModelList.addAll(generatePostPreviewListByTagRecommendation("random", userId, null, excludingPostIdList, postNum));
            Collections.shuffle(postPreviewModelList);
        }

        return postPreviewModelList;
    }

    /**
     * Get a list of following post previews for a user
     * @param userId userId Integer
     * @param excludingPostIdList a list of postId that have already retrieved
     * @param postNum required number of post previews
     * @return following post preview list
     * @throws Exception any exception
     */
    public List<PostDTO> getFollowingPostPreviewList(Integer userId, List<Integer> excludingPostIdList, Integer postNum) throws Exception {
        securityService.checkUserIdWithToken(userId);
        List<PostModel> postModelList = forumRepository.findFollowingActivePostByRange(userId, excludingPostIdList, postNum);
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
     * @param postId postId Integer
     */
    private void deleteImage(Integer postId) {
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
     * @throws Exception ALREADY_LIKED_THAT_POST, ALREADY_DISLIKED_THAT_POST, POST_DELETED, INVALID_POST_OPTION
     */
    public void likeOrDislike(Integer postId, Integer userId, String action) throws Exception{
        securityService.checkUserIdWithToken(userId);
        if (forumRepository.isLikeClick(postId, userId) != null) {
            ExceptionService.throwException(ExceptionService.ALREADY_LIKED_THIS_POST);
        }
        if (forumRepository.isDislikeClick(postId, userId) != null) {
            ExceptionService.throwException(ExceptionService.ALREADY_DISLIKED_THIS_POST);
        }
        if (forumRepository.postOrCommentIsActive(postId) == false) {
            ExceptionService.throwException(ExceptionService.POST_DELETED);
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
            ExceptionService.throwException(ExceptionService.INVALID_POST_OPTION);
        }
    }

    /**
     * Check if user can unlike or undislike that post or comment. If yes, unlike or undislike that post or comment. If no, throw an exception
     * @param postId post id of the post or comment that user want to unlike or undislike
     * @param userId user id of the user
     * @param action unlike or undislike
     * @throws Exception POST_DELETED, POST_NOT_LIKED, POST_NOT_DISLIKED, INVALID_POST_OPTION
     */
    public void unlikeOrUndislike(Integer postId, Integer userId, String action) throws Exception{
        securityService.checkUserIdWithToken(userId);
        if (forumRepository.postOrCommentIsActive(postId) == false) {
            ExceptionService.throwException(ExceptionService.POST_DELETED);
        }
        if (action.equals("unlike")) {
            if (forumRepository.isLikeClick(postId, userId) == null) {
                ExceptionService.throwException(ExceptionService.POST_NOT_LIKED);
            }
            forumRepository.removeLikeRelationship(postId, userId);
            forumRepository.minusLikeCount(postId);
        }
        else if (action.equals("undislike")) {
            if (forumRepository.isDislikeClick(postId, userId) == null) {
                ExceptionService.throwException(ExceptionService.POST_NOT_DISLIKED);
            }
            forumRepository.removeDislikeRelationship(postId, userId);
            forumRepository.minusDislikeCount(postId);
        }
        else {
            ExceptionService.throwException(ExceptionService.INVALID_POST_OPTION);
        }
    }

    /**
     * Get a list of popular post previews from lastPostId containing the case-insensitive keywords for a user
     * @param userId userId Integer
     * @param keyword keyword case-insensitive String
     * @param excludingPostIdList a list of postId that have already retrieved
     * @param searchNum required number of post previews
     * @return popular post preview list
     * @throws Exception any exception
     */
    public List<PostDTO> searchPost(Integer userId, String keyword, List<Integer> excludingPostIdList, Integer searchNum) throws Exception {
        securityService.checkUserIdWithToken(userId);
        keyword = "%" + keyword + "%";
        List<PostModel> postModelList = forumRepository.findPopularActivePostByRangeAndKeyword(userId, keyword, excludingPostIdList, searchNum);
        List<PostDTO> postPreviewModelList = new ArrayList<>();
        for (PostModel post : postModelList) {
            PostDTO postPreview = createPostDTO(post, userId);
            postPreviewModelList.add(postPreview);
        }
        return postPreviewModelList;
    }

    public List<Map<String, Object>> getAllTag() throws Exception {
        List<Map<String, Object>> tagList = new ArrayList<>();
        List<List<String>> tagIdAndNameList = forumRepository.findAllTagName();
        for (List<String> list : tagIdAndNameList) {
            Map<String, Object> tag = new HashMap<>();
            tag.put("tagId", list.get(0));
            tag.put("tagName", list.get(1));
            tagList.add(tag);
        }
        return tagList;
    }
}
