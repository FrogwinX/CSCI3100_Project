package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import project.flowchat.backend.Model.PostModel;
import project.flowchat.backend.DTO.PostDTO;
import project.flowchat.backend.Repository.ForumRepository;
import project.flowchat.backend.Repository.UserAccountRepository;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static java.lang.Integer.max;
import static java.lang.Integer.min;

@AllArgsConstructor
@Service
public class ForumService {

    @Autowired
    private final ForumRepository forumRepository;
    private final UserAccountRepository userAccountRepository;
    private final ImageService imageService;
    private final ProfileService profileService;
    private final SecurityService securityService;

    public static final String INTERACTION_VIEW = "view";
    public static final String INTERACTION_LIKE = "like";
    public static final String INTERACTION_DISLIKE = "dislike";
    public static final String INTERACTION_UNLIKE = "unlike";
    public static final String INTERACTION_UNDISLIKE = "undislike";
    public static final String INTERACTION_COMMENT = "comment";
    public static final String INTERACTION_POST = "post";
    /**
     * Convert post data from database (PostModel) to Java Object (PostDTO)
     * @param post post data from database (PostModel)
     * @param userIdFrom the user who is viewing the post
     * @return post data Java Object (PostDTO)
     */
    private PostDTO createPostDTO(PostModel post, Integer userIdFrom) {
        if (post == null) {
            return null;
        }
        PostDTO postDTO = new PostDTO();
        Integer postId = post.getPostId();
        Integer userIdTo = post.getUserId();

        postDTO.setPostId(postId);
        postDTO.setUserId(userIdTo);
        postDTO.setUsername(userAccountRepository.findUsernameByUserId(userIdTo));
        postDTO.setAvatar(profileService.getUserAvatarByUserId(userIdTo));
        postDTO.setIsUserBlocked(profileService.isUserBlocking(userIdFrom, userIdTo));
        postDTO.setTitle(post.getTitle());
        postDTO.setContent(post.getContent());

        List<Integer> imageIdList = forumRepository.findImageIdByPostId(postId);
        if (!imageIdList.isEmpty()) {
            List<String> imageAPIList = new ArrayList<>();
            for (Integer imageId : imageIdList) {
                imageAPIList.add(imageService.getImageAPI(imageId));
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
        postDTO.setIsLiked(forumRepository.isLikeClick(postId, userIdFrom) != null);

        postDTO.setDislikeCount(post.getDislikeCount());
        postDTO.setIsDisliked(forumRepository.isDislikeClick(postId, userIdFrom) != null);

        postDTO.setCommentCount(post.getCommentCount());
        postDTO.setUpdatedAt(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(post.getUpdatedAt()));
        postDTO.setCommentList(null);

        updatePostPopularity(post);

        return postDTO;
    }

    /**
     * Save a post or a comment to the database
     * @param userId user id of the user that creates the post or comment
     * @param title title of the post
     * @param content content of the post or comment
     * @param tag tag for the post
     * @param images images of the post or comment, optional
     * @param attachTo 0 if it is a post, post id if it is a comment
     * @throws Exception FILE_NOT_IMAGE
     */
    public void createPostOrComment(Integer userId, String title, String content, List<String> tag, List<MultipartFile> images, Integer attachTo) throws Exception {
        securityService.checkUserIdWithToken(userId);
        List<Integer> allImageId = new ArrayList<Integer>();
        if (images != null) {
            for (MultipartFile image: images) {
                imageService.checkIsImage(image);
            }

            for (MultipartFile image: images) {
                allImageId.add(imageService.saveImage(image));
            }
        }

        PostModel postOrComment;
        if (attachTo == 0) {
            // Post
            postOrComment = addPostOrCommentToDatabase(userId, title, content, attachTo);
            addTag(postOrComment.getPostId(), tag);
            updateRecommendationScore(postOrComment.getPostId(), userId, INTERACTION_POST);
        }
        else {
            // Comment
            postOrComment = addPostOrCommentToDatabase(userId, null, content, attachTo);
            updateRecommendationScore(attachTo, userId, INTERACTION_COMMENT);
            forumRepository.addCommentCountByOne(attachTo);
            PostModel parent = forumRepository.findById(attachTo).get();
            while (parent.getAttachTo() != 0) {
                forumRepository.addCommentCountByOne(parent.getAttachTo());
                parent = forumRepository.findById(parent.getAttachTo()).get();
            }
        }
        if (allImageId.size() != 0) {
            for (Integer singleImageId: allImageId) {
                forumRepository.connectPostWithImage(postOrComment.getPostId(), singleImageId);
            }
        }

    }

    /**
     * Add all recommendation tag relationship for a user
     * @param userId userId Integer
     */
    public void addAllTagsForUserToDatabase(Integer userId) {
        final int TAG_NUM = 25;
        for (int i=1; i<=TAG_NUM; i++) {
            forumRepository.addRecommendationTagIdByUserId(userId, i);
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
        postModel.setViewCount(0);
        postModel.setLikeCount(0);
        postModel.setDislikeCount(0);
        postModel.setCommentCount(0);
        postModel.setPopularityScore(0);
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
     * @param images new images of the post or comment, single empty image if user wants to delete image
     * @param attachTo new post id if it is a comment, can only change from non-zero to non-zero
     * @throws Exception INVALID_POST_CREATOR, POST_DELETED, MAKE_COMMENT_TO_A_POST
     */
    @Transactional
    public void updatePostOrComment(Integer postId, Integer userId, String title, String content, List<String> tag, List<MultipartFile> images, Integer attachTo) throws Exception {
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


        if (images != null) {
            deleteImage(postId);
            if (images.size() != 1 || !images.get(0).isEmpty()) {
                // Save new images
                List<Integer> allImageId = new ArrayList<Integer>();
                for (MultipartFile image: images) {
                    imageService.checkIsImage(image);
                }
        
                for (MultipartFile image: images) {
                    allImageId.add(imageService.saveImage(image));
                }

                for (Integer singleImageId: allImageId) {
                    forumRepository.connectPostWithImage(postId, singleImageId);
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
        List<PostModel> postModelList = forumRepository.findLatestActivePostByRange(excludingPostIdList, postNum);
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
            case "popular" -> forumRepository.findPopularActivePostByRangeAndTag(tagId, excludingPostIdList, requiredPostNum);
            case "latest" -> forumRepository.findLatestActivePostByRangeAndTag(tagId, excludingPostIdList, requiredPostNum);
            default -> forumRepository.findPopularActivePostByRange(excludingPostIdList, requiredPostNum);
        };
        for (PostModel post : tagPostList) {
            PostDTO postPreview = createPostDTO(post, userId);
            postPreviewModelList.add(postPreview);
        }
        return postPreviewModelList;
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

        List<PostDTO> postPreviewlList = new ArrayList<>();
        List<Integer> topFiveTagId = forumRepository.findRecommendedTagByHighestScore(userId);

        excludingPostIdList.addAll(forumRepository.findViewPostListByUserId(userId));

        final double[] postDistribution = {0.3, 0.2, 0.1, 0.1, 0.1};
        for (int i=0; i<postDistribution.length; i++) {
            if (topFiveTagId.size() == i) {
                break;
            }
            Integer tagId = topFiveTagId.get(i);
            int popularPostNum = max(1, (int) (postNum * postDistribution[i]));

            List<PostDTO> popularTagPostList = generatePostPreviewListByTagRecommendation("popular", userId, tagId, excludingPostIdList, popularPostNum);
            for (PostDTO post : popularTagPostList) {
                excludingPostIdList.add(post.getPostId());
            }
            postPreviewlList.addAll(popularTagPostList);

            if (i == 2) {
                Collections.shuffle(postPreviewlList);
            }
        }

        int remainingPostNum = postNum - postPreviewlList.size();
        Random random = new Random();
        List<PostDTO> randomPopularPostPreviewList = generatePostPreviewListByTagRecommendation("random", userId, null, excludingPostIdList, remainingPostNum);
        for (PostDTO postPreview : randomPopularPostPreviewList) {
            postPreviewlList.add(random.nextInt(postPreviewlList.size() + 1), postPreview);
        }

        return postPreviewlList;
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

    public List<PostDTO> getUserPostPreviewList(Integer userIdFrom, Integer userIdTo, List<Integer> excludingPostIdList, Integer postNum) throws Exception {
        securityService.checkUserIdWithToken(userIdFrom);
        List<PostModel> postModelList = forumRepository.findUserActivePostByRange(userIdTo, excludingPostIdList, postNum);
        List<PostDTO> postPreviewModelList = new ArrayList<>();
        for (PostModel post : postModelList) {
            PostDTO postPreview = createPostDTO(post, userIdTo);
            postPreviewModelList.add(postPreview);
        }
        return postPreviewModelList;
    }

    public List<PostDTO> getUserCommentPreviewList(Integer userIdFrom, Integer userIdTo, List<Integer> excludingCommentIdList, Integer commentNum) throws Exception {
        securityService.checkUserIdWithToken(userIdFrom);
        List<PostModel> commentModelList = forumRepository.findUserActiveCommentByRange(userIdTo, excludingCommentIdList, commentNum);
        List<Integer> postIdList = new ArrayList<>();
        HashSet<Integer> postIdHashSet = new HashSet<>();
        for (PostModel comment : commentModelList) {
            PostModel post = forumRepository.findPostByPostId(comment.getAttachTo());
            if (post.getAttachTo() != 0) {
                post = forumRepository.findPostByPostId(post.getAttachTo());
            }
            if (!postIdHashSet.contains(post.getPostId())) {
                postIdList.add(post.getPostId());
                postIdHashSet.add(post.getPostId());
            }
        }

        List<PostDTO> postPreviewModelList = new ArrayList<>();
        for (Integer postId : postIdList) {
            PostDTO postDTO = getPostContentByPostId(postId, userIdFrom);
            postDTO.setCommentList(getCommentByPostId(postId, userIdFrom));
            postPreviewModelList.add(postDTO);
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
        if (forumRepository.isPostView(postId, userId) == null) {
            forumRepository.addViewRelationship(postId, userId);
            forumRepository.addViewCount(postId);
            updateRecommendationScore(postId, userId, INTERACTION_VIEW);
        }
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
        List<PostModel> commentModelList = forumRepository.findActivePostCommentByAttachTo(postId);
        if (!commentModelList.isEmpty()) {
            for (PostModel commentData : commentModelList) {
                PostDTO comment = createPostDTO(commentData, userId);

                Integer commentId = commentData.getPostId();
                List<PostDTO> subCommentList = new ArrayList<>();
                List<PostModel> subCommentModelList = forumRepository.findActivePostCommentByAttachTo(commentId);
                if (!subCommentModelList.isEmpty()) {
                    for (PostModel subCommentData : subCommentModelList) {
                        PostDTO subComment = createPostDTO(subCommentData, userId);
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
        List<Integer> allImageId = forumRepository.findImageIdByPostId(postId);
        for (Integer imageId: allImageId) {
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
        if (action.equals(INTERACTION_LIKE)) {
            forumRepository.addLikeRelationship(postId, userId);
            forumRepository.addLikeCount(postId);
            updateRecommendationScore(postId, userId, INTERACTION_LIKE);
        }
        else if (action.equals(INTERACTION_DISLIKE)) {
            forumRepository.addDislikeRelationship(postId, userId);
            forumRepository.addDislikeCount(postId);
            updateRecommendationScore(postId, userId, INTERACTION_DISLIKE);
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
        if (action.equals(INTERACTION_UNLIKE)) {
            if (forumRepository.isLikeClick(postId, userId) == null) {
                ExceptionService.throwException(ExceptionService.POST_NOT_LIKED);
            }
            forumRepository.removeLikeRelationship(postId, userId);
            forumRepository.minusLikeCount(postId);
            updateRecommendationScore(postId, userId, INTERACTION_UNLIKE);
        }
        else if (action.equals(INTERACTION_UNDISLIKE)) {
            if (forumRepository.isDislikeClick(postId, userId) == null) {
                ExceptionService.throwException(ExceptionService.POST_NOT_DISLIKED);
            }
            forumRepository.removeDislikeRelationship(postId, userId);
            forumRepository.minusDislikeCount(postId);
            updateRecommendationScore(postId, userId, INTERACTION_UNDISLIKE);
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
        List<PostModel> postModelList = forumRepository.findPopularActivePostByRangeAndKeyword(keyword, excludingPostIdList, searchNum);
        List<PostDTO> postPreviewModelList = new ArrayList<>();
        for (PostModel post : postModelList) {
            postPreviewModelList.add(createPostDTO(post, userId));
        }
        return postPreviewModelList;
    }

    /**
     * Get all the tagId and tagName
     * @return a list of all tagId and tagName
     * @throws Exception any Exceptions
     */
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

    /**
     * Update post popularity score by calculating the number of likes, dislikes, comments and views
     * @param post post PostModel
     */
    @Async
    public void updatePostPopularity(PostModel post) {
        int score = 0;
        score += (int) (5 * 5 *  Math.log(post.getLikeCount() + post.getDislikeCount() + 1)); // Like and Dislike
        score += (int) (5 * 7 *  Math.log(0.5 * post.getCommentCount() + 1)); // Comment
        score += (int) (5 * 8 *  Math.log(0.15 * post.getViewCount() + 3)); // View
        int day = (int) ChronoUnit.DAYS.between(post.getUpdatedAt(), ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        score += max(-50, (int) (-0.2 * day * day + 30)); // Time
        forumRepository.updatePostPopularity(post.getPostId(), score);
    }

    /**
     * Update recommendation score by different interaction types
     * @param postId postId Integer
     * @param userId userId Integer
     * @param interactionType INTERACTION_XXX
     */
    @Async
    public void updateRecommendationScore(Integer postId, Integer userId, String interactionType) {
        List<Integer> tagIdList = forumRepository.findTagIdByPostId(postId);
        for (Integer tagId : tagIdList) {
            int score = forumRepository.findRecommendationScore(userId, tagId);
            score = switch (interactionType) {
                case INTERACTION_VIEW -> min(Integer.MAX_VALUE, score + 10);
                case INTERACTION_LIKE -> min(Integer.MAX_VALUE, score + 30);
                case INTERACTION_DISLIKE -> max(0, score - 10);
                case INTERACTION_UNLIKE -> min(Integer.MAX_VALUE, score - 30);
                case INTERACTION_UNDISLIKE -> max(0, score + 10);
                case INTERACTION_COMMENT -> min(Integer.MAX_VALUE, score + 50);
                case INTERACTION_POST -> min(Integer.MAX_VALUE, score + 100);
                default -> score;
            };
            forumRepository.updateRecommendationTime(userId, tagId);
            forumRepository.updateRecommendationScore(userId, tagId, score);
        }
    }

    /**
     * Schedule job for decay the recommendation score by 5 for all pair of userId and tagId with updatedTime less than 3 days
     */
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // Runs every day
    public void autoDecayRecommendationScore() {
        List<List<Integer>> allRecommendationList = forumRepository.findInfrequentRecommendation();
        for (List<Integer> list : allRecommendationList) {
            int score = forumRepository.findRecommendationScore(list.getFirst(), list.getLast());
            score = max(0, score - 5);
            forumRepository.updateRecommendationScore(list.getFirst(), list.getLast(), score);
        }
    }
}
