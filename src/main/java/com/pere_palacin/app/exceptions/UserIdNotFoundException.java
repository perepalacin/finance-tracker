package com.pere_palacin.app.exceptions;

import java.util.UUID;

public class UserIdNotFoundException extends RuntimeException {
    public UserIdNotFoundException(UUID id) {
        super(
                "User with id: " + id + " not found."
        );
    }
}
