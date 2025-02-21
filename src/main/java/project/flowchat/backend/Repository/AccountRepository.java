package project.flowchat.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.SystemModel;
import project.flowchat.backend.Model.UserAccountModel;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<UserAccountModel, Integer> {

}
