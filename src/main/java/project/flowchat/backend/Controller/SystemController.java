package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;
import project.flowchat.backend.DTO.ResponseBodyDTO;
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
    private final ResourceLoader resourceLoader;

    @GetMapping("getAllInfo")
    private ResponseBodyDTO getAllInfo() {
        ResponseBodyDTO responseBodyDTO = new ResponseBodyDTO();
        try {
            List<SystemModel> data = systemService.getAllInfo();
            responseBodyDTO.setMessage("Success");
            responseBodyDTO.setData(data);
        }
        catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @GetMapping("getInfoByVersion")
    private ResponseBodyDTO getInfoByVersion(@RequestParam String version) {
        ResponseBodyDTO responseBodyDTO = new ResponseBodyDTO();
        try {
            SystemModel data = systemService.getInfoByVersion(version);
            if (data != null) {
                responseBodyDTO.setMessage("Success");
                Map<String, Object> info = new HashMap<>();
                info.put("version", data.getVersion());
                info.put("feature", data.getFeature());
                info.put("description", data.getDescription());
                responseBodyDTO.setData(info);
            }
            else {
                responseBodyDTO.setMessage("Version is incorrect");
                responseBodyDTO.setData(null);
            }
        }
        catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }
}
