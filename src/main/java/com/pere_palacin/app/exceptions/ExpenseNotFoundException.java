package com.pere_palacin.app.exceptions;

import java.util.UUID;

public class ExpenseNotFoundException extends RuntimeException {

    public ExpenseNotFoundException (UUID id) {
        super("Expense with id: " + id + " not found.");
    }
}
