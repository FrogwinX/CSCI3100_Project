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
@Table(schema = "ACCOUNT", name = "Authentication")
public class LicenseModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer keyId;

    private String keyCode;
    private String email;
    private ZonedDateTime createdAt;
    private ZonedDateTime expiresAt;
    private Boolean isAvailable;
}
