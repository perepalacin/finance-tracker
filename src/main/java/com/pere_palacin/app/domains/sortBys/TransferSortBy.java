package com.pere_palacin.app.domains.sortBys;

public enum TransferSortBy {
    name("name"),
    amount("amount"),
    annotation("annotation"),
    date("date"),
    category("investmentCategories.investmentCategoryName");

    //TODO: Add more fields!
    private final String fieldName;

    TransferSortBy(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}

