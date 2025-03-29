package project.flowchat.backend.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import project.flowchat.backend.Service.SecurityService;

@Component
@AllArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {
    
    @Autowired
    private final SecurityService securityService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            try {
                String authToken = accessor.getFirstNativeHeader("Authorization");

                if (authToken != null && authToken.startsWith("Bearer ")) {
                    String jwtToken = authToken.substring(7); // Remove "Bearer " prefix
                    securityService.validateToken(jwtToken);
                    return message;
                }
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid JWT");
            }
        }

        return message;
    }
}
