package com.pere_palacin.app.controllers;

import com.pere_palacin.app.exceptions.BankAcountNotFoundException;
import com.pere_palacin.app.exceptions.CategoryNotFoundException;
import com.pere_palacin.app.responses.CustomErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<CustomErrorResponse> handleCategoryNotFound(CategoryNotFoundException ex) {
        CustomErrorResponse errorResponse = new CustomErrorResponse(NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(BankAcountNotFoundException.class)
    public ResponseEntity<CustomErrorResponse> handleBankAccountNotFound(BankAcountNotFoundException ex) {
        CustomErrorResponse errorResponse = new CustomErrorResponse(NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(NOT_FOUND).body(errorResponse);
    }
}
