package project.flowchat.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import project.flowchat.backend.DTO.ChatReceiveMessageDTO;
import project.flowchat.backend.DTO.ChatSendMessageDTO;
import project.flowchat.backend.Service.ChatService;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://kind-wave-0b69df000.6.azurestaticapps.net"})
@RequestMapping("api/Chat")
public class ChatController {
    
    @Autowired
    private final ChatService chatService;

    @MessageMapping("/send/{topic}")
    @SendTo("/topic/{topic}")
    public ChatReceiveMessageDTO sendMessge(@DestinationVariable String topic, @Payload ChatSendMessageDTO message) {
        return chatService.sendAndStoreMessage(message);
    }
}
