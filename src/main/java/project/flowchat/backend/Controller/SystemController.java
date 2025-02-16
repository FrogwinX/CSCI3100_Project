package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.flowchat.backend.Model.SystemModel;
import project.flowchat.backend.Service.SystemService;

import java.util.List;

@AllArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("api/System")
public class SystemController {

    @Autowired
    private final SystemService systemService;

    @GetMapping("getAllInfo")
    private List<SystemModel> getAllInfo() {
        return systemService.getAllInfo();
    }

    @GetMapping("getInfoByVersion")
    private List<SystemModel> getInfoByVersion(@RequestParam String version) {
        return systemService.getInfoByVersion(version);
    }
}
