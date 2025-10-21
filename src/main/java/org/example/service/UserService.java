package org.example.service;


import lombok.RequiredArgsConstructor;
import org.example.dto.*;
import org.example.model.entity.User;
import org.example.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileDto register(UserRegisterDto dto) {
        if (userRepository.findAll().stream()
                .anyMatch(u -> u.getEmail().equalsIgnoreCase(dto.getEmail()))) {
            throw new IllegalArgumentException("Пользователь с таким email уже существует");
        }

        User user = User.builder()
                .email(dto.getEmail())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .city(dto.getCity())
                .study(dto.getStudy())
                .build();

        userRepository.save(user);
        return mapToDto(user);
    }

    public UserProfileDto login(UserLoginDto dto) {
        User user = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(dto.getEmail()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Неверный email или пароль"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Неверный email или пароль");
        }

        return mapToDto(user);
    }

    public UserProfileDto getProfile(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
        return mapToDto(user);
    }

    public UserProfileDto updateProfile(UUID id, UserUpdateDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getCity() != null) user.setCity(dto.getCity());
        if (dto.getStudy() != null) user.setStudy(dto.getStudy());
        if (dto.getDescription() != null) user.setDescription(dto.getDescription());
        if (dto.getPhotoUrl() != null) user.setPhotoUrl(dto.getPhotoUrl());
        if (dto.getSocialLinks() != null) user.setSocialLinks(dto.getSocialLinks());

        userRepository.save(user);
        return mapToDto(user);
    }

    private UserProfileDto mapToDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .city(user.getCity())
                .study(user.getStudy())
                .description(user.getDescription())
                .photoUrl(user.getPhotoUrl())
                .socialLinks(user.getSocialLinks())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
