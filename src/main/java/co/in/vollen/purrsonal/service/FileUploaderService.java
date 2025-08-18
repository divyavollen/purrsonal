package co.in.vollen.purrsonal.service;

import java.io.InputStream;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import co.in.vollen.purrsonal.config.MinioConfig;
import co.in.vollen.purrsonal.exception.PhotoUploadException;
import co.in.vollen.purrsonal.util.AuthUtil;
import io.minio.GetObjectArgs;
import io.minio.ListObjectsArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.Result;
import io.minio.messages.Item;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploaderService {

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

            String safePetName = petName.trim().toLowerCase().replaceAll("[^a-z0-9]+", "_");
            String filename = String.format("%s/%s-%s%s", username, petId, safePetName, extension);

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
            log.error("Failed to upload photo: {}", e);
            throw new PhotoUploadException("Failed to upload photo", e);
        }
    }
}
