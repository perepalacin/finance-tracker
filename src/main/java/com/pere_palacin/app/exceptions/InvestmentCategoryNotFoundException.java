package com.pere_palacin.app.exceptions;

import java.util.UUID;

public class InvestmentCategoryNotFoundException extends RuntimeException {
    public InvestmentCategoryNotFoundException(UUID id) {
        super(
                "Investment category with id: " + id + " not found."
        );
    }
}
