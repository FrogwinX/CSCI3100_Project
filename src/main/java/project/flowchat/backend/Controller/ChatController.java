package project.flowchat.backend.Controller;

import java.util.HashMap;
import java.util.List;
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
import project.flowchat.backend.DTO.ContactDTO;
import project.flowchat.backend.DTO.ResponseBodyDTO;
import project.flowchat.backend.Model.MessageModel;
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
    public ChatReceiveMessageDTO sendMessage(@DestinationVariable String topic, @Payload ChatSendMessageDTO message) {
        return chatService.sendAndStoreMessage(message);
    }

    @SuppressWarnings("unchecked")
    @PutMapping("/updateReadAt")
    public ResponseBodyDTO updateReadAt(@RequestBody Map<String, Object> requestBody) {
        try {
            Map<String, Object> data = new HashMap<>();
            chatService.updateReadAt((Integer) requestBody.get("userId"),
                                    (List<Integer>) requestBody.get("messageIdList"),
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

    @GetMapping("getContactList")
    private ResponseBodyDTO getContactList(@RequestParam Integer userId,
                                           @RequestParam(value = "excludingUserIdList") List<Integer> excludingUserIdList,
                                           @RequestParam Integer contactNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<ContactDTO> contactList = chatService.getContactList(userId, excludingUserIdList, contactNum);
            data.put("isSuccess", true);
            data.put("contactList", contactList);
            responseBodyDTO.setMessage("The contact list is returned");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("contactList", null);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @GetMapping("getMessageHistoryList")
    private ResponseBodyDTO getMessageHistoryList(  @RequestParam Integer userId,
                                                    @RequestParam Integer contactUserId,
                                                    @RequestParam(value = "excludingMessageIdList") List<Integer> excludingMessageIdList,
                                                    @RequestParam Integer messageNum) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<ChatReceiveMessageDTO> messageHistoryList = chatService.getMessageHistoryList(userId, contactUserId, excludingMessageIdList, messageNum);
            data.put("isSuccess", true);
            data.put("messageHistoryList", messageHistoryList);
            responseBodyDTO.setMessage("The contact list is returned");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("messageHistoryList", null);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @GetMapping("getUnreadMessageCount")
    private ResponseBodyDTO getUnreadMessageCount(@RequestParam Integer userId) {
        try {
            Map<String, Object> data = new HashMap<>();
            Integer unreadMessageCount = chatService.getTotalUnreadMessageCount(userId);
            data.put("isSuccess", true);
            data.put("unreadMessageCount", unreadMessageCount);
            responseBodyDTO.setMessage("The total unread message count is returned");
            responseBodyDTO.setData(data);
        } catch (ExceptionService e) {
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("unreadMessageCount", null);
            responseBodyDTO.setMessage(e.getMessage());
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }
}
