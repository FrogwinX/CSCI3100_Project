package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.flowchat.backend.DTO.PostContentDTO;
import project.flowchat.backend.Model.PostModel;
import project.flowchat.backend.DTO.PostDTO;
import project.flowchat.backend.DTO.PostPreviewDTO;
import project.flowchat.backend.Repository.ForumRepository;
import project.flowchat.backend.Repository.UserAccountRepository;

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

    private HashSet<Integer> hashPostSet;

    private PostDTO setPostModel(PostModel post, Integer viewUserId, PostDTO postDTO) {
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

    public List<PostPreviewDTO> getLatestPostPreviewList(Integer userId, Integer postNumOffset, Integer postNum) throws Exception {
        List<PostModel> postModelList = forumRepository.findLatestActivePostByRange(postNumOffset, postNum);
        List<PostPreviewDTO> postPreviewModelList = new ArrayList<>();
        for (PostModel postData : postModelList) {
            if (forumRepository.countBlockByUserIdAndPostId(postData.getPostId(), userId) == 0) {
                PostPreviewDTO postPreview = (PostPreviewDTO) setPostModel(postData, userId, new PostPreviewDTO());
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
                PostPreviewDTO postPreview = (PostPreviewDTO) setPostModel(postData, userId, new PostPreviewDTO());
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
        PostModel postModel = forumRepository.findActivePostCommentByPostId(postId);
        PostContentDTO post = (PostContentDTO) setPostModel(postModel, userId, new PostContentDTO());
        post.setContent(postModel.getContent());

        List<PostModel> commentModelList = forumRepository.findActivePostCommentByAttachTo(postId);
        List<PostContentDTO> commentList = new ArrayList<>();
        if (!commentModelList.isEmpty()) {
            for (PostModel commentData : commentModelList) {
                if (forumRepository.countBlockByUserIdAndPostId(commentData.getPostId(), userId) == 0) {
                    PostContentDTO comment = (PostContentDTO) setPostModel(commentData, userId, new PostContentDTO());
                    comment.setContent(commentData.getContent());

                    Integer commentId = commentData.getPostId();
                    List<PostModel> subCommentModelList = forumRepository.findActivePostCommentByAttachTo(commentId);
                    List<PostContentDTO> subCommentList = new ArrayList<>();
                    if (!subCommentModelList.isEmpty()) {
                        for (PostModel subCommentData : subCommentModelList) {
                            if (forumRepository.countBlockByUserIdAndPostId(subCommentData.getPostId(), userId) == 0) {
                                PostContentDTO subComment = (PostContentDTO) setPostModel(subCommentData, userId, new PostContentDTO());
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

}
