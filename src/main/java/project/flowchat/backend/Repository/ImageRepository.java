package project.flowchat.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.ImageModel;

@Repository
public interface ImageRepository extends JpaRepository<ImageModel, Integer> {
}
