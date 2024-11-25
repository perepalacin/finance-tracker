package com.pere_palacin.app.domains.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class IncomeAndExpensesChartDto {

    private BigDecimal income;
    private BigDecimal expense;
    private int month;
    private int year;

}
