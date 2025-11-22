package org.example.repository;

import org.example.model.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CardRepository extends JpaRepository<Card, UUID>, JpaSpecificationExecutor<Card> {
    @Query("SELECT c FROM Card c " +
            "JOIN Like l ON c.id = l.cardId.id " +
            "WHERE l.userId.id = :userId ")
    List<Card> findLikedCardsByUserId(@Param("userId") UUID userId);
}
