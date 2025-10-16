package org.example.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Likes {
    @Id
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User userId;

    @ManyToOne
    @JoinColumn(name="card_id", nullable=false)
    private User cardId;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}
