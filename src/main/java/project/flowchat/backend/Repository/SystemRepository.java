package project.flowchat.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.SystemModel;

import java.util.List;

@Repository
public interface SystemRepository extends JpaRepository<SystemModel, String> {
    @NativeQuery(value = "SELECT * FROM SYSTEM.Info WHERE version = ?1")
    List<SystemModel> findInfoByVersion(String version);
}
