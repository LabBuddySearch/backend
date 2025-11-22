package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.CardCreateDto;
import org.example.dto.CardDto;
import org.example.dto.CardEditDto;
import org.example.errors.CardNotFoundException;
import org.example.errors.UserNotFoundException;
import org.example.model.entity.Card;
import org.example.model.entity.User;
import org.example.repository.CardRepository;
import org.example.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final UserRepository userRepository;


    public CardDto create(CardCreateDto dto) {

        User author = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new UserNotFoundException(dto.getAuthorId()));
        Card card = Card.builder()
                .authorId(author)
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

        return userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId))
                .getCards().stream().map(this::mapToDto).toList();
    }

    public List<CardDto> getLiked(UUID userId) {

        return cardRepository.findLikedCardsByUserId(userId)
                .stream().map(this::mapToDto).toList();
    }

    public CardDto edit(CardEditDto dto) {

        Card card = cardRepository.findById(dto.getId())
                .orElseThrow(() -> new CardNotFoundException(dto.getId()));

        if (dto.getType() != null) card.setType(dto.getType());
        if (dto.getSubject() != null) card.setSubject(dto.getSubject());
        if (dto.getTitle() != null) card.setTitle(dto.getTitle());
        if (dto.getDescription() != null) card.setDescription(dto.getDescription());
        if (dto.getStudy() != null) card.setStudy(dto.getStudy());
        if (dto.getCity() != null) card.setCity(dto.getCity());
        if (dto.getCourse() != null) card.setCourse(dto.getCourse());

        cardRepository.save(card);
        return mapToDto(card);
    }

    public void delete(UUID cardId) throws CardNotFoundException {

        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new CardNotFoundException(cardId));
        cardRepository.delete(card);
    }

    public List<CardDto> getAll() {

        return cardRepository.findAll().stream().map(this::mapToDto).toList();

    }

    public List<CardDto> getFiltered(String type, String city, String study, Integer course) {

        Specification<Card> spec = Specification.where(null);
        if (type != null) spec = spec.and(CardSpecification.hasType(type));
        if (course != null) spec = spec.and(CardSpecification.hasCourse(course));
        if (study != null) spec = spec.and(CardSpecification.hasStudy(study));
        if (city != null) spec = spec.and(CardSpecification.hasCity(city));

        return cardRepository.findAll(spec).stream()
                .map(this::mapToDto)
                .toList();

    }



    private CardDto mapToDto(Card card) {
        return CardDto.builder()
                .id(card.getId())
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
