package org.example.errors;

import java.util.UUID;

public class CardNotFoundException extends ApiException {
    public CardNotFoundException(UUID id){
        super("Card with this id " + id + " not found", "CARD_NOT_FOUND");
    }
}
