package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.flowchat.backend.Repository.UserProfileRepository;

@AllArgsConstructor
@Service
public class ProfileService {

    @Autowired
    private final UserProfileRepository userProfileRepository;

}
