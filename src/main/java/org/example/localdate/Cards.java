package org.example.localdate;

import org.example.model.entity.Card;
import org.example.model.entity.User;

import java.util.UUID;

public class Cards {

    User user = User.builder()
            .id(UUID.randomUUID())
            .name("Иван")
            .email("email@example.com")
            .study("МТУСИ")
            .city("Москва")
            .build();

    Card card1 = Card.builder()
            .id(UUID.randomUUID())
            .authorId(user)
            .type("Лабораторная")
            .subject("СиАОД")
            .title("Интерполяция")
            .description("Нарисовать графики, отображающие основные полиномы.")
            .study("МТУСИ")
            .city("Москва")
            .course(3)
            .build();


    Card card2 = Card.builder()
            .id(UUID.randomUUID())
            .authorId(user)
            .type("Практическая")
            .subject("ФинГрамотность")
            .title("Инвестиции")
            .study("МТУСИ")
            .city("Москва")
            .course(3)
            .build();


    Card card3 = Card.builder()
            .id(UUID.randomUUID())
            .authorId(user)
            .type("Лабораторная")
            .subject("ИТиП")
            .title("Spring")
            .description("Сделать базовое приложение.")
            .study("МТУСИ")
            .city("Москва")
            .course(2)
            .build();


    Card card4 = Card.builder()
            .id(UUID.randomUUID())
            .authorId(user)
            .type("Лабораторная")
            .subject("Физика")
            .title("Электромагнетизм")
            .study("МФТИ")
            .city("Москва")
            .course(1)
            .build();


    Card card5 = Card.builder()
            .id(UUID.randomUUID())
            .authorId(user)
            .type("Практическая")
            .subject("Философия")
            .title("Идеализм и материализм")
            .description("Сравнительный анализ.")
            .study("МФТИ")
            .city("Москва")
            .course(2)
            .build();


}
