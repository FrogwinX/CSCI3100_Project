package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.flowchat.backend.Repository.ForumRepository;

@AllArgsConstructor
@Service
public class ForumService {

    @Autowired
    private final ForumRepository forumRepository;


    public void createPostOrComment() throws Exception {

    }

    public void updatePostOrComment() throws Exception {

    }

    public void deletePostOrComment() throws Exception {

    }    
}
