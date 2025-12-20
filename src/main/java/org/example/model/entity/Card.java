package org.example.model.entity;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.List;
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

    @ManyToOne
    @JoinColumn(name="author_id", nullable=false)
    private User authorId;

    @Column(name = "author_name", length = 128)
    private String authorName;

    @OneToMany(mappedBy = "cardId", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<org.example.model.entity.File> files;

    @Column(length = 32, nullable = false)
    private String type;

    @Column(length = 64, nullable = false)
    private String subject;

    @Column(length = 64, nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(length = 64, nullable = false)
    private String study;

    @Column(length = 64, nullable = false)
    private String city;

    private int course;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.OPEN;

    @Builder.Default
    private int currentHelpers = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

}

