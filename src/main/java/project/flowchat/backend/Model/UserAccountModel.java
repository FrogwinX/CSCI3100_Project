package project.flowchat.backend.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor

@Data
@Entity
@Table(schema = "ACCOUNT", name = "UserAccount")
public class UserAccountModel {
    @Id
    private Integer userId;
    private String username;
    private String email;
    private String passwordHash;
    private Boolean isActive;
    private Integer roleId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
