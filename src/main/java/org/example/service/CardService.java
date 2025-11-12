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

//    private final CardRepository cardRepository;
//    private final UserRepository userRepository;

    private final User user = User.builder()
            .id(UUID.fromString("3f05c89b-2036-4446-8fd0-b5807ba47bbd"))
            .name("Иван")
            .email("email@example.com")
            .study("МТУСИ")
            .city("Москва")
            .build();

    private final List<Card> cards = new ArrayList<>(List.of(
            Card.builder()
                    .id(UUID.randomUUID())
                    .authorId(user)
                    .type("Лабораторная")
                    .subject("СиАОД")
                    .title("Интерполяция")
                    .description("Нарисовать графики, отображающие основные полиномы.")
                    .study("МТУСИ")
                    .city("Москва")
                    .course(3)
                    .build(),

            Card.builder()
                    .id(UUID.randomUUID())
                    .authorId(user)
                    .type("Практическая")
                    .subject("ФинГрамотность")
                    .title("Инвестиции")
                    .study("МТУСИ")
                    .city("Москва")
                    .course(3)
                    .build(),

            Card.builder()
                    .id(UUID.randomUUID())
                    .authorId(user)
                    .type("Лабораторная")
                    .subject("ИТиП")
                    .title("Spring")
                    .description("Сделать базовое приложение.")
                    .study("МТУСИ")
                    .city("Москва")
                    .course(2)
                    .build(),

            Card.builder()
                    .id(UUID.randomUUID())
                    .authorId(user)
                    .type("Лабораторная")
                    .subject("Физика")
                    .title("Электромагнетизм")
                    .study("МФТИ")
                    .city("Москва")
                    .course(1)
                    .build(),

            Card.builder()
                    .id(UUID.randomUUID())
                    .authorId(user)
                    .type("Практическая")
                    .subject("Философия")
                    .title("Идеализм и материализм")
                    .description("Сравнительный анализ.")
                    .study("МФТИ")
                    .city("Москва")
                    .course(2)
                    .build()
    ));


    public CardDto create(CardCreateDto dto) {

//  Для реальной бд
//        User author = userRepository.findById(dto.getAuthorId())
//                .orElseThrow(() -> new UserNotFoundException(dto.getAuthorId()));
//        Card card = Card.builder()
//                .authorId(author)
//                .type(dto.getType())
//                .subject(dto.getSubject())
//                .title(dto.getTitle())
//                .description(dto.getDescription())
//                .study(dto.getStudy() == null ? author.getStudy() : dto.getStudy())
//                .city(dto.getCity() == null ? author.getCity() : dto.getCity())
//                .course(dto.getCourse())
//                .build();

        //  cardRepository.save(card);

        // Для тестирования
        Card card = Card.builder()
                .id(UUID.randomUUID())
                .authorId(user)
                .type(dto.getType())
                .subject(dto.getSubject())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .study(dto.getStudy() == null ? user.getStudy() : dto.getStudy())
                .city(dto.getCity() == null ? user.getCity() : dto.getCity())
                .course(dto.getCourse())
                .build();

        cards.add(card);

        return mapToDto(card);
    }

    public List<CardDto> getCreated(UUID userId) {

//        return userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId))
//                .getCards().stream().map(this::mapToDto).toList();

        return cards.stream().map(this::mapToDto).toList();
    }

    public CardDto edit(CardEditDto dto) {

//        Card card = cardRepository.findById(dto.getId())
//                .orElseThrow(() -> new CardNotFoundException(dto.getId()));

        Card card = cards.stream().filter(c -> c.getId().equals(dto.getId())).findFirst().orElseThrow(
                () -> new CardNotFoundException(dto.getId())
        );

        if (dto.getType() != null) card.setType(dto.getType());
        if (dto.getSubject() != null) card.setSubject(dto.getSubject());
        if (dto.getTitle() != null) card.setTitle(dto.getTitle());
        if (dto.getDescription() != null) card.setDescription(dto.getDescription());
        if (dto.getStudy() != null) card.setStudy(dto.getStudy());
        if (dto.getCity() != null) card.setCity(dto.getCity());
        if (dto.getCourse() != 0) card.setCourse(dto.getCourse());


//        cardRepository.save(card);

        return mapToDto(card);
    }

    public void delete(UUID cardId) {

//        Card card = cardRepository.findById(cardId)
//                .orElseThrow(() -> new CardNotFoundException(cardId));
//        cardRepository.delete(card);

        Card card = cards.stream().filter(c -> c.getId().equals(cardId)).findFirst().orElseThrow(
                () -> new CardNotFoundException(cardId)
        );
        cards.remove(card);

    }

    public List<CardDto> getAll() {

//        return cardRepository.findAll().stream().map(this::mapToDto).toList();

        return cards.stream().map(this::mapToDto).toList();
    }

    public List<CardDto> getFiltered(String type, String city, String study, Integer course) {

//        Specification<Card> spec = Specification.where(null);
//        if (type != null) spec = spec.and(CardSpecification.hasType(type));
//        if (course != null) spec = spec.and(CardSpecification.hasCity(course));
//        if (study != null) spec = spec.and(CardSpecification.hasStudy(study));
//        if (city != null) spec = spec.and(CardSpecification.hasCity(city));
//
//        return cardRepository.findAll(spec).stream()
//                .map(this::mapToDto)
//                .toList();
//

        List<Card> result = new ArrayList<>(cards);
        if (type != null) {
            result = result.stream().filter(c -> c.getType().equalsIgnoreCase(type)).toList();
        }
        if (study != null) {
            result = result.stream().filter(c -> c.getStudy().equalsIgnoreCase(study)).toList();
        }
        if (city != null) {
            result = result.stream().filter(c -> c.getCity().equalsIgnoreCase(city)).toList();
        }
        if (course != null) {
            result = result.stream().filter(c -> c.getCourse() == course).toList();
        }
        return result.stream()
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
