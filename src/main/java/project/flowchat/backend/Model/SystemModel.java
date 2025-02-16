package project.flowchat.backend.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor

@Data
@Entity
@Table(schema = "SYSTEM", name = "INFO")
public class SystemModel {
    @Id
    private String version;
    private String feature;
    private String description;
}
