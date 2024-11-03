package com.pere_palacin.app.domains.sortBys;

public enum ExpenseSortBy {
    name("name"),
    amount("amount"),
    category("expenseCategories.name"),
    annotation("annotation");
    //TODO: Add more fields

    private final String fieldName;

    ExpenseSortBy(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
