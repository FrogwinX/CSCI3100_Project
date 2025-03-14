package project.flowchat.backend.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@NoArgsConstructor

@Data
@Component
public class ResponseBody {
    private String message;
    private Object data;
}
