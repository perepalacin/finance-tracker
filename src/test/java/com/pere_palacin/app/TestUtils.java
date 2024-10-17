package com.pere_palacin.app;

import com.pere_palacin.app.domains.CategoryDao;

public class TestUtils {

    public static CategoryDao createTestCategory() {
        return CategoryDao.builder()
                .categoryName("Hobbies")
                .iconName("hobby")
                .build();
    }

    public static CategoryDao createTestCategoryA() {
        return CategoryDao.builder()
                .categoryName("Travel")
                .iconName("airplane")
                .build();
    }
    public static CategoryDao createTestCategoryB() {
        return CategoryDao.builder()
                .categoryName("Fitness")
                .iconName("dumbell")
                .build();
    }
    public static CategoryDao createTestCategoryC() {
        return CategoryDao.builder()
                .categoryName("Groceries")
                .iconName("Cart")
                .build();
    }
}
