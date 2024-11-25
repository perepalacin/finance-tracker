package com.pere_palacin.app.domains.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class MonthlyExpenses {
    private BigDecimal totalAmount;
    private Integer month;
    private Integer year;

    public MonthlyExpenses(BigDecimal totalAmount, Integer month, Integer year) {
        this.totalAmount = totalAmount;
        this.month = month;
        this.year = year;
    }
}
