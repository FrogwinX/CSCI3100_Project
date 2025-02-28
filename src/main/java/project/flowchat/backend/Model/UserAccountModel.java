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
@Table(schema = "ACCOUNT", name = "UserAccount")
public class UserAccountModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    private String username;
    private String email;
    private String passwordHash;
    private Boolean isActive;
    private Integer roleId;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
