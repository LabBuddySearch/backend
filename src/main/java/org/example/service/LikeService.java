package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.LikeDto;
import org.example.errors.CardNotFoundException;
import org.example.errors.UserNotFoundException;
import org.example.model.entity.Card;
import org.example.model.entity.Like;
import org.example.model.entity.User;
import org.example.repository.CardRepository;
import org.example.repository.LikeRepository;
import org.example.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LikeService {

//    private final UserRepository userRepository;
//    private final CardRepository cardRepository;
//    private final LikeRepository likeRepository;

    public void like(LikeDto dto) {
//        User user = userRepository.findById(dto.getUserId())
//                .orElseThrow(() -> new UserNotFoundException(dto.getUserId()));
//        Card card = cardRepository.findById(dto.getCardId())
//                .orElseThrow(() -> new CardNotFoundException(dto.getCardId()));
//        Like like = Like.builder()
//                .userId(user)
//                .cardId(card)
//                .build();
//        likeRepository.save(like);
//        card.setCurrentHelpers(card.getCurrentHelpers()+1);
//        cardRepository.save(card);
    }

    public void dislike(LikeDto dto){
//        User user = userRepository.findById(dto.getUserId())
//                .orElseThrow(() -> new UserNotFoundException(dto.getUserId()));
//        Card card = cardRepository.findById(dto.getCardId())
//                .orElseThrow(() -> new CardNotFoundException(dto.getCardId()));
//        Like like = likeRepository.findAll().stream()
//                .filter(l -> l.getUserId().getId().equals(dto.getUserId()))
//                .filter(l -> l.getCardId().getId().equals(dto.getCardId()))
//                .findFirst().orElseThrow(
//                        () ->  new RuntimeException("Cannot dislike")
//                );
//        card.setCurrentHelpers(card.getCurrentHelpers() - 1);
//        likeRepository.delete(like);
    }

}
