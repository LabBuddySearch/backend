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

    private UUID authorId;

    private String type;

    private String subject;

    private String title;

    private String description;

    private String study;

    private String city;

    private int course;

    private Status status;

    private int currentHelpers;

    private Instant createdAt;
}
