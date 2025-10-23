package org.example.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CardEditDto {
    @NotNull
    private UUID id;

    private String title;

    private String description;

    private String tags;

    private String type;

    private String infoProfiles;
}
