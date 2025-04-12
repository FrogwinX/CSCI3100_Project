package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.flowchat.backend.DTO.ResponseBodyDTO;
import project.flowchat.backend.Service.ExceptionService;
import project.flowchat.backend.Service.ProfileService;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://kind-wave-0b69df000.6.azurestaticapps.net"})
@RequestMapping("api/Profile")
public class ProfileController {

    @Autowired
    private final ProfileService profileService;
    private ResponseBodyDTO responseBodyDTO;

}
