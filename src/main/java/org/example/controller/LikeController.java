package org.example.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.LikeDto;
import org.example.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/like")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("")
    public ResponseEntity<String> likeCard(@Valid @RequestBody LikeDto dto){
        return ResponseEntity.ok(likeService.like(dto));
    }

}
