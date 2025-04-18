package project.flowchat.backend.DTO;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor

@Data
public class ContactDTO {
    @Id
    private Integer messageId;
    private Integer contactUserId;
    private String contactUsername;
    private String contactUserAvatar;
    private String latestMessage;
    private Integer userIdFrom;
    private String usernameFrom;
    private Integer userIdTo;
    private String usernameTo;
    private ZonedDateTime sentAt;
    private ZonedDateTime readAt;
    private Integer unreadMessageCount;
}
