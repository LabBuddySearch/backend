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
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final UserRepository userRepository;
    private final CardRepository cardRepository;
    private final LikeRepository likeRepository;

    @Transactional
    public void like(LikeDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException(dto.getUserId()));
        Card card = cardRepository.findById(dto.getCardId())
                .orElseThrow(() -> new CardNotFoundException(dto.getCardId()));

        boolean alreadyLiked = likeRepository.findByUserId_IdAndCardId_Id(dto.getUserId(), dto.getCardId()).isPresent();
        if (alreadyLiked) {
            return;
        }

        Like like = Like.builder()
                .userId(user)
                .cardId(card)
                .build();
        likeRepository.save(like);
        card.setCurrentHelpers(card.getCurrentHelpers() + 1);
        cardRepository.save(card);
    }

    @Transactional
    public void dislike(LikeDto dto) {
        Like like = likeRepository.findByUserId_IdAndCardId_Id(dto.getUserId(), dto.getCardId())
                .orElseThrow(() -> new RuntimeException("Cannot dislike"));

        Card card = like.getCardId();
        card.setCurrentHelpers(Math.max(0, card.getCurrentHelpers() - 1));
        likeRepository.delete(like);
        cardRepository.save(card);
    }

}
