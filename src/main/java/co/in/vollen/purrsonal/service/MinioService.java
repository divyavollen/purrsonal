package co.in.vollen.purrsonal.service;

import java.io.InputStream;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import co.in.vollen.purrsonal.config.MinioConfig;
import co.in.vollen.purrsonal.exception.FileDeleteException;
import co.in.vollen.purrsonal.exception.PhotoUploadException;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioService {

    private final MinioClient minioClient;
    private final MinioConfig minioConfig;

    public String uploadFile(MultipartFile file, String username, String petId, String petName) {

        try (InputStream inputStream = file.getInputStream()) {

            String originalFilename = file.getOriginalFilename();
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            } else {
                extension = ".jpg";
            }

            String filename = String.format("%s/%s-%s%s", username, petId, petName, extension);

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(minioConfig.getBucketName())
                            .object(filename)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build());

            String imageUrl = minioConfig.getExternalURL() + "/" + minioConfig.getBucketName() + "/" + filename;
            return imageUrl;

        } catch (Exception e) {
            log.error("Failed to upload photo", e);
            throw new PhotoUploadException("Failed to upload photo", e);
        }
    }

    public void deleteFile(String username, String petId, String petName, String url) {

        String extension = url.contains(".") ? url.substring(url.lastIndexOf('.') + 1) : "";
        String filename = String.format("%s/%s-%s.%s", username, petId, petName, extension);
        log.info("Deleting file: {}", filename);
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(minioConfig.getBucketName())
                    .object(filename)
                    .build());
        } catch (Exception e) {
            log.error("Failed to delete pet photo", e);
            throw new FileDeleteException("Failed to delete pet photo");
        }
    }
}
