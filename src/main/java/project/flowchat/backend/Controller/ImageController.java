package project.flowchat.backend.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.flowchat.backend.Model.ImageModel;
import project.flowchat.backend.DTO.ResponseBodyDTO;
import project.flowchat.backend.Service.ExceptionService;
import project.flowchat.backend.Service.ImageService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@AllArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("api/Image")
public class ImageController {

    @Autowired
    private final ImageService imageService;
    private ResponseBodyDTO responseBodyDTO;

    @PostMapping(path = "uploadImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    private ResponseBodyDTO uploadImage(@RequestPart MultipartFile file) {
        try {
            Map<String, Object> data = new HashMap<>();
            Integer imageId = imageService.saveImage(file);
            data.put("isSuccess", true);
            data.put("imageId", imageId);
            data.put("imageAPI", imageService.deploymentGetImageAPI + imageId);
            responseBodyDTO.setData(data);
            responseBodyDTO.setMessage("The image is saved");
        } catch (ExceptionService e) {
            responseBodyDTO.setMessage(e.getMessage());
            Map<String, Object> data = new HashMap<>();
            data.put("isSuccess", false);
            data.put("imageId", null);
            responseBodyDTO.setData(data);
        } catch (Exception e) {
            responseBodyDTO.setMessage("Fail: " + e);
            responseBodyDTO.setData(null);
        }
        return responseBodyDTO;
    }

    @GetMapping("getImageByImageId")
    private ResponseEntity<byte[]> getImageByImageId(@RequestParam Integer imageId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            Optional<ImageModel> image = imageService.getImage(imageId);
            if (image.isPresent()) {
                switch (image.get().getImageFormat()) {
                    case "image/png": headers.setContentType(MediaType.IMAGE_PNG); break;
                    case "image/gif": headers.setContentType(MediaType.IMAGE_GIF); break;
                    default: headers.setContentType(MediaType.IMAGE_JPEG);
                }

                return new ResponseEntity<>(image.get().getImageData(), headers, HttpStatus.OK);
            }
        } catch (ExceptionService e) {

        } catch (Exception e) {

        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}
