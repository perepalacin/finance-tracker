package com.pere_palacin.app.controllers;

import com.pere_palacin.app.exceptions.*;
import com.pere_palacin.app.responses.CustomErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.*;

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

    @ExceptionHandler(ExpenseNotFoundException.class)
    public ResponseEntity<CustomErrorResponse> handleExpenseNotFound(ExpenseNotFoundException ex) {
        CustomErrorResponse errorResponse = new CustomErrorResponse(NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(IncomeSourceNotFoundException.class)
    public ResponseEntity<CustomErrorResponse> handleIncomeSourceNotFound(IncomeSourceNotFoundException ex) {
        CustomErrorResponse errorResponse = new CustomErrorResponse(NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(IncomeNotFoundException.class)
    public ResponseEntity<CustomErrorResponse> handleIncomeNotFound(IncomeNotFoundException ex) {
        CustomErrorResponse errorResponse = new CustomErrorResponse(NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(UnauthorizedRequestException.class)
    public ResponseEntity<CustomErrorResponse> handleUnauthorizedRequest(UnauthorizedRequestException ex) {
        CustomErrorResponse errorResponse = new CustomErrorResponse(UNAUTHORIZED.value(), ex.getMessage());
        return ResponseEntity.status(NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> notValid(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> errors = new ArrayList<>();
        ex.getAllErrors().forEach(err -> errors.add(err.getDefaultMessage()));
        Map<String, List<String>> result = new HashMap<>();
        result.put("errors", errors);
        return new ResponseEntity<>(result, BAD_REQUEST);
    }


}
