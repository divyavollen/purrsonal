package co.in.vollen.purrsonal.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import co.in.vollen.purrsonal.exception.BucketCreationException;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.SetBucketPolicyArgs;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class MinioBucketCreator {

  private final MinioClient minioClient;

  @Value("${minio.bucketName}")
  private String bucketName;

  @PostConstruct
  public void createBucketIfNotExists() {
    try {
      boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
      if (!bucketExists) {
        log.info("Bucket {} does not exist. Creating now...", bucketName);
        minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        
        String policyJson = """
            {
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Effect": "Allow",
                  "Principal": "*",
                  "Action": [
                    "s3:GetBucketLocation",
                    "s3:ListBucket"
                  ],
                  "Resource": [
                    "arn:aws:s3:::%s"
                  ]
                },
                {
                  "Effect": "Allow",
                  "Principal": "*",
                  "Action": "s3:GetObject",
                  "Resource": [
                    "arn:aws:s3:::%s/*"
                  ]
                }
              ]
            }
            """.formatted(bucketName, bucketName);

        minioClient.setBucketPolicy(
            SetBucketPolicyArgs.builder()
                .bucket(bucketName)
                .config(policyJson)
                .build());
      }

    } catch (Exception e) {
      log.error("Failed to create bucket", e);
      throw new BucketCreationException("Error creating bucket: " + bucketName, e);
    }
  }
}
