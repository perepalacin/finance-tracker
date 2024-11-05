package com.pere_palacin.app.exceptions;

public class SomethingWentWrongException extends RuntimeException {
    public SomethingWentWrongException() {
        super(
                "Something went wrong, please try again later"
        );
    }
}
