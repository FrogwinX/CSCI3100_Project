package project.flowchat.backend.Service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import project.flowchat.backend.Model.ImageModel;
import project.flowchat.backend.Repository.ImageRepository;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Optional;

import net.coobird.thumbnailator.Thumbnails;

@AllArgsConstructor
@Service
public class ImageService {

    @Autowired
    private final ImageRepository imageRepository;

    public final String deploymentGetImageAPI = "https://flowchatbackend.azurewebsites.net/api/Image/getImageByImageId?imageId=";
    public final String localhostGetImageAPI = "http://localhost:8080/api/Image/getImageByImageId?imageId=";
    private static final long MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

    private static byte[] compressImage(MultipartFile file) throws Exception {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        byte[] compressedImage;
        float quality = 1.0f;
        do {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            Thumbnails.of(originalImage)
                    .scale(1.0)
                    .outputQuality(quality)
                    .outputFormat(file.getContentType().replace("image/", ""))
                    .toOutputStream(byteArrayOutputStream);
            compressedImage = byteArrayOutputStream.toByteArray();
            quality -= 0.1f;
            if (quality <= 0) {
                throw new ExceptionService("The image cannot be compressed under 5MB");
            }
        } while (compressedImage.length > MAX_IMAGE_SIZE);
        return compressedImage;
    }

    public Integer saveImage(MultipartFile file) throws Exception {
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new ExceptionService("The file is not an image");
        }
        ImageModel imageModel = new ImageModel();
        if (file.getSize() > MAX_IMAGE_SIZE) {
            imageModel.setImageData(compressImage(file));
        }
        else {
            imageModel.setImageData(file.getBytes());
        }
        imageModel.setImageName(file.getOriginalFilename());
        imageModel.setImageFormat(file.getContentType());
        imageRepository.save(imageModel);
        return imageModel.getImageId();
    }

    public Optional<ImageModel> getImage(Integer imageId) throws Exception {
        return imageRepository.findById(imageId);
    }

    /**
     * Change the binary of image in the database of the given image id
     * @param file new file of the image
     * @param imageId image id of the record
     * @throws Exception
     */
    @Transactional
    public void changeImage(MultipartFile file, int imageId) throws Exception {
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new ExceptionService("The file is not an image");
        }
        ImageModel imageModel = getImage(imageId).get();

        if (file.getSize() > MAX_IMAGE_SIZE) {
            imageModel.setImageData(compressImage(file));
        }
        else {
            imageModel.setImageData(file.getBytes());
        }
        imageModel.setImageName(file.getOriginalFilename());
        imageModel.setImageFormat(file.getContentType());
        imageRepository.save(imageModel);        
    }
}
