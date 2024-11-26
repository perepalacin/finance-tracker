package com.pere_palacin.app.domains.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class ExpensesCategoryWithAmountDto {
    private UUID expenseCategoryId;
    private BigDecimal totalAmount;
    private BigDecimal monthlyAmount;

    public ExpensesCategoryWithAmountDto(UUID expenseCategoryId, BigDecimal totalAmount, BigDecimal monthlyAmount) {
        this.expenseCategoryId = expenseCategoryId;
        this.totalAmount = totalAmount;
        this.monthlyAmount =  monthlyAmount;
    }
}
