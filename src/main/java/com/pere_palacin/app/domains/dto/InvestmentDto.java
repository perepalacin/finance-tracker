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
import java.util.Set;
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

    @NotNull(message = "It is required to assign at least one category to an investment")
    private Set<UUID> investmentCategoriesId;

    private Set<InvestmentCategoryDto> investmentCategoryDtos;

    @NotNull(message = "It is required to assign an investment to a bank account")
    private UUID bankAccountId;
    private BankAccountDto bankAccountDto;

    @NotNull(message = "Start date is required")
    @Pattern(regexp = "\\d{1,2}-\\d{1,2}-\\d{4}", message = "Start date must be in the format d-M-yyyy")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "d-M-yyyy")
    private LocalDate endDate;
}
