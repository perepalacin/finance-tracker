package com.pere_palacin.app.domains.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class IncomeSourceWithAmountDto {

    private UUID incomeSourceId;
    private BigDecimal amount;

    public IncomeSourceWithAmountDto(UUID incomeSourceId, BigDecimal amount) {
        this.amount = amount;
        this.incomeSourceId = incomeSourceId;
    }
}
