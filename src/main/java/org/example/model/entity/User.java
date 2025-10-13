package org.example.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name="UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(columnDefinition = "jsonb")
    private String socialLinks; // временно String позже заменим на Map + конвертер

    @Column(columnDefinition = "text")
    private String photoUrl;

    @Column(columnDefinition = "text")
    private String description;

    private String study;
    private String city;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}

