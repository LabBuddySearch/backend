package org.example.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class LikeDto {
    @NotNull
    private UUID userId;

    @NotNull
    private UUID cardId;
}
