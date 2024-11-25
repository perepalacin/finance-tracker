package com.pere_palacin.app.domains.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class InvestmentCategoriesWithAmountDto {
    private UUID investmentCategoryId;
    private BigDecimal amount;

    public InvestmentCategoriesWithAmountDto(UUID investmentCategoryId, BigDecimal amount) {
        this.amount = amount;
        this.investmentCategoryId = investmentCategoryId;
    }
}
