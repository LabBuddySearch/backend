package org.example.errors;

import java.util.UUID;

public class FileNotFoundException extends ApiException {
    public FileNotFoundException(UUID id){
        super("File with this id " + id + " not found", "FILE_NOT_FOUND");
    }
}
