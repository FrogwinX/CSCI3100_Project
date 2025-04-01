package project.flowchat.backend.DTO;

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
    private ChatMessageDetailsDTO message;
    private Boolean success;
    private String errorMessage;
    private Boolean refresh;
    private List<Integer> refreshMessageIdList;
}
