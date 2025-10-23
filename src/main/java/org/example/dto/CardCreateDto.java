package org.example.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CardCreateDto {
    @NotBlank(message = "Название обязательно")
    private String title;

    private String description;

    private String tags;

    @NotNull
    private UUID authorId;

    private String type;

    private String infoProfiles;
}
