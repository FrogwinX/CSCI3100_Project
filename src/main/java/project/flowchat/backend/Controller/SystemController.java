package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.flowchat.backend.Model.ResponseBody;
import project.flowchat.backend.Model.SystemModel;
import project.flowchat.backend.Service.SystemService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("api/System")
public class SystemController {

    @Autowired
    private final SystemService systemService;

    @GetMapping("getAllInfo")
    private ResponseBody getAllInfo() {
        ResponseBody responseBody = new ResponseBody();
        try {
            List<SystemModel> data = systemService.getAllInfo();
            responseBody.setMessage("Success");
            responseBody.setData(data);
        }
        catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }

    @GetMapping("getInfoByVersion")
    private ResponseBody getInfoByVersion(@RequestParam String version) {
        ResponseBody responseBody = new ResponseBody();
        try {
            SystemModel data = systemService.getInfoByVersion(version);
            responseBody.setMessage("Success");
            Map<String, Object> info = new HashMap<>();
            info.put("version", data.getVersion());
            info.put("feature", data.getFeature());
            info.put("description", data.getDescription());
            responseBody.setData(info);
        }
        catch (Exception e) {
            responseBody.setMessage("Fail: " + e);
            responseBody.setData(null);
        }
        return responseBody;
    }
}
