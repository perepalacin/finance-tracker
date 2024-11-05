package com.pere_palacin.app.exceptions;

public class UsernameAlreadyExistsException extends RuntimeException {
    public UsernameAlreadyExistsException() {
        super(
                "This username already exists, please try a new one"
        );
    }
}
