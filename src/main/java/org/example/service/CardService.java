package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.CardCreateDto;
import org.example.dto.CardDto;
import org.example.dto.CardEditDto;
import org.example.model.entity.Card;
import org.example.repository.CardRepository;
import org.example.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final UserRepository userRepository;

    public CardDto create(CardCreateDto dto) {

        Card card = Card.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .tags(dto.getTags())
                .authorId(userRepository.findById(
                        dto.getAuthorId()
                ).orElseThrow(() -> new RuntimeException("Пользователь не найден")))
                .type(dto.getType())
                .infoProfiles(dto.getInfoProfiles())
                .build();

        cardRepository.save(card);

        return mapToDto(card);
    }

    public List<CardDto> getCreated(UUID userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Пользователь не найден"))
                .getCards().stream().map(this::mapToDto).toList();
    }

    public CardDto edit(CardEditDto dto) {
        Card card = cardRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Карточка не найдена"));
        if (dto.getTitle() != null) card.setTitle(dto.getTitle());
        if (dto.getDescription() != null) card.setDescription(dto.getDescription());
        if (dto.getTags() != null) card.setTags(dto.getTags());
        if (dto.getType() != null) card.setType(dto.getType());
        if (dto.getInfoProfiles() != null) card.setInfoProfiles(dto.getInfoProfiles());

        cardRepository.save(card);

        return mapToDto(card);
    }

    public String delete(UUID cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Карточка не найдена"));
        cardRepository.delete(card);
        return "Deleted successfully";
    }

    public List<CardDto> getAll() {
        return cardRepository.findAll().stream().map(this::mapToDto).toList();
    }

    public List<CardDto> getFiltered(String university, String city, String type){
        return cardRepository.findAll().stream()
                .filter(card -> card.getType().equalsIgnoreCase(type)).map(this::mapToDto).toList();
    }

    private CardDto mapToDto(Card card) {
        return CardDto.builder()
                .title(card.getTitle())
                .description(card.getDescription())
                .tags(card.getTags())
                .authorId(card.getAuthorId().getId())
                .currentHelpers(card.getCurrentHelpers())
                .status(card.getStatus())
                .type(card.getType())
                .createdAt(card.getCreatedAt())
                .infoProfiles(card.getInfoProfiles())
                .build();
    }

}
