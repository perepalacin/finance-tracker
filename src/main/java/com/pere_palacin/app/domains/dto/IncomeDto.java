package com.pere_palacin.app.domains.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IncomeDto {
    private UUID id;

    @NotBlank(message = "Income name is required")
    @Size(min = 2, max = 30, message = "The income name must have between 3 and 30 characters")
    private String name;

    @PositiveOrZero(message = "The amount received needs to be positive or zero")
    private BigDecimal amount;

    private String annotation;

    @NotNull(message = "It is required to assign an income to an income source")
    private UUID incomeSourceId;
    private IncomeSourceDto incomeSourceDto;

    @NotNull(message = "It is required to assign an income to a bank account")
    private UUID bankAccountId;
    private BankAccountDto bankAccountDto;

    @NotNull(message = "Income date is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "d-M-yyyy")
    private LocalDate date;
}
