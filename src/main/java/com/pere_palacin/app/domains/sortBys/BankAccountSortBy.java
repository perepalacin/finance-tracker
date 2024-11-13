package com.pere_palacin.app.domains.sortBys;

import jakarta.persistence.Column;

import java.math.BigDecimal;
import java.util.UUID;

public enum BankAccountSortBy {
    name("name"),
    amount("initialAmount"),
    totalIncome("totalIncome"),
    totalExpense("totalExpenses"),
    totalTransferOut("totalTransferOut"),
    totalTransferIn("totalTransferIn"),
    totalInvested("totalInvested");

    private final String fieldName;

    BankAccountSortBy(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
