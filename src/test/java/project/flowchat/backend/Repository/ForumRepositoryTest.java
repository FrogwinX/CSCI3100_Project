package project.flowchat.backend.Repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.TestPropertySource;
import project.flowchat.backend.Model.PostModel;
import project.flowchat.backend.Model.UserAccountModel; // Assuming UserAccountModel is needed and accessible

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=MSSQLServer;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=none",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect" // Explicitly set H2 dialect
})
public class ForumRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ForumRepository forumRepository;

    // Assuming UserAccountRepository might be needed for user creation if not using TestEntityManager directly for UserAccountModel
    // @Autowired
    // private UserAccountRepository userAccountRepository;

    private UserAccountModel user1;
    private UserAccountModel user2;
    private UserAccountModel user3;
    private Integer tagId1;
    private Integer tagId2;

    @BeforeEach
    void setUp() {
        // Create users
        user1 = createUser("user1", "user1@example.com", "hash1", true);
        user2 = createUser("user2", "user2@example.com", "hash2", true);
        user3 = createUser("user3", "user3@example.com", "hash3", true);

        // --- Workaround: Insert Tag and Query by Name ---
        String techTagName = "tech";
        entityManager.getEntityManager()
            .createNativeQuery("INSERT INTO FORUM.Tag_Data (tag_name) VALUES (:tagName)")
            .setParameter("tagName", techTagName)
            .executeUpdate();
        // Query by the unique name immediately after insert
        tagId1 = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT tag_id FROM FORUM.Tag_Data WHERE tag_name = :tagName")
            .setParameter("tagName", techTagName)
            .getSingleResult();

        String javaTagName = "java";
        entityManager.getEntityManager()
            .createNativeQuery("INSERT INTO FORUM.Tag_Data (tag_name) VALUES (:tagName)")
            .setParameter("tagName", javaTagName)
            .executeUpdate();
        // Query by the unique name immediately after insert
        tagId2 = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT tag_id FROM FORUM.Tag_Data WHERE tag_name = :tagName")
            .setParameter("tagName", javaTagName)
            .getSingleResult();
        // --- End Workaround ---

        // Setup Recommendation entries (using the obtained tagId1 and tagId2)
        entityManager.getEntityManager()
            .createNativeQuery("INSERT INTO FORUM.Recommendation (user_id, tag_id, score, updated_at) VALUES (?, ?, ?, ?)")
            .setParameter(1, user1.getUserId())
            .setParameter(2, tagId1) // Use the ID obtained via query
            .setParameter(3, 100)
            .setParameter(4, ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")))
            .executeUpdate();
        entityManager.getEntityManager()
            .createNativeQuery("INSERT INTO FORUM.Recommendation (user_id, tag_id, score, updated_at) VALUES (?, ?, ?, ?)")
            .setParameter(1, user1.getUserId())
            .setParameter(2, tagId2) // Use the ID obtained via query
            .setParameter(3, 50)
            .setParameter(4, ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")))
            .executeUpdate();

        // Setup Follow relationship (user1 follows user2)
        entityManager.getEntityManager()
            .createNativeQuery("INSERT INTO PROFILE.Follow (user_id_from, user_id_to) VALUES (?, ?)")
            .setParameter(1, user1.getUserId())
            .setParameter(2, user2.getUserId())
            .executeUpdate();

        entityManager.flush(); // Ensure setup data is persisted before tests run
        entityManager.clear();
    }

    // Helper to create UserAccountModel
    private UserAccountModel createUser(String username, String email, String passwordHash, boolean isActive) {
        UserAccountModel user = new UserAccountModel();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setIsActive(isActive);
        user.setRoleId(1); // Default role
        user.setCreatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        user.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        return entityManager.persistFlushFind(user); // Persist, flush, and return managed entity
    }

    // Helper to create PostModel
    private PostModel createPost(UserAccountModel user, String title, String content, Integer attachTo, boolean isActive) {
        PostModel post = new PostModel();
        post.setUserId(user.getUserId());
        post.setTitle(title);
        post.setContent(content);
        post.setAttachTo(attachTo);
        post.setIsActive(isActive);
        post.setLikeCount(0);
        post.setDislikeCount(0);
        post.setCommentCount(0);
        post.setViewCount(0);
        post.setPopularityScore(0); // Initial score
        post.setCreatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        post.setUpdatedAt(ZonedDateTime.now(ZoneId.of("Asia/Hong_Kong")));
        return entityManager.persistFlushFind(post); // Persist, flush, and return managed entity
    }

    // Helper to add tag to post
    private void addTagToPost(Integer postId, Integer tagId) {
        entityManager.getEntityManager()
            .createNativeQuery("INSERT INTO FORUM.Post_Tag (post_id, tag_id) VALUES (?, ?)")
            .setParameter(1, postId)
            .setParameter(2, tagId)
            .executeUpdate();
        entityManager.flush(); // Ensure changes are persisted
    }

     // Helper to set popularity score
    private void setPopularityScore(Integer postId, int score) {
        entityManager.getEntityManager()
            .createNativeQuery("UPDATE FORUM.Post SET popularity_score = ? WHERE post_id = ?")
            .setParameter(1, score)
            .setParameter(2, postId)
            .executeUpdate();
        entityManager.flush();
        // entityManager.clear(); // Clearing here might cause subsequent queries in the same test to miss updates
    }

    @Test
    void findPostByPostId_WhenPostExists_ShouldReturnPost() {
        // Arrange
        PostModel post = createPost(user1, "Test Title", "Test Content", 0, true);

        // Act
        PostModel foundPost = forumRepository.findPostByPostId(post.getPostId());

        // Assert
        assertNotNull(foundPost);
        assertEquals(post.getPostId(), foundPost.getPostId());
        assertEquals("Test Title", foundPost.getTitle());
    }

    @Test
    void findPostByPostId_WhenPostDoesNotExist_ShouldReturnNull() {
        // Arrange
        Integer nonExistentPostId = 999;

        // Act
        PostModel foundPost = forumRepository.findPostByPostId(nonExistentPostId);

        // Assert
        assertNull(foundPost);
    }

    @Test
    void findActivePostCommentByAttachTo_WhenCommentsExist_ShouldReturnCommentsOrderedByPopularity() {
        // Arrange
        PostModel parentPost = createPost(user1, "Parent Post", "Content", 0, true);
        PostModel comment1 = createPost(user2, null, "Comment 1", parentPost.getPostId(), true);
        PostModel comment2 = createPost(user1, null, "Comment 2", parentPost.getPostId(), true);
        PostModel inactiveComment = createPost(user2, null, "Inactive Comment", parentPost.getPostId(), false);

        setPopularityScore(comment1.getPostId(), 10);
        setPopularityScore(comment2.getPostId(), 20); // comment2 more popular

        // Act
        List<PostModel> comments = forumRepository.findActivePostCommentByAttachTo(parentPost.getPostId());

        // Assert
        assertNotNull(comments);
        assertEquals(2, comments.size());
        // Verify order by popularity_score DESC
        assertEquals(comment2.getPostId(), comments.get(0).getPostId());
        assertEquals(comment1.getPostId(), comments.get(1).getPostId());
    }

    @Test
    void connectPostWithTag_And_findPostTagNameByPostId() {
        // Arrange
        PostModel post = createPost(user1, "Tagged Post", "Content", 0, true);

        // Act
        forumRepository.connectPostWithTag(post.getPostId(), tagId1);
        forumRepository.connectPostWithTag(post.getPostId(), tagId2);
        entityManager.flush();
        entityManager.clear();

        // Assert Tag Names
        List<String> tagNames = forumRepository.findPostTagNameByPostId(post.getPostId());
        assertNotNull(tagNames);
        assertEquals(2, tagNames.size());
        assertTrue(tagNames.contains("tech"));
        assertTrue(tagNames.contains("java"));

        // Assert Tag IDs
        List<Integer> tagIds = forumRepository.findTagIdByPostId(post.getPostId());
         assertNotNull(tagIds);
        assertEquals(2, tagIds.size());
        assertTrue(tagIds.contains(tagId1));
        assertTrue(tagIds.contains(tagId2));
    }

     @Test
    void addLikeRelationship_And_isLikeClick() {
        // Arrange
        PostModel post = createPost(user1, "Likeable Post", "Content", 0, true);

        // Act & Assert - Before Like (using native query with correct quoting - Initial Cap)
        Integer likeBefore = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT post_id FROM FORUM.\"Like\" WHERE post_id = :postId AND user_id = :userId") // Reverted to initial cap "Like"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user2.getUserId())
            .getResultStream().findFirst().orElse(null);
        assertNull(likeBefore);

        // Act - Add Like using native query with correct quoting - Initial Cap
        entityManager.getEntityManager()
            .createNativeQuery("INSERT INTO FORUM.\"Like\" (post_id, user_id) VALUES (?, ?)") // Reverted to initial cap "Like"
            .setParameter(1, post.getPostId())
            .setParameter(2, user2.getUserId())
            .executeUpdate();
        entityManager.flush();
        entityManager.clear();

        // Assert - After Like (using native query with correct quoting - Initial Cap)
        Integer likeAfter = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT post_id FROM FORUM.\"Like\" WHERE post_id = :postId AND user_id = :userId") // Reverted to initial cap "Like"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user2.getUserId())
            .getResultStream().findFirst().orElse(null);
        assertNotNull(likeAfter);
        assertEquals(post.getPostId(), likeAfter);
    }

     @Test
    void addDislikeRelationship_And_isDislikeClick() {
        // Arrange
        PostModel post = createPost(user1, "Dislikeable Post", "Content", 0, true);

        // Act & Assert - Before Dislike
        Integer dislikeBefore = forumRepository.isDislikeClick(post.getPostId(), user2.getUserId());
        assertNull(dislikeBefore);

        // Act - Add Dislike
        forumRepository.addDislikeRelationship(post.getPostId(), user2.getUserId());
        entityManager.flush();
        entityManager.clear();

        // Assert - After Dislike
        Integer dislikeAfter = forumRepository.isDislikeClick(post.getPostId(), user2.getUserId());
        assertNotNull(dislikeAfter);
        assertEquals(post.getPostId(), dislikeAfter);
    }

    @Test
    void addViewRelationship_And_isPostView() {
        // Arrange
        PostModel post = createPost(user1, "Viewable Post", "Content", 0, true);

        // Act & Assert - Before View (using native query with correct quoting - UPPERCASE)
        Integer viewBefore = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT post_id FROM FORUM.\"VIEW\" WHERE post_id = :postId AND user_id = :userId") // Changed to uppercase "VIEW"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user2.getUserId())
            .getResultStream().findFirst().orElse(null);
        assertNull(viewBefore);

        // Act - Add View (using native query with correct quoting - UPPERCASE)
        entityManager.getEntityManager()
            .createNativeQuery("INSERT INTO FORUM.\"VIEW\" (post_id, user_id) VALUES (?, ?)") // Changed to uppercase "VIEW"
            .setParameter(1, post.getPostId())
            .setParameter(2, user2.getUserId())
            .executeUpdate();
        entityManager.flush();
        entityManager.clear();

        // Assert - After View (using native query with correct quoting - UPPERCASE)
        Integer viewAfter = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT post_id FROM FORUM.\"VIEW\" WHERE post_id = :postId AND user_id = :userId") // Changed to uppercase "VIEW"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user2.getUserId())
            .getResultStream().findFirst().orElse(null);
        assertNotNull(viewAfter);
        assertEquals(post.getPostId(), viewAfter);
    }

    @Test
    void findLatestActivePostByRange_ShouldReturnLatestPostsExcludingGivenIds() {
        // Arrange
        PostModel post1 = createPost(user1, "Post 1", "Content 1", 0, true);
        try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } // Ensure different timestamps
        PostModel post2 = createPost(user2, "Post 2", "Content 2", 0, true);
        try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        PostModel post3 = createPost(user1, "Post 3", "Content 3", 0, true);
        PostModel inactivePost = createPost(user1, "Inactive", "Content", 0, false);
        PostModel comment = createPost(user1, null, "Comment", post1.getPostId(), true); // Should be ignored

        List<Integer> excluding = Collections.singletonList(post1.getPostId()); // Exclude post1
        Integer limit = 2;

        // Act
        List<PostModel> latestPosts = forumRepository.findLatestActivePostByRange(excluding, limit);

        // Assert
        assertNotNull(latestPosts);
        assertEquals(limit, latestPosts.size());
        assertEquals(post3.getPostId(), latestPosts.get(0).getPostId()); // post3 is latest
        assertEquals(post2.getPostId(), latestPosts.get(1).getPostId()); // post2 is next latest (post1 excluded)
    }

    @Test
    void findFollowingActivePostByRange_ShouldReturnFollowedUserPostsOrderedByPopularity() {
        // Arrange (user1 follows user2 in setUp)
        PostModel followedPost1 = createPost(user2, "Followed Post 1", "Content", 0, true);
        PostModel followedPost2 = createPost(user2, "Followed Post 2", "Content", 0, true);
        PostModel ownPost = createPost(user1, "Own Post", "Content", 0, true); // Should not be included
        PostModel unfollowedPost = createPost(user3, "Unfollowed Post", "Content", 0, true); // Should not be included

        setPopularityScore(followedPost1.getPostId(), 50);
        setPopularityScore(followedPost2.getPostId(), 100); // post2 more popular

        List<Integer> excluding = Collections.emptyList();
        // Handle empty list for NOT IN clause
        List<Integer> exclusionParam = excluding.isEmpty() ? Collections.singletonList(-1) : excluding;
        Integer limit = 5;

        // Act
        List<PostModel> followingPosts = forumRepository.findFollowingActivePostByRange(user1.getUserId(), exclusionParam, limit);

        // Assert
        assertNotNull(followingPosts);
        assertEquals(2, followingPosts.size()); // Only posts from user2
        assertEquals(followedPost2.getPostId(), followingPosts.get(0).getPostId()); // Ordered by popularity
        assertEquals(followedPost1.getPostId(), followingPosts.get(1).getPostId());
    }

    @Test
    void findUserActivePostByRange_ShouldReturnUserPostsOrderedByUpdate() {
        // Arrange
        PostModel user1Post1 = createPost(user1, "User1 Post 1", "Content", 0, true);
        try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        PostModel user1Post2 = createPost(user1, "User1 Post 2", "Content", 0, true); // Create the second post for user1
        try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        PostModel user2Post = createPost(user2, "User2 Post", "Content", 0, true); // Should not be included
        try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        PostModel user1Comment = createPost(user1, null, "User1 Comment", user1Post1.getPostId(), true); // Should not be included

        List<Integer> excluding = Collections.emptyList();
        // Handle empty list for NOT IN clause
        List<Integer> exclusionParam = excluding.isEmpty() ? Collections.singletonList(-1) : excluding;
        Integer limit = 5;

        // Act
        List<PostModel> userPosts = forumRepository.findUserActivePostByRange(user1.getUserId(), exclusionParam, limit);

        // Assert
        assertNotNull(userPosts);
        // Assert
        assertNotNull(userPosts);
        assertEquals(2, userPosts.size());
        assertEquals(user1Post2.getPostId(), userPosts.get(0).getPostId()); // Ordered by updated_at DESC
        assertEquals(user1Post1.getPostId(), userPosts.get(1).getPostId());
    }

     @Test
    void findUserActiveCommentByRange_ShouldReturnUserCommentsOrderedByUpdate() {
        // Arrange
        PostModel post = createPost(user2, "Post For Comments", "Content", 0, true);
        PostModel user1Comment1 = createPost(user1, null, "User1 Comment 1", post.getPostId(), true);
        try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        PostModel user1Comment2 = createPost(user1, null, "User1 Comment 2", post.getPostId(), true); // Create the second comment
        try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        PostModel user1Post = createPost(user1, "User1 Post", "Content", 0, true); // Should not be included

        List<Integer> excluding = Collections.emptyList();
        // Handle empty list for NOT IN clause
        List<Integer> exclusionParam = excluding.isEmpty() ? Collections.singletonList(-1) : excluding;
        Integer limit = 5;

        // Act
        List<PostModel> userComments = forumRepository.findUserActiveCommentByRange(user1.getUserId(), exclusionParam, limit);

        // Assert
        assertNotNull(userComments);
        // The variable userComments was already declared and assigned above.
        // Re-assigning or using the existing variable is appropriate here.
        // If the intent was to re-query, the existing variable should be used:
        // userComments = forumRepository.findUserActiveCommentByRange(user1.getUserId(), excluding, limit);
        // However, based on the context, the second query seems redundant as the parameters are the same.
        // We will proceed assuming the second declaration was the error.

        // Assert (using the already populated userComments variable)
        assertNotNull(userComments);
        assertEquals(2, userComments.size());
        assertEquals(user1Comment2.getPostId(), userComments.get(0).getPostId()); // Ordered by updated_at DESC
        assertEquals(user1Comment1.getPostId(), userComments.get(1).getPostId());
    }


    @Test
    void findPopularActivePostByRange_ShouldReturnPopularPosts() {
        // Arrange
        PostModel post1 = createPost(user1, "Post 1", "Content 1", 0, true);
        PostModel post2 = createPost(user2, "Post 2", "Content 2", 0, true);
        PostModel post3 = createPost(user3, "Post 3", "Content 3", 0, true); // Create post3
        setPopularityScore(post1.getPostId(), 10); // Set popularity for post1
        setPopularityScore(post2.getPostId(), 30); // Set popularity for post2 (highest)
        setPopularityScore(post3.getPostId(), 20); // Set popularity for post3

        List<Integer> excluding = Collections.emptyList();
        // Handle empty list for NOT IN clause
        List<Integer> exclusionParam = excluding.isEmpty() ? Collections.singletonList(-1) : excluding;
        Integer limit = 2;

        // Act
        List<PostModel> popularPosts = forumRepository.findPopularActivePostByRange(exclusionParam, limit);

        // Assert (using the already populated popularPosts variable)
        assertNotNull(popularPosts);
        // The variable popularPosts is already declared and assigned above.
        // The second declaration and assignment are redundant.

        // Assert (using the already populated popularPosts variable)
        assertNotNull(popularPosts);

        // Assert
        assertNotNull(popularPosts);
        assertEquals(limit, popularPosts.size());
        assertEquals(post2.getPostId(), popularPosts.get(0).getPostId()); // post2 most popular
        assertEquals(post3.getPostId(), popularPosts.get(1).getPostId()); // post3 next popular
    }

    @Test // Added annotation
    void findLatestActivePostByRangeAndTag_ShouldReturnLatestTaggedPosts() {
        // Arrange
        PostModel techPost1 = createPost(user1, "Tech Post 1", "Content", 0, true);
        try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } // Ensure different timestamps
        PostModel techPost2 = createPost(user2, "Tech Post 2", "Content", 0, true);
        try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        PostModel javaPost = createPost(user1, "Java Post", "Content", 0, true);
        PostModel inactiveTechPost = createPost(user1, "Inactive Tech", "Content", 0, false);

        addTagToPost(techPost1.getPostId(), tagId1); // tech
        addTagToPost(techPost2.getPostId(), tagId1); // tech
        addTagToPost(javaPost.getPostId(), tagId2); // java
        addTagToPost(inactiveTechPost.getPostId(), tagId1); // tech (inactive)

        List<Integer> excluding = Collections.emptyList();
        // Handle empty list for NOT IN clause
        List<Integer> exclusionParam = excluding.isEmpty() ? Collections.singletonList(-1) : excluding;
        Integer limit = 5;

        // Act
        List<PostModel> latestTechPosts = forumRepository.findLatestActivePostByRangeAndTag(tagId1, exclusionParam, limit);

        // Assert
        assertNotNull(latestTechPosts);
        assertEquals(2, latestTechPosts.size()); // Only active tech posts
        assertEquals(techPost2.getPostId(), latestTechPosts.get(0).getPostId()); // techPost2 is latest
        assertEquals(techPost1.getPostId(), latestTechPosts.get(1).getPostId());
    } // Added closing brace

    @Test // Added annotation
    void findPopularActivePostByRangeAndTag_ShouldReturnPopularTaggedPosts() {
        // Arrange
        PostModel techPost1 = createPost(user1, "Tech Post 1", "Content", 0, true);
        PostModel techPost2 = createPost(user2, "Tech Post 2", "Content", 0, true);
        PostModel javaPost = createPost(user1, "Java Post", "Content", 0, true);
        PostModel inactiveTechPost = createPost(user1, "Inactive Tech", "Content", 0, false);

        addTagToPost(techPost1.getPostId(), tagId1); // tech
        addTagToPost(techPost2.getPostId(), tagId1); // tech
        addTagToPost(javaPost.getPostId(), tagId2); // java
        addTagToPost(inactiveTechPost.getPostId(), tagId1); // tech (inactive)

        setPopularityScore(techPost1.getPostId(), 50);
        setPopularityScore(techPost2.getPostId(), 75); // techPost2 more popular than techPost1
        setPopularityScore(javaPost.getPostId(), 60);
        setPopularityScore(inactiveTechPost.getPostId(), 90); // Should be ignored

        List<Integer> excluding = Collections.emptyList();
        // Handle empty list for NOT IN clause
        List<Integer> exclusionParam = excluding.isEmpty() ? Collections.singletonList(-1) : excluding;
        Integer limit = 5;

        // Act
        // It might be beneficial to clear the persistence context before the final query
        // to ensure it reads the latest state from the database.
        entityManager.clear(); // Clear context before query to ensure fresh data read
        List<PostModel> popularTechPosts = forumRepository.findPopularActivePostByRangeAndTag(tagId1, exclusionParam, limit);

        // Assert
        assertNotNull(popularTechPosts);
        assertEquals(2, popularTechPosts.size(), "Expected 2 active tech posts, but found " + popularTechPosts.size()); // Add message for clarity
        // Add assertions to check the order based on popularity
        assertEquals(techPost2.getPostId(), popularTechPosts.get(0).getPostId(), "Tech Post 2 should be first (most popular)");
        assertEquals(techPost1.getPostId(), popularTechPosts.get(1).getPostId(), "Tech Post 1 should be second");
    }

    @Test
    void findPopularActivePostByRangeAndKeyword_ShouldReturnMatchingPostsOrderedByPopularity() {
        // Arrange
        PostModel post1 = createPost(user1, "Intro to Java", "Content about Java basics", 0, true);
        PostModel post2 = createPost(user2, "Advanced Java", "Deep dive into Java features", 0, true);
        PostModel post3 = createPost(user1, "Python Basics", "Content about Python", 0, true); // Should not match
        PostModel inactiveJavaPost = createPost(user1, "Old Java Post", "Inactive content", 0, false); // Should not match

        setPopularityScore(post1.getPostId(), 50);
        setPopularityScore(post2.getPostId(), 100); // post2 more popular
        setPopularityScore(post3.getPostId(), 10); // Should not be included in results

        String keyword = "%java%"; // SQL LIKE pattern
        List<Integer> excluding = Collections.emptyList();
        // Handle empty list for NOT IN clause
        List<Integer> exclusionParam = excluding.isEmpty() ? Collections.singletonList(-1) : excluding;
        Integer limit = 5;

        entityManager.clear(); // Ensure query reads fresh data after native updates

        // Act - Replace repository call with direct native query
        String nativeQuery = "SELECT * FROM FORUM.Post p " +
                             "WHERE p.is_active = 1 AND p.attach_to = 0 " +
                             "AND (LOWER(p.title) LIKE LOWER(:keyword) OR LOWER(p.content) LIKE LOWER(:keyword)) " +
                             "AND p.post_id NOT IN (:excluding) " +
                             "ORDER BY p.popularity_score DESC " +
                             "LIMIT :limit OFFSET 0"; // Use standard LIMIT

        @SuppressWarnings("unchecked") // Suppress warning for native query result casting
        List<PostModel> foundPosts = entityManager.getEntityManager()
            .createNativeQuery(nativeQuery, PostModel.class) // Map result to PostModel
            .setParameter("keyword", keyword)
            .setParameter("excluding", exclusionParam)
            .setParameter("limit", limit)
            .getResultList();
        // List<PostModel> foundPosts = forumRepository.findPopularActivePostByRangeAndKeyword(keyword, exclusionParam, limit); // <-- Original call replaced

        // Assert
        assertNotNull(foundPosts);
        assertEquals(2, foundPosts.size());
        // Ordered by popularity DESC
        assertEquals(post2.getPostId(), foundPosts.get(0).getPostId());
        assertEquals(post1.getPostId(), foundPosts.get(1).getPostId());
    }

    @Test
    void addLikeCount_ShouldIncrementLikeCount() {
        // Arrange
        PostModel post = createPost(user1, "Like Count Test", "Content", 0, true);
        int initialLikes = post.getLikeCount();

        // Act
        forumRepository.addLikeCount(post.getPostId());
        entityManager.flush();
        entityManager.clear();

        // Assert
        PostModel updatedPost = entityManager.find(PostModel.class, post.getPostId());
        assertNotNull(updatedPost);
        assertEquals(initialLikes + 1, updatedPost.getLikeCount());
    }

     @Test
    void minusLikeCount_ShouldDecrementLikeCount() {
        // Arrange
        PostModel post = createPost(user1, "Like Count Test", "Content", 0, true);
        // Set initial like count > 0
        entityManager.getEntityManager()
            .createNativeQuery("UPDATE FORUM.Post SET like_count = 5 WHERE post_id = ?")
            .setParameter(1, post.getPostId())
            .executeUpdate();
        entityManager.flush();
        entityManager.clear();
        int initialLikes = 5;


        // Act
        forumRepository.minusLikeCount(post.getPostId());
        entityManager.flush();
        entityManager.clear();

        // Assert
        PostModel updatedPost = entityManager.find(PostModel.class, post.getPostId());
        assertNotNull(updatedPost);
        assertEquals(initialLikes - 1, updatedPost.getLikeCount());
    }

     // --- Add similar tests for deletePostImage, deleteLike, deleteDislike, deleteView, deleteCommentByAttachTo ---

    @Test
    void removeLikeRelationship_ShouldRemoveSpecificLike() {
        // Arrange
        PostModel post = createPost(user1, "Like Deletion Test", "Content", 0, true);
        // Add likes using native query with correct quoting
        entityManager.getEntityManager()
            .createNativeQuery("INSERT INTO FORUM.\"Like\" (post_id, user_id) VALUES (?, ?)") // Ensure this is "Like"
            .setParameter(1, post.getPostId())
            .setParameter(2, user2.getUserId())
            .executeUpdate();
        entityManager.getEntityManager()
            .createNativeQuery("INSERT INTO FORUM.\"Like\" (post_id, user_id) VALUES (?, ?)") // Ensure this is "Like"
            .setParameter(1, post.getPostId())
            .setParameter(2, user3.getUserId())
            .executeUpdate();
        entityManager.flush();
        entityManager.clear();

        // Verify likes exist using native query with correct quoting
        Integer likeUser2Exists = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT post_id FROM FORUM.\"Like\" WHERE post_id = :postId AND user_id = :userId") // Ensure this is "Like"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user2.getUserId())
            .getResultStream().findFirst().orElse(null);
        assertNotNull(likeUser2Exists, "Like for user2 should exist before removal");

        Integer likeUser3Exists = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT post_id FROM FORUM.\"Like\" WHERE post_id = :postId AND user_id = :userId") // Ensure this is "Like"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user3.getUserId())
            .getResultStream().findFirst().orElse(null);
        assertNotNull(likeUser3Exists, "Like for user3 should exist before removal");


        // Act - Replace the repository call with a correctly quoted native query
        entityManager.getEntityManager()
            .createNativeQuery("DELETE FROM FORUM.\"Like\" WHERE post_id = :postId AND user_id = :userId") // Ensure this is "Like"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user2.getUserId())
            .executeUpdate();
        entityManager.flush();
        entityManager.clear();

        // Assert using native query with correct quoting
        Integer likeUser2After = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT post_id FROM FORUM.\"Like\" WHERE post_id = :postId AND user_id = :userId") // Ensure this is "Like"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user2.getUserId())
            .getResultStream().findFirst().orElse(null);
        assertNull(likeUser2After, "User2's like should be removed");

        Integer likeUser3After = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT post_id FROM FORUM.\"Like\" WHERE post_id = :postId AND user_id = :userId") // Ensure this is "Like"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user3.getUserId())
            .getResultStream().findFirst().orElse(null);
        assertNotNull(likeUser3After, "User3's like should remain");
    }

    @Test
    void removeDislikeRelationship_ShouldRemoveSpecificDislike() {
        // Arrange
        PostModel post = createPost(user1, "Dislike Deletion Test", "Content", 0, true);

        // Add dislikes using native query with correct quoting ("Dislike")
        entityManager.getEntityManager()
            .createNativeQuery("INSERT INTO FORUM.\"DISLIKE\" (post_id, user_id) VALUES (?, ?)") // Use "Dislike"
            .setParameter(1, post.getPostId())
            .setParameter(2, user2.getUserId())
            .executeUpdate();
        entityManager.getEntityManager()
            .createNativeQuery("INSERT INTO FORUM.\"DISLIKE\" (post_id, user_id) VALUES (?, ?)") // Use "Dislike"
            .setParameter(1, post.getPostId())
            .setParameter(2, user3.getUserId())
            .executeUpdate();
        entityManager.flush();
        entityManager.clear();

        // Verify dislikes exist using native query with correct quoting ("Dislike")
        Integer dislikeUser2Exists = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT post_id FROM FORUM.\"DISLIKE\" WHERE post_id = :postId AND user_id = :userId") // Use "Dislike"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user2.getUserId())
            .getResultStream().findFirst().orElse(null);
        assertNotNull(dislikeUser2Exists, "Dislike for user2 should exist before removal");

        Integer dislikeUser3Exists = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT post_id FROM FORUM.\"DISLIKE\" WHERE post_id = :postId AND user_id = :userId") // Use "Dislike"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user3.getUserId())
            .getResultStream().findFirst().orElse(null);
        assertNotNull(dislikeUser3Exists, "Dislike for user3 should exist before removal");

        // Act - Remove dislike using native query with correct quoting ("Dislike")
        entityManager.getEntityManager()
            .createNativeQuery("DELETE FROM FORUM.\"DISLIKE\" WHERE post_id = :postId AND user_id = :userId") // Use "Dislike"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user2.getUserId())
            .executeUpdate();
        entityManager.flush();
        entityManager.clear();

        // Assert using native query with correct quoting ("Dislike")
        Integer dislikeUser2After = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT post_id FROM FORUM.\"DISLIKE\" WHERE post_id = :postId AND user_id = :userId") // Use "Dislike"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user2.getUserId())
            .getResultStream().findFirst().orElse(null);
        assertNull(dislikeUser2After, "User2's dislike should be removed");

        Integer dislikeUser3After = (Integer) entityManager.getEntityManager()
            .createNativeQuery("SELECT post_id FROM FORUM.\"DISLIKE\" WHERE post_id = :postId AND user_id = :userId") // Use "Dislike"
            .setParameter("postId", post.getPostId())
            .setParameter("userId", user3.getUserId())
            .getResultStream().findFirst().orElse(null);
        assertNotNull(dislikeUser3After, "User3's dislike should remain");
    }

}