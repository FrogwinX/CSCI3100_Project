package project.flowchat.backend.DTO;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class PostContentDTO extends PostDTO {
    private String content;
    private List<PostContentDTO> commentList;
}
