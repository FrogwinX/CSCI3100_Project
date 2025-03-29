package project.flowchat.backend.Model;

import java.time.ZonedDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor

@Data
@Entity
@Table(schema = "CHAT", name = "Message")
public class MessageModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer messageId;

    private Integer userIdFrom;
    private Integer userIdTo;
    private String content;
    private Integer attachTo;
    private Boolean isActive;
    private ZonedDateTime sentAt;
    private ZonedDateTime readAt;
}
