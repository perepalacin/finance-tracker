package com.pere_palacin.app.domains.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvestmentDto {
    private UUID id;

    @NotBlank(message = "Investment name is required")
    @Size(min = 2, max = 30, message = "The investment name must have between 3 and 30 characters")
    private String name;

    @PositiveOrZero(message = "The amount invested needs to be positive or zero")
    private BigDecimal amountInvested;

    private String annotation;

    @NotNull(message = "It is requires to assign an investment category to an investment")
    private UUID investmentCategoryId;
    private InvestmentCategoryDto investmentCategoryDto;

    @NotNull(message = "It is required to assign an investment to a bank account")
    private UUID bankAccountId;
    private BankAccountDto bankAccountDto;

}
