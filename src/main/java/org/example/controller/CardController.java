package org.example.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.CardCreateDto;
import org.example.dto.CardDto;
import org.example.dto.CardEditDto;
import org.example.service.CardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping(value = "/user", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CardDto> createCard(
            @RequestParam("authorId") UUID authorId,
            @RequestParam("type") String type,
            @RequestParam("subject") String subject,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "study", required = false) String study,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "course", defaultValue = "0") int course,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        
        CardCreateDto dto = new CardCreateDto();
        dto.setAuthorId(authorId);
        dto.setType(type);
        dto.setSubject(subject);
        dto.setTitle(title);
        dto.setDescription(description);
        dto.setStudy(study);
        dto.setCity(city);
        dto.setCourse(course);
        dto.setFiles(files);
        
        return ResponseEntity.ok(cardService.create(dto));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CardDto>> getCreatedCards(@PathVariable UUID userId) {
        return ResponseEntity.ok(cardService.getCreated(userId));
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

