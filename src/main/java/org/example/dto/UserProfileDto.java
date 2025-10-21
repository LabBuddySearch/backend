package org.example.dto;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileDto {
    private UUID id;
    private String name;
    private String email;
    private String city;
    private String study;
    private String description;
    private String photoUrl;
    private String socialLinks;
    private Instant createdAt;
}
