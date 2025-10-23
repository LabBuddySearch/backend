package org.example.dto;

import jakarta.persistence.*;
import org.example.model.entity.Status;
import org.example.model.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CardDto {

    private UUID id;

    private String title;

    private String description;

    private String tags;

    private UUID authorId;

    private int currentHelpers;

    private Status status;

    private String type;

    private Instant createdAt;

    private String infoProfiles;
}
