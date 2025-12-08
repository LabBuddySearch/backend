package org.example.controller;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.CardCreateDto;
import org.example.dto.CardDto;
import org.example.dto.CardEditDto;
import org.example.service.CardService;
import org.example.service.MinioService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;
    private final MinioService minioService;

    @PostMapping(value = "/user", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CardDto> createCard(@Valid @ModelAttribute CardCreateDto dto) {

        return ResponseEntity.ok(cardService.create(dto));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CardDto>> getCreatedCards(@PathVariable UUID userId) {
        return ResponseEntity.ok(cardService.getCreated(userId));
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filename + "\"")
                    .body(minioService.getFileAsResource(filename));

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}/liked")
    public ResponseEntity<List<CardDto>> getLikedCards(@PathVariable UUID userId) {
        return ResponseEntity.ok(cardService.getLiked(userId));
    }


    @PatchMapping("/user")
    public ResponseEntity<CardDto> editCard(@Valid @RequestBody CardEditDto dto) {
        return ResponseEntity.ok(cardService.edit(dto));
    }

    @DeleteMapping("/user/{cardId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCard(@PathVariable UUID cardId) {
        cardService.delete(cardId);
    }

    @GetMapping("")
    public ResponseEntity<List<CardDto>> getAllCards() {
        return ResponseEntity.ok(cardService.getAll());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<CardDto>> getFilteredCards(@RequestParam(required = false) String type,
                                                          @RequestParam(required = false) String city,
                                                          @RequestParam(required = false) String study,
                                                          @RequestParam(required = false) Integer course
    ) {
        return ResponseEntity.ok(cardService.getFiltered(type, city, study, course));
    }


}

