package org.example.dto;

import lombok.Data;

@Data
public class UserUpdateDto {
    private String name;
    private String city;
    private String study;
    private String description;
    private String photoUrl;
    private String socialLinks;
}
