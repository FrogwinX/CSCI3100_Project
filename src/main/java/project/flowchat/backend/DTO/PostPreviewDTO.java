package project.flowchat.backend.DTO;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class PostPreviewDTO extends PostDTO {
    private String description;
}
