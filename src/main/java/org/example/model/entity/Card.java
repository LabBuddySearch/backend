package org.example.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {

    @Id
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(length = 64, nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(columnDefinition = "jsonb")
    private String tags;

    @ManyToOne
    @JoinColumn(name="author_id", nullable=false)
    private User authorId;

    private int currentHelpers;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    private String type;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @Column(columnDefinition = "jsonb")
    private String infoProfiles;
}

