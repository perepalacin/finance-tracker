package com.pere_palacin.app.domains.dto;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.UserDao;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class ExpenseDto {
    private UUID id;

    @NotBlank(message = "Expense name is required")
    @Size(min = 2, max = 30, message = "The expense name must have between 3 and 30 characters")
    private String name;

    @PositiveOrZero(message = "The amount spent needs to be positive or zero")
    private BigDecimal amount;

    private String annotation;

    @NotBlank(message = "It is required to assign an expense to a category")
    private UUID categoryId;
    private CategoryDto categoryDto;

    @NotBlank(message = "It is required to assign an expense to a bank account")
    private UUID bankAccountId;
    private BankAccountDto bankAccountDto;

    private Instant updated_at;
}
