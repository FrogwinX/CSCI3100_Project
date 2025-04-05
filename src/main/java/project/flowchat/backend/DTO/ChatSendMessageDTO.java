package project.flowchat.backend.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor

@Data
public class ChatSendMessageDTO {
    private Integer userIdFrom;
    private Integer userIdTo;
    private String content;
    private Integer attachTo;
    private List<Integer> imageIdList;
    private String action;
    private List<Integer> messageIdList;
}
