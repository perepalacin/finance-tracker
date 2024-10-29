package com.pere_palacin.app.repositories;

import com.pere_palacin.app.TestUtils;
import com.pere_palacin.app.domains.CategoryDao;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD) //Restarts the db and all the memory of the app based on the parameter you pass it. Play around with the arguments!
public class CategoryRepositoryIntegrationTest {

    private CategoryRepository underTest;

    @Autowired
    public CategoryRepositoryIntegrationTest(CategoryRepository underTest) {
        this.underTest = underTest;
    }

    @Test
    public void testThatCategoryCanBeCreatedAndRecalled() {
        CategoryDao categoryDao = TestUtils.createTestCategory();
        CategoryDao savedCategory = underTest.save(categoryDao);
        Optional<CategoryDao> result = underTest.findById(savedCategory.getId());
        assertThat(result).isPresent();
        assertThat(result.get()).usingRecursiveComparison().isEqualTo(savedCategory);
    }

    @Test
    public void testThatMultipleCategoriesCanBeCreatedAndRecalled() {
        CategoryDao categoryDaoA = TestUtils.createTestCategoryA();
        CategoryDao categoryDaoB = TestUtils.createTestCategoryB();
        CategoryDao categoryDaoC = TestUtils.createTestCategoryC();

        CategoryDao savedCategoryA = underTest.save(categoryDaoA);
        CategoryDao savedCategoryB = underTest.save(categoryDaoB);
        CategoryDao savedCategoryC = underTest.save(categoryDaoC);

        List<CategoryDao> resultList = new ArrayList<>();
        underTest.findAll().forEach(resultList::add);

        assertThat(resultList).hasSize(3);
        assertThat(resultList.get(0)).usingRecursiveComparison().isEqualTo(savedCategoryA);
        assertThat(resultList.get(1)).usingRecursiveComparison().isEqualTo(savedCategoryB);
        assertThat(resultList.get(2)).usingRecursiveComparison().isEqualTo(savedCategoryC);
    }

    @Test
    public void testThatCategoryCanBeUpdated() {
        CategoryDao categoryDao = TestUtils.createTestCategory();
        underTest.save(categoryDao);
        categoryDao.setIconName("shoes");
        categoryDao.setCategoryName("Shopping");
        underTest.save(categoryDao); // Save and get the updated instance
        Optional<CategoryDao> result = underTest.findById(categoryDao.getId()); // Fetch the updated instance
        assertThat(result).isPresent();
        assertThat(result.get()).usingRecursiveComparison().isEqualTo(categoryDao);
    }

    @Test
    public void testThatAuthorCanBeDeleted() {
        CategoryDao categoryDao = TestUtils.createTestCategory();
        CategoryDao savedCategory = underTest.save(categoryDao);
        underTest.deleteById(savedCategory.getId());
        Optional<CategoryDao> result = underTest.findById(savedCategory.getId());
        assertThat(result).isEmpty();
    }

}
