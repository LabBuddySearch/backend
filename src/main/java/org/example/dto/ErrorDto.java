package org.example.dto;

import java.time.LocalDateTime;

public class ErrorDto {
    private String message;
    private String errorCode;
    private LocalDateTime timestamp;

    public ErrorDto(String message, String errorCode) {
        this.message = message;
        this.errorCode = errorCode;
        this.timestamp = LocalDateTime.now();
    }
}
