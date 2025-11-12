package org.example.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.dto.ErrorDto;
import org.example.errors.CardNotFoundException;
import org.example.errors.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice(basePackages = "org.example")
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorDto> handleUserNotFound(
            UserNotFoundException ex,
            WebRequest request
    ) {

        ErrorDto error = new ErrorDto(
                ex.getMessage(),
                ex.getErrorCode()
        );

        log.warn("User not found: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(CardNotFoundException.class)
    public ResponseEntity<ErrorDto> handleCardNotFound(
            CardNotFoundException ex,
            WebRequest request
    ) {

        ErrorDto error = new ErrorDto(
                ex.getMessage(),
                ex.getErrorCode()
        );

        log.warn("Card not found: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> handleAllUncaught(
            Exception ex,
            WebRequest request
    ) {

        ErrorDto error = new ErrorDto(
                ex.getMessage(),
                "INTERNAL_ERROR"
        );

        log.error("Internal server error: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
