package org.example.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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

    @NotNull(message = "Номер курса обязателен")
    @Min(value = 1, message = "Курс должен быть не менее 1")
    @Max(value = 6, message = "Курс должен быть не более 6")
    private int course;

    private String description;

    private String study;

    private String city;
}
