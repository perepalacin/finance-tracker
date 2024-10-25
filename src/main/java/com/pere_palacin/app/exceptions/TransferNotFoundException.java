package com.pere_palacin.app.exceptions;

import java.util.UUID;

public class TransferNotFoundException extends RuntimeException {
    public TransferNotFoundException(UUID id) {
        super(
                "Transfer with id: " + id + " not found."
        );
    }
}
