package project.flowchat.backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@AllArgsConstructor
@NoArgsConstructor

@Data
@Entity
@Table(schema = "PROFILE", name = "UserProfile")
public class UserProfileModel {
    @Id
    private Integer userId;

    private String username;
    private String description;
    private Integer avatarId;
    private ZonedDateTime updatedAt;
}
