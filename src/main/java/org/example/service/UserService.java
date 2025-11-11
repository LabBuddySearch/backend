package org.example.service;


import lombok.RequiredArgsConstructor;
import org.example.dto.*;
import org.example.model.entity.User;
import org.example.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
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
                .password(passwordEncoder.encode(dto.getPassword()))
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

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
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

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    public User updateUser(String email, UserUpdateRequest request) {
        User user = getByEmail(email);

        Optional.ofNullable(request.getName()).ifPresent(user::setName);
        Optional.ofNullable(request.getCity()).ifPresent(user::setCity);
        Optional.ofNullable(request.getStudy()).ifPresent(user::setStudy);
        Optional.ofNullable(request.getDescription()).ifPresent(user::setDescription);
        Optional.ofNullable(request.getSocialLinks()).ifPresent(user::setSocialLinks);
        Optional.ofNullable(request.getPhotoUrl()).ifPresent(user::setPhotoUrl);
        Optional.ofNullable(request.getPassword())
                .ifPresent(pwd -> user.setPassword(passwordEncoder.encode(pwd)));

        return userRepository.save(user);
    }

    public User updatePhoto(String email, String photoUrl) {
        User user = getByEmail(email);
        user.setPhotoUrl(photoUrl);
        return userRepository.save(user);
    }

    public void deleteByEmail(String email) {
        userRepository.findByEmail(email).ifPresent(userRepository::delete);
    }
}
