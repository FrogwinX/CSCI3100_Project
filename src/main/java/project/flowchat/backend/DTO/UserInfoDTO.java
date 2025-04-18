package project.flowchat.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@AllArgsConstructor
@NoArgsConstructor

@Data
public class UserInfoDTO {
    private Integer userId;
    private String username;
    private String description;
    private String avatar;
    private ZonedDateTime updatedAt;
    private String status; // "following", "blocking" or "not following"
}
