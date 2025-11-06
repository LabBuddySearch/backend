package org.example.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CardEditDto {
    @NotNull
    private UUID id;

    private String type;

    private String subject;

    private String title;

    private String description;

    private String study;

    private String city;

    private int course;
}
