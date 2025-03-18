package project.flowchat.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@NoArgsConstructor

@Data
@Component
public class ResponseBodyDTO {
    private String message;
    private Object data;
}
