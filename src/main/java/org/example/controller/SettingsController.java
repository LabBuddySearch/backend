package org.example.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.ChangePasswordDto;
import org.example.dto.UserUpdateRequest;
import org.example.model.entity.User;
import org.example.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final UserService userService;


    @GetMapping("/me")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getByEmail(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }

    // Обновить профиль
    @PutMapping
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserUpdateRequest request) {

        User updated = userService.updateUser(userDetails.getUsername(), request);
        return ResponseEntity.ok(updated);
    }

    // Обновить фото отдельно
    @PutMapping("/photo")
    public ResponseEntity<User> updatePhoto(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String photoUrl) {

        User updated = userService.updatePhoto(userDetails.getUsername(), photoUrl);
        return ResponseEntity.ok(updated);
    }

    // Сменить пароль
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordDto dto) {
        userService.changePassword(userDetails.getUsername(), dto);
        return ResponseEntity.ok().build();
    }

    // Удалить профиль
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal UserDetails userDetails) {
        userService.deleteByEmail(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
