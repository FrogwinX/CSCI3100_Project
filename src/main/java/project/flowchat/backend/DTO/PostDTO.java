package project.flowchat.backend.DTO;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor

@Data
public class PostDTO {
    @Id
    private Integer postId;
    private String username;
    private String title;
    private String content;
    private List<String> imageAPIList;
    private List<String> tagNameList;
    private Integer likeCount;
    private Boolean isLiked;
    private Integer dislikeCount;
    private Boolean isDisliked;
    private Integer commentCount;
    private String updatedAt;
    private List<PostDTO> commentList;
}
