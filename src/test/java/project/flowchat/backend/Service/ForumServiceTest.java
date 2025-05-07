package project.flowchat.backend.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;
import project.flowchat.backend.DTO.PostDTO;
import project.flowchat.backend.Model.PostModel;
import project.flowchat.backend.Repository.ForumRepository;
import project.flowchat.backend.Repository.UserAccountRepository;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Use Mockito extension for JUnit 5
class ForumServiceTest {

    @Mock
    private ForumRepository forumRepository;

    @Mock
    private UserAccountRepository userAccountRepository;

    @Mock
    private ImageService imageService;

    @Mock
    private ProfileService profileService;

    @Mock
    private SecurityService securityService;

    @Spy
    @InjectMocks
    private ForumService forumService;

    private PostModel samplePost;
    private PostModel sampleComment;
    private Claims mockClaims;
    private final Integer testUserId = 1;
    private final Integer testPostId = 10;
    private final Integer testCommentId = 11;
    private final Integer otherUserId = 2;

    @BeforeEach
    void setUp() throws Exception {
        samplePost = new PostModel();
        samplePost.setPostId(testPostId);
        samplePost.setUserId(testUserId);
        samplePost.setTitle("Test Post Title");
        samplePost.setContent("Test Post Content");
        samplePost.setAttachTo(0);
        samplePost.setIsActive(true);
        samplePost.setLikeCount(5);
        samplePost.setDislikeCount(1);
        samplePost.setCommentCount(2);
        samplePost.setViewCount(100);
        samplePost.setUpdatedAt(ZonedDateTime.now());
        samplePost.setCreatedAt(ZonedDateTime.now());
        samplePost.setPopularityScore(10);

        sampleComment = new PostModel();
        sampleComment.setPostId(testCommentId);
        sampleComment.setUserId(otherUserId);
        sampleComment.setContent("Test Comment Content");
        sampleComment.setAttachTo(testPostId);
        sampleComment.setIsActive(true);
        sampleComment.setLikeCount(3);
        sampleComment.setDislikeCount(0);
        sampleComment.setCommentCount(0);
        sampleComment.setViewCount(0);
        sampleComment.setUpdatedAt(ZonedDateTime.now());
        sampleComment.setCreatedAt(ZonedDateTime.now());
        sampleComment.setPopularityScore(5);

        mockClaims = Jwts.claims()
                         .add("id", testUserId) // Use add() or set()
                         .add("role", "user")
                         .build();

        lenient().when(userAccountRepository.findUsernameByUserId(anyInt())).thenReturn("testUser");
        lenient().when(profileService.getUserAvatarByUserId(anyInt())).thenReturn("avatar_url");
        lenient().when(profileService.isUserBlocking(anyInt(), anyInt())).thenReturn(false);
        lenient().when(forumRepository.findImageIdByPostId(anyInt())).thenReturn(Collections.emptyList());
        lenient().when(forumRepository.findPostTagNameByPostId(anyInt())).thenReturn(List.of("tag"));
        lenient().when(forumRepository.isLikeClick(anyInt(), anyInt())).thenReturn(null);
        lenient().when(forumRepository.isDislikeClick(anyInt(), anyInt())).thenReturn(null);
        lenient().when(securityService.getClaims()).thenReturn(mockClaims);
    }

    @Test
    void testCreatePost_Success() throws Exception {
        String title = "New Post";
        String content = "New Content";
        List<String> tags = List.of("tag1");
        List<MultipartFile> images = Collections.emptyList();
        Integer attachTo = 0;

        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.save(any(PostModel.class))).thenAnswer(invocation -> {
            PostModel savedPost = invocation.getArgument(0);
            savedPost.setPostId(101);
            return savedPost;
        });
        when(forumRepository.getTagIdFromTagName(eq("tag1"))).thenReturn(1);
        doNothing().when(forumService).updateRecommendationScore(anyInt(), anyInt(), anyString());

