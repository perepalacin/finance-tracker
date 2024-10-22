package com.pere_palacin.app.exceptions;

import java.util.UUID;

public class IncomeSourceNotFoundException extends RuntimeException {
    public IncomeSourceNotFoundException(UUID id) {
        super(
                "Income source with id " + id + " not found"
        );
    }
}
