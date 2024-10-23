package com.pere_palacin.app.exceptions;

import java.util.UUID;

public class IncomeNotFoundException extends RuntimeException {
    public IncomeNotFoundException(UUID id) {
        super(
                "Income with id " + id + " not found"
        );
    }
}
