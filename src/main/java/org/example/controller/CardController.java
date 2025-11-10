package org.example.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.CardCreateDto;
import org.example.dto.CardDto;
import org.example.dto.CardEditDto;
import org.example.service.CardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping("/user")
    public ResponseEntity<CardDto> createCard(@Valid @RequestBody CardCreateDto dto) {
        return ResponseEntity.ok(cardService.create(dto));
    }

    @GetMapping("/user/{user_id}")
    public ResponseEntity<List<CardDto>> getCreatedCards(@PathVariable UUID userId) {
        return ResponseEntity.ok(cardService.getCreated(userId));
    }

    @PatchMapping("/user")
    public ResponseEntity<CardDto> editCard(@Valid @RequestBody CardEditDto dto) {
        return ResponseEntity.ok(cardService.edit(dto));
    }

    @DeleteMapping("/user/{card_id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<String> deleteCard(@PathVariable UUID cardId) {
        return ResponseEntity.ok(cardService.delete(cardId));
    }

    @GetMapping("")
    public ResponseEntity<List<CardDto>> getAllCards() {
        return ResponseEntity.ok(cardService.getAll());
    }

    @GetMapping("")
    public ResponseEntity<List<CardDto>> getFilteredCards(@RequestParam(required = false) String type,
                                                          @RequestParam(required = false) String subject,
                                                          @RequestParam(required = false) String study,
                                                          @RequestParam(required = false) String city
    ) {
        return ResponseEntity.ok(cardService.getFiltered(type, subject, study, city));
    }
}

