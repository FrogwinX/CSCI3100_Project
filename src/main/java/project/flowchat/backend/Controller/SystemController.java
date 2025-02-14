package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.flowchat.backend.Service.SystemService;

@AllArgsConstructor
@RestController
@RequestMapping("api/System")
public class SystemController {

    @Autowired
    private final SystemService systemService;

    @GetMapping("getWebName")
    private String getWebName() {
        return systemService.getWebName();
    }
}
