package com.pere_palacin.app.domains.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpenseDto {
    private UUID id;

    @NotBlank(message = "Expense name is required")
    @Size(min = 2, max = 30, message = "The expense name must have between 3 and 30 characters")
    private String name;

    @PositiveOrZero(message = "The amount spent needs to be positive or zero")
    private BigDecimal amount;

    private String annotation;

    @NotNull(message = "It is required to assign an expense to a category")
    private UUID categoryId;
    private CategoryDto categoryDto;

    @NotNull(message = "It is required to assign an expense to a bank account")
    private UUID bankAccountId;
    private BankAccountDto bankAccountDto;

    private Instant updated_at;
}
