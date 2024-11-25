package com.pere_palacin.app.domains.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class MonthlyIncome {
    private BigDecimal totalAmount;
    private Integer month;
    private Integer year;

    public MonthlyIncome(BigDecimal totalAmount, Integer month, Integer year) {
        this.totalAmount = totalAmount;
        this.month = month;
        this.year = year;
    }
}
