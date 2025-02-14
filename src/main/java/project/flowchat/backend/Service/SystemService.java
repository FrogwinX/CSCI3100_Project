package project.flowchat.backend.Service;

import org.springframework.stereotype.Service;

@Service
public class SystemService {
    public String getWebName() {
        return "FlowChat";
    }
}
