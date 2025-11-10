package org.example.errors;

import java.util.UUID;

public class UserNotFoundException extends ApiException {
    public UserNotFoundException(UUID id) {
        super("User with id " + id + " not found", "USER_NOT_FOUND");
    }
}
