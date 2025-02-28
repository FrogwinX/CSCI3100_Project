package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.flowchat.backend.Model.SystemModel;
import project.flowchat.backend.Repository.SystemRepository;

import java.util.List;

@AllArgsConstructor
@Service
public class SystemService {

    @Autowired
    private final SystemRepository systemRepository;

    public List<SystemModel> getAllInfo() throws Exception {
        return systemRepository.findAll();
    }

    public SystemModel getInfoByVersion(String version) throws Exception {
        return systemRepository.findInfoByVersion(version);
    }
}
