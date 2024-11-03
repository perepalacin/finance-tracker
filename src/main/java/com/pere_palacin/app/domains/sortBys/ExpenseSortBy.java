package com.pere_palacin.app.domains.sortBys;

public enum ExpenseSortBy {
    name("name"),
    amount("amount"),
    category("expenseCategories.name"),
    annotation("annotation"),
    date("date");

    private final String fieldName;

    ExpenseSortBy(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
