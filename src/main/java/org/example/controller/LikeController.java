package org.example.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.LikeDto;
import org.example.service.LikeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/like")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("")
    @ResponseStatus(HttpStatus.OK)
    public void likeCard(@Valid @RequestBody LikeDto dto){
        likeService.like(dto);
    }

    @DeleteMapping("")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void dislikeCard(@Valid @RequestBody LikeDto dto) {
        likeService.dislike(dto);
    }

}
