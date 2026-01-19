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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
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
        
        if (files == null || files.isEmpty()) {
            return uploaded;
        }
        
        for (MultipartFile file : files) {
            try {
                // Пропускаем пустые файлы и файлы-маркеры
                if (file == null || 
                    file.isEmpty() || 
                    file.getOriginalFilename() == null ||
                    file.getOriginalFilename().contains("__NO_FILES__") ||
                    file.getOriginalFilename().trim().isEmpty()) {
                    log.debug("Пропущен пустой файл или маркер: {}", 
                             file != null ? file.getOriginalFilename() : "null");
                    continue;
                }
                
                uploaded.add(uploadSingleFile(file));
            } catch (Exception e) {
                log.error("Ошибка при загрузке файла {}: {}",
                        file != null ? file.getOriginalFilename() : "null", e.getMessage());
                throw new FileUploadException(file != null ? file.getName() : "unknown");
            }
        }
        return uploaded;
    }

    private File uploadSingleFile(MultipartFile file) throws Exception {
        // Убеждаемся, что bucket существует
        createBucketIfNotExists();

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new IllegalArgumentException("Имя файла не может быть пустым");
        }

        String fileExtension = getFileExtension(originalFilename);
        String storageFilename = generateStorageFilename(fileExtension);

        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(storageFilename)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                            .build()
            );
        } catch (Exception e) {
            log.error("Ошибка при загрузке файла в MinIO: {}", originalFilename, e);
            throw new FileUploadException("Не удалось загрузить файл: " + originalFilename);
        }

        File new_file = File.builder()
                .cardId(card)
                .original(originalFilename)
                .storage(storageFilename)
                .build();

        fileRepository.save(new_file);
        log.debug("Файл успешно загружен: {} -> {}", originalFilename, storageFilename);
        return new_file;
    }

    public Resource getFileAsResource(String storageFilename) throws Exception {
        try {
            // Проверяем существование файла в MinIO
            minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucketName)
                            .object(storageFilename)
                            .build()
            );
            
            // Если файл существует, получаем его
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(storageFilename)
                            .build()
            );

            return new InputStreamResource(stream);
        } catch (io.minio.errors.ErrorResponseException e) {
            log.error("Файл не найден в MinIO: {}", storageFilename);
            throw new FileNotFoundException(storageFilename);
        } catch (Exception e) {
            log.error("Ошибка при получении файла {}: {}", storageFilename, e.getMessage());
            throw new FileNotFoundException(storageFilename);
        }
    }


    public void deleteFile(UUID fileId) throws Exception {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new FileNotFoundException(fileId));
        minioClient.removeObject(
                RemoveObjectArgs.builder()
                        .bucket(bucketName)
                        .object(file.getStorage())
                        .build()
        );
        fileRepository.delete(file);
    }

    private void createBucketIfNotExists() throws Exception {
        try {
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
                log.info("✅ MinIO bucket '{}' успешно создан", bucketName);
            }
        } catch (Exception e) {
            log.error("❌ Ошибка при проверке/создании MinIO bucket '{}': {}", bucketName, e.getMessage());
            throw e;
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


