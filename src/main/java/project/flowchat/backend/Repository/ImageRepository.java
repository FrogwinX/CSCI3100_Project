package project.flowchat.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import project.flowchat.backend.Model.ImageModel;

@Repository
public interface ImageRepository extends JpaRepository<ImageModel, Integer> {

    /**
     * Delete an image by imageId
     * @param imageId imageId Integer
     */
    @Modifying
    @Transactional
    @NativeQuery("DELETE FROM IMAGE.Image_Data WHERE image_id = ?1")
    void deleteImageById(Integer imageId);
}
