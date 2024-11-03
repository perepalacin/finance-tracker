package com.pere_palacin.app.domains.sortBys;

public enum IncomeSortBy {
    name("name"),
    amount("amount"),
    annotation("annotation"),
    source("incomeSourceDao.name");
//    TODO: Add more fields

    private final String fieldName;

    IncomeSortBy(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
