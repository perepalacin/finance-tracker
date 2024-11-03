package com.pere_palacin.app.controllers;

import com.pere_palacin.app.domains.sortBys.ExpenseSortBy;
import com.pere_palacin.app.exceptions.*;
import com.pere_palacin.app.responses.CustomErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.*;

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

    @ExceptionHandler(TransferNotFoundException.class)
    public ResponseEntity<CustomErrorResponse> handleTransferNotFound(TransferNotFoundException ex) {
        CustomErrorResponse errorResponse = new CustomErrorResponse(NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(InvestmentCategoryNotFoundException.class)
    public ResponseEntity<CustomErrorResponse> handleInvestmentCategoryNotFound(InvestmentCategoryNotFoundException ex) {
        CustomErrorResponse errorResponse = new CustomErrorResponse(NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(InvestmentNotFoundException.class)
    public ResponseEntity<CustomErrorResponse> handleInvestmentCategoryNotFound(InvestmentNotFoundException ex) {
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

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<CustomErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message;
        Class<?> requiredType = ex.getRequiredType();

        if (requiredType != null && requiredType.isEnum()) {
            Object[] enumValues = requiredType.getEnumConstants();
            message = String.format(
                    "Invalid value '%s' for parameter '%s'. Valid values are: %s",
                    ex.getValue(),
                    ex.getName(),
                    Arrays.toString(enumValues)
            );
        } else {
            message = String.format(
                    "Invalid value '%s' for parameter '%s'.",
                    ex.getValue(),
                    ex.getName()
            );
        }

        CustomErrorResponse errorResponse = new CustomErrorResponse(BAD_REQUEST.value(), message);
        return ResponseEntity.status(BAD_REQUEST).body(errorResponse);
    }

}
