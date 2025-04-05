package project.flowchat.backend.DTO;

import java.time.ZonedDateTime;
import java.util.List;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor

@Data
public class ChatMessageDetailsDTO {
    @Id
    private Integer messageId;
    private Integer userIdFrom;
    private Integer userIdTo;
    private String content;
    private Integer attachTo;
    private ZonedDateTime sentAt;
    private ZonedDateTime readAt;
    private List<String> imageAPIList;
}
