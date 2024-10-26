package com.pere_palacin.app.exceptions;

import java.util.UUID;

public class InvestmentNotFoundException extends RuntimeException {
    public InvestmentNotFoundException(UUID id) {
        super(
                "Investment with id: " + id + " not found"
        );
    }
}
