package com.pere_palacin.app.domains.sortBys;

public enum InvestmentSortBy {
    name("name"),
    amount("amountInvested"),
    annotation("annotation"),
    startDate("startDate"),
    endDate("endDate"),
    category("investmentCategories.investmentCategoryName");

    private final String fieldName;

    InvestmentSortBy(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
