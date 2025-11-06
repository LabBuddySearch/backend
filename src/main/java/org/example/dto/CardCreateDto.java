package org.example.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CardCreateDto {

    private UUID authorId;

    @NotNull
    @NotBlank(message = "Тип работы обязателен")
    private String type;

    @NotNull
    @NotBlank(message = "Предмет обязателен")
    private String subject;

    @NotNull
    @NotBlank(message = "Название обязательно")
    private String title;

    private String description;

    private String study;

    private String city;

    private int course;
}
