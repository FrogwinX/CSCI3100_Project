package project.flowchat.backend.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;
import project.flowchat.backend.DTO.ChatReceiveMessageDTO;
import project.flowchat.backend.DTO.ChatSendMessageDTO;
import project.flowchat.backend.DTO.ResponseBodyDTO;
import project.flowchat.backend.Service.ChatService;
import project.flowchat.backend.Service.ExceptionService;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://kind-wave-0b69df000.6.azurestaticapps.net"})
@RequestMapping("api/Chat")
public class ChatController {
    
    @Autowired
    private final ChatService chatService;
    private ResponseBodyDTO responseBodyDTO;

    @MessageMapping("/send/{topic}")
    @SendTo("/topic/{topic}")
    public ChatReceiveMessageDTO sendMessge(@DestinationVariable String topic, @Payload ChatSendMessageDTO message) {
        return chatService.sendAndStoreMessage(message);
    }

    @PutMapping("/updateReadAt")
    public ResponseBodyDTO updateReadAt(@RequestBody Map<String, Object> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            chatService.updateReadAt((Integer) requestBody.get("userId"),
                                    (Integer) requestBody.get("messageId"),
                                    (String) requestBody.get("topic"));
            data.put("isSuccess", true);
            responseBodyDTO.setMessage("The message read at time is updated");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @PutMapping("/deleteMessage")
    public ResponseBodyDTO deleteMessage(@RequestBody Map<String, Object> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            chatService.deleteMessage((Integer) requestBody.get("userId"),
                                    (Integer) requestBody.get("messageId"),
                                    (String) requestBody.get("topic"));
            data.put("isSuccess", true);
            responseBodyDTO.setMessage("The message is deleted");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }
}
