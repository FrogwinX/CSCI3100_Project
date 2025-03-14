package project.flowchat.backend.Repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.PostModel;
import project.flowchat.backend.Model.UserAccountModel;


@Repository
public interface ForumRepository extends JpaRepository<PostModel, Integer> {

}
