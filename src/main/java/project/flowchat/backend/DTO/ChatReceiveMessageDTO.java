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
public class ChatReceiveMessageDTO {
    @Id
    private ChatMessageDetailsDTO messageDetail;
    private List<Integer> readOrDeleteMessageIdList;
    private String action;
    private String time;
    private Boolean success;
    private String errorMessage;
}
