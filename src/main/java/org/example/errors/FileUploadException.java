package org.example.errors;

import java.util.UUID;

public class FileUploadException extends ApiException {
    public FileUploadException(String name) {
        super("File" + name + "don't upload", "FILE_NOT_UPLOAD");
    }
}
