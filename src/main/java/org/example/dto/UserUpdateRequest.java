package org.example.dto;

import lombok.Data;
import java.util.Map;

@Data
public class UserUpdateRequest {
    private String name;
    private String city;
    private String study;
    private String description;
    private String password;
    private String photoUrl;
    private Map<String, String> socialLinks;
}
