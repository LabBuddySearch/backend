package org.example.service;

import io.minio.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.errors.FileNotFoundException;
import org.example.errors.FileUploadException;
import org.example.model.entity.Card;
import org.example.model.entity.File;
import org.example.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinioService {

    @Autowired
    private MinioClient minioClient;

    private final FileRepository fileRepository;

    @Value("${minio.bucket-name}")
    private String bucketName;

    private Card card;

    public List<File> uploadFiles(List<MultipartFile> files, Card c) {
        card = c;
        List<File> uploaded = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                uploaded.add(uploadSingleFile(file));
            } catch (Exception e) {
                log.error("Ошибка при загрузке файла {}: {}",
                        file.getOriginalFilename(), e.getMessage());
                throw new FileUploadException(file.getName());
            }
        }
        return uploaded;
    }

    private File uploadSingleFile(MultipartFile file) throws Exception {
        try {
            createBucketIfNotExists();
        } catch (Exception e) {
            log.error("Ошибка при создании бакета");
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String storageFilename = generateStorageFilename(fileExtension);

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(storageFilename)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );

        File new_file = File.builder()
                .cardId(card)
                .original(originalFilename)
                .storage(storageFilename)
                .build();

        fileRepository.save(new_file);
        return new_file;
    }

    public Resource getFileAsResource(String storageFilename) throws Exception {
        InputStream stream = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(storageFilename)
                        .build()
        );

        return new InputStreamResource(stream);
    }

    public void deleteFile(UUID fileId) throws Exception {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new FileNotFoundException(fileId));
        fileRepository.delete(file);
        minioClient.removeObject(
                RemoveObjectArgs.builder()
                        .bucket(bucketName)
                        .object(file.getStorage())
                        .build()
        );

    }

    private void createBucketIfNotExists() throws Exception {
        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                        .bucket(bucketName)
                        .build()
        );

        if (!exists) {
            minioClient.makeBucket(
                    MakeBucketArgs.builder()
                            .bucket(bucketName)
                            .build()
            );
        }
    }

    private String generateStorageFilename(String extension) {
        return UUID.randomUUID().toString() +
                (extension != null && !extension.isEmpty() ? "." + extension : "");
    }

    private String getFileExtension(String filename) {
        if (filename == null) return "";
        int lastDot = filename.lastIndexOf('.');
        return (lastDot == -1) ? "" : filename.substring(lastDot + 1);
    }
}