        forumService.createPostOrComment(testUserId, title, content, tags, images, attachTo);

        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).save(any(PostModel.class));
        verify(forumRepository).connectPostWithTag(eq(101), eq(1));
        verify(forumRepository, never()).addCommentCountByOne(anyInt());
        verify(forumService).updateRecommendationScore(eq(101), eq(testUserId), eq(ForumService.INTERACTION_POST));
    }

    @Test
    void testCreateComment_Success() throws Exception {
        String content = "New Comment";
        List<String> tags = null;
        List<MultipartFile> images = Collections.emptyList();
        Integer attachTo = testPostId;

        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.save(any(PostModel.class))).thenAnswer(invocation -> {
            PostModel savedComment = invocation.getArgument(0);
            savedComment.setPostId(102);
            return savedComment;
        });
        when(forumRepository.findById(testPostId)).thenReturn(Optional.of(samplePost));
        doNothing().when(forumService).updateRecommendationScore(anyInt(), anyInt(), anyString());

        forumService.createPostOrComment(testUserId, null, content, tags, images, attachTo);

        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).save(any(PostModel.class));
        verify(forumRepository).addCommentCountByOne(eq(testPostId));
        verify(forumService).updateRecommendationScore(eq(testPostId), eq(testUserId), eq(ForumService.INTERACTION_COMMENT));
        verify(forumRepository, never()).connectPostWithTag(anyInt(), anyInt());
    }

    @Test
    void testGetPostContentByPostId_Success_FirstView() throws Exception {
        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.findPostByPostId(testPostId)).thenReturn(samplePost);
        when(forumRepository.isPostView(testPostId, testUserId)).thenReturn(null);
        doNothing().when(forumService).updateRecommendationScore(anyInt(), anyInt(), anyString());

        PostDTO result = forumService.getPostContentByPostId(testPostId, testUserId);

        assertNotNull(result);
        assertEquals(testPostId, result.getPostId());
        assertEquals(samplePost.getTitle(), result.getTitle());
        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).findPostByPostId(testPostId);
        verify(forumRepository).isPostView(testPostId, testUserId);
        verify(forumRepository).addViewRelationship(testPostId, testUserId);
        verify(forumRepository).addViewCount(testPostId);
        verify(forumService).updateRecommendationScore(testPostId, testUserId, ForumService.INTERACTION_VIEW);
    }

    @Test
    void testGetPostContentByPostId_Success_AlreadyViewed() throws Exception {
        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.findPostByPostId(testPostId)).thenReturn(samplePost);
        when(forumRepository.isPostView(testPostId, testUserId)).thenReturn(testPostId);
        // Removed unnecessary stubbing for updateRecommendationScore as it's verified never called below

        PostDTO result = forumService.getPostContentByPostId(testPostId, testUserId);

        assertNotNull(result);
        assertEquals(testPostId, result.getPostId());
        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).findPostByPostId(testPostId);
        verify(forumRepository).isPostView(testPostId, testUserId);
        verify(forumRepository, never()).addViewRelationship(anyInt(), anyInt());
        verify(forumRepository, never()).addViewCount(anyInt());
        verify(forumService, never()).updateRecommendationScore(anyInt(), anyInt(), eq(ForumService.INTERACTION_VIEW));
    }

    @Test
    void testUpdatePost_Fail_NotCreator() throws Exception {
        samplePost.setUserId(otherUserId);
        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.findById(testPostId)).thenReturn(Optional.of(samplePost));

        ExceptionService exception = assertThrows(ExceptionService.class, () -> {
            forumService.updatePostOrComment(testPostId, testUserId, "T", "C", null, null, 0);
        });
        assertEquals(ExceptionService.INVALID_POST_CREATOR, exception.getMessage());
        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).findById(testPostId);
        verify(forumRepository, never()).save(any(PostModel.class));
    }

    @Test
    void testUpdatePost_Fail_PostDeleted() throws Exception {
        samplePost.setIsActive(false);
        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.findById(testPostId)).thenReturn(Optional.of(samplePost));

        ExceptionService exception = assertThrows(ExceptionService.class, () -> {
            forumService.updatePostOrComment(testPostId, testUserId, "T", "C", null, null, 0);
        });
        assertEquals(ExceptionService.POST_DELETED, exception.getMessage());
        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).findById(testPostId);
        verify(forumRepository, never()).save(any(PostModel.class));
    }

    @Test
    void testDeletePost_Success() throws Exception {
        List<Integer> existingImageIds = List.of(98);
        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.findById(testPostId)).thenReturn(Optional.of(samplePost));
        when(forumRepository.findImageIdByPostId(testPostId)).thenReturn(existingImageIds);

        forumService.deletePostOrComment(testPostId, testUserId);

        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).findById(testPostId);
        verify(forumRepository).deleteTagInPost(testPostId);
        verify(forumRepository).findImageIdByPostId(testPostId);
        verify(forumRepository).deleteInPostImage(existingImageIds.get(0));
        verify(forumRepository).deleteInImageData(existingImageIds.get(0));
        verify(forumRepository).save(any(PostModel.class));
    }

    @Test
    void testDeletePost_Fail_NotCreator() throws Exception {
        samplePost.setUserId(otherUserId);
        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.findById(testPostId)).thenReturn(Optional.of(samplePost));

        ExceptionService exception = assertThrows(ExceptionService.class, () -> {
            forumService.deletePostOrComment(testPostId, testUserId);
        });
        assertEquals(ExceptionService.INVALID_POST_CREATOR, exception.getMessage());
        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).findById(testPostId);
        verify(forumRepository, never()).save(any(PostModel.class));
    }

    @Test
    void testDeletePost_Fail_AlreadyDeleted() throws Exception {
        samplePost.setIsActive(false);
        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.findById(testPostId)).thenReturn(Optional.of(samplePost));

        ExceptionService exception = assertThrows(ExceptionService.class, () -> {
            forumService.deletePostOrComment(testPostId, testUserId);
        });
        assertEquals(ExceptionService.POST_DELETED, exception.getMessage());
        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).findById(testPostId);
        verify(forumRepository, never()).save(any(PostModel.class));
    }

    @Test
    void testGetLatestPostPreviewList_Success() throws Exception {
        Integer postNum = 5;
        List<Integer> excluding = List.of(1, 2);
        List<PostModel> mockPosts = List.of(samplePost);
        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.findLatestActivePostByRange(eq(excluding), eq(postNum))).thenReturn(mockPosts);

        List<PostDTO> result = forumService.getLatestPostPreviewList(testUserId, excluding, postNum);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(samplePost.getPostId(), result.get(0).getPostId());
        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).findLatestActivePostByRange(excluding, postNum);
        verify(userAccountRepository).findUsernameByUserId(samplePost.getUserId());
        verify(profileService).getUserAvatarByUserId(samplePost.getUserId());
    }

    @Test
    void testGetRecommendedPostPreviewList_Success() throws Exception {
        Integer postNum = 5; // Request 5 posts
        List<Integer> initialExcluding = new ArrayList<>(List.of(3)); // Initially exclude post 3
        List<Integer> mockViewedPosts = List.of(4); // User has viewed post 4
        List<Integer> mockRecommendedTagIds = List.of(1, 2); // Mock top 2 tags

        // Mock posts for tag 1 (popular) - Assume this returns 1 post (samplePost)
        PostModel samplePostTag1 = samplePost; // Use existing samplePost or create new
        // samplePostTag1 already has dates and counts set from setUp()
        List<PostModel> mockPopularTag1 = List.of(samplePostTag1);

        // Mock posts for tag 2 (popular) - Assume this returns 1 post
        PostModel samplePostTag2 = new PostModel(); /* setup samplePostTag2 */
        samplePostTag2.setPostId(20);
        samplePostTag2.setUserId(otherUserId);
        samplePostTag2.setTitle("Tag 2 Post");
        samplePostTag2.setContent("Content for Tag 2");
        samplePostTag2.setIsActive(true);
        samplePostTag2.setUpdatedAt(ZonedDateTime.now().minusHours(1));
        samplePostTag2.setCreatedAt(ZonedDateTime.now().minusHours(2));
        // Corrected: Initialize count fields
        samplePostTag2.setLikeCount(0);
        samplePostTag2.setDislikeCount(0);
        samplePostTag2.setCommentCount(0);
        samplePostTag2.setViewCount(0);
        samplePostTag2.setAttachTo(0); // Also initialize attachTo if needed
        samplePostTag2.setPopularityScore(0); // Initialize if needed
        List<PostModel> mockPopularTag2 = List.of(samplePostTag2);

        // Mock posts for random fetch (if needed) - Assume this returns 1 post
        PostModel samplePostRandom = new PostModel(); /* setup samplePostRandom */
        samplePostRandom.setPostId(30);
        samplePostRandom.setUserId(testUserId);
        samplePostRandom.setTitle("Random Post");
        samplePostRandom.setContent("Content for Random");
        samplePostRandom.setIsActive(true);
        samplePostRandom.setUpdatedAt(ZonedDateTime.now().minusMinutes(10));
        samplePostRandom.setCreatedAt(ZonedDateTime.now().minusMinutes(20));
        // Corrected: Initialize count fields
        samplePostRandom.setLikeCount(0);
        samplePostRandom.setDislikeCount(0);
        samplePostRandom.setCommentCount(0);
        samplePostRandom.setViewCount(0);
        samplePostRandom.setAttachTo(0); // Also initialize attachTo if needed
        samplePostRandom.setPopularityScore(0); // Initialize if needed
        List<PostModel> mockRandom = List.of(samplePostRandom);

        // --- Mocking Dependencies ---
        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.findViewPostListByUserId(testUserId)).thenReturn(mockViewedPosts);
        when(forumRepository.findRecommendedTagByHighestScore(testUserId)).thenReturn(mockRecommendedTagIds);

        // Mock calls within generatePostPreviewListByTagRecommendation (adjust method names if different)
        // For Tag 1 (popular)
        when(forumRepository.findPopularActivePostByRangeAndTag(eq(1), anyList(), anyInt()))
                .thenReturn(mockPopularTag1);

        // For Tag 2 (popular)
        when(forumRepository.findPopularActivePostByRangeAndTag(eq(2), anyList(), anyInt()))
                .thenReturn(mockPopularTag2);

        // Corrected: Mock final POPULAR fetch (used by helper when tagId is null or for random)
        when(forumRepository.findPopularActivePostByRange(anyList(), anyInt()))
               .thenReturn(mockRandom);

        // --- Act ---
        List<PostDTO> result = forumService.getRecommendedPostPreviewList(testUserId, initialExcluding, postNum);

        // --- Assert ---
        assertNotNull(result);
        // Assert size based on mocked returns (1 from tag1, 1 from tag2, 1 from random = 3)
        assertEquals(3, result.size());
        // Assert specific posts are present if needed
        assertTrue(result.stream().anyMatch(p -> p.getPostId().equals(samplePostTag1.getPostId())));
        assertTrue(result.stream().anyMatch(p -> p.getPostId().equals(samplePostTag2.getPostId())));
        assertTrue(result.stream().anyMatch(p -> p.getPostId().equals(samplePostRandom.getPostId())));

        // --- Verify Interactions ---
        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).findViewPostListByUserId(testUserId);
        verify(forumRepository).findRecommendedTagByHighestScore(testUserId);

        // Use ArgumentCaptor to check lists passed to helper calls
        ArgumentCaptor<List<Integer>> excludingCaptor = ArgumentCaptor.forClass(List.class);
        ArgumentCaptor<Integer> limitCaptor = ArgumentCaptor.forClass(Integer.class);
        ArgumentCaptor<Integer> tagCaptor = ArgumentCaptor.forClass(Integer.class);

        // Verify calls for Tag 1 (inside helper)
        verify(forumRepository).findPopularActivePostByRangeAndTag(eq(1), excludingCaptor.capture(), limitCaptor.capture());
        assertTrue(excludingCaptor.getValue().containsAll(List.of(3, 4))); // Initial + Viewed
        // Verify other calls for Tag 1 if applicable (latest/random)

        // Verify calls for Tag 2 (inside helper)
        verify(forumRepository).findPopularActivePostByRangeAndTag(eq(2), excludingCaptor.capture(), limitCaptor.capture());
        assertTrue(excludingCaptor.getValue().containsAll(List.of(3, 4, samplePostTag1.getPostId()))); // Initial + Viewed + Post from Tag 1
        // Verify other calls for Tag 2 if applicable

        // Corrected: Verify final POPULAR fetch call (inside helper for random part)
        verify(forumRepository).findPopularActivePostByRange(excludingCaptor.capture(), limitCaptor.capture());
        assertTrue(excludingCaptor.getValue().containsAll(List.of(3, 4, samplePostTag1.getPostId(), samplePostTag2.getPostId()))); // Initial + Viewed + Posts from Tags 1 & 2
        // Verify the limit passed was correct (e.g., postNum - posts found so far)
        assertEquals(postNum - mockPopularTag1.size() - mockPopularTag2.size(), limitCaptor.getValue());

        // Verify DTO conversion dependencies for returned posts
        verify(userAccountRepository, times(result.size())).findUsernameByUserId(anyInt());
        verify(profileService, times(result.size())).getUserAvatarByUserId(anyInt());
        // ... other DTO dependencies ...
    }

    @Test
    void testGetFollowingPostPreviewList_Success() throws Exception {
        Integer postNum = 4;
        List<Integer> excluding = List.of(5);
        List<PostModel> mockPosts = List.of(samplePost);
        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.findFollowingActivePostByRange(eq(testUserId), eq(excluding), eq(postNum))).thenReturn(mockPosts);

        List<PostDTO> result = forumService.getFollowingPostPreviewList(testUserId, excluding, postNum);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(samplePost.getPostId(), result.get(0).getPostId());
        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).findFollowingActivePostByRange(testUserId, excluding, postNum);
        verify(userAccountRepository).findUsernameByUserId(samplePost.getUserId());
    }

    @Test
    void testGetUserPostPreviewList_Success() throws Exception {
        Integer targetUserId = testUserId;
        Integer postNum = 2;
        List<Integer> excluding = Collections.emptyList();
        List<PostModel> mockPosts = List.of(samplePost);
        doNothing().when(securityService).checkUserIdWithToken(testUserId);
        when(forumRepository.findUserActivePostByRange(eq(targetUserId), eq(excluding), eq(postNum))).thenReturn(mockPosts);

        List<PostDTO> result = forumService.getUserPostPreviewList(targetUserId, testUserId, excluding, postNum);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(samplePost.getPostId(), result.get(0).getPostId());
        verify(securityService).checkUserIdWithToken(testUserId);
        verify(forumRepository).findUserActivePostByRange(targetUserId, excluding, postNum);
        verify(userAccountRepository).findUsernameByUserId(samplePost.getUserId());
    }
}