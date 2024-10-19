package com.pere_palacin.app.exceptions;

import java.util.UUID;

public class BankAcountNotFoundException extends RuntimeException {

  public BankAcountNotFoundException(UUID id) {
        super("Bank Account with id: " + id + " not found.");
    }
}
