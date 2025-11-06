package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.CardCreateDto;
import org.example.dto.CardDto;
import org.example.dto.CardEditDto;
import org.example.model.entity.Card;
import org.example.model.entity.User;
import org.example.repository.CardRepository;
import org.example.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final UserRepository userRepository;

    public CardDto create(CardCreateDto dto) {

        User author = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));


        Card card = Card.builder()
                .type(dto.getType())
                .subject(dto.getSubject())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .study(dto.getStudy() == null ? author.getStudy() : dto.getStudy())
                .city(dto.getCity() == null ? author.getCity() : dto.getCity())
                .course(dto.getCourse())
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

        if (dto.getType() != null) card.setType(dto.getType());
        if (dto.getSubject() != null) card.setSubject(dto.getSubject());
        if (dto.getTitle() != null) card.setTitle(dto.getTitle());
        if (dto.getDescription() != null) card.setDescription(dto.getDescription());
        if (dto.getStudy() != null) card.setStudy(dto.getStudy());
        if (dto.getCity() != null) card.setCity(dto.getCity());
        if (dto.getCourse() != 0) card.setCourse(dto.getCourse());

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

    public List<CardDto> getFiltered(String type, String subject, String study, String city) {
        Specification<Card> spec = Specification.where(null);
        if (type != null) spec = spec.and(CardSpecification.hasType(type));
        if (subject != null) spec = spec.and(CardSpecification.hasSubject(subject));
        if (study != null) spec = spec.and(CardSpecification.hasStudy(study));
        if (city != null) spec = spec.and(CardSpecification.hasCity(city));

        return cardRepository.findAll(spec).stream()
                .map(this::mapToDto)
                .toList();
    }

    private CardDto mapToDto(Card card) {
        return CardDto.builder()
                .authorId(card.getAuthorId().getId())
                .type(card.getType())
                .subject(card.getSubject())
                .title(card.getTitle())
                .description(card.getDescription())
                .study(card.getStudy())
                .city(card.getCity())
                .course(card.getCourse())
                .status(card.getStatus())
                .currentHelpers(card.getCurrentHelpers())
                .createdAt(card.getCreatedAt())
                .build();
    }

}
