package project.flowchat.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@AllArgsConstructor
@NoArgsConstructor

@Data
public class UserProfileDTO {
    private Integer userId;
    private String username;
    private String description;
    private String avatar;
    private ZonedDateTime updatedAt;
    private Integer postCount;
    private Integer commentCount;
    private Integer followingCount;
    private Integer followerCount;
    private Integer likeCount;
    private Integer dislikeCount;
    private Boolean isUserBlocked;
}
