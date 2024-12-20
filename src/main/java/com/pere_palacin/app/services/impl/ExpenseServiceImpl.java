package com.pere_palacin.app.services.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import com.pere_palacin.app.exceptions.BatchDeleteRequestToLargeException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.ExpenseDao;
import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.domains.sortBys.ExpenseSortBy;
import com.pere_palacin.app.exceptions.ExpenseNotFoundException;
import com.pere_palacin.app.repositories.ExpenseRepository;
import com.pere_palacin.app.services.AuthService;
import com.pere_palacin.app.services.BankAccountService;
import com.pere_palacin.app.services.CategoryService;
import com.pere_palacin.app.services.ExpenseService;
import com.pere_palacin.app.services.UserDetailsServiceImpl;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final CategoryService categoryService;
    private final BankAccountService bankAccountService;
    private final AuthService authService;
    private final UserDetailsServiceImpl userDetailsService;


    @Override
    public List<ExpenseDao> findAll(ExpenseSortBy orderBy, int page, int pageSize, boolean ascending, String fromDate, String toDate, String searchInput) {
        UUID userId = userDetailsService.getRequestingUserId();
        Sort sort = Sort.by(ascending ? Sort.Direction.ASC : Sort.Direction.DESC, orderBy.getFieldName());
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate from = (fromDate != null) ? LocalDate.parse(fromDate, formatter) : null;
        LocalDate to = (toDate != null) ? LocalDate.parse(toDate, formatter) : null;
        if (fromDate == null && toDate == null && searchInput == null) {
            return expenseRepository.findAllByUserId(userId, pageable).getContent();
        } else if (fromDate == null && toDate == null) {
            return expenseRepository.findAllByUserIdAndAnnotationContainingIgnoreCaseOrNameContainingIgnoreCase(userId, searchInput, searchInput, pageable).getContent();
        } else if (searchInput == null) {
            return expenseRepository.findAllByUserIdAndDateAfterAndDateBefore(userId, from, to, pageable).getContent();
        } else {
            return expenseRepository.findAllByUserIdAndAnnotationContainingIgnoreCaseOrNameContainingIgnoreCaseAndDateAfterAndDateBefore(userId, searchInput, searchInput, from, to, pageable).getContent();
        }
    }

    @Override
    public ExpenseDao findById(UUID id) {
        ExpenseDao expenseDao = expenseRepository.findById(id).orElseThrow(
                () -> new ExpenseNotFoundException(id)
        );
        authService.authorizeRequest(expenseDao.getUser().getId(), null);
        return expenseDao;
    }

    @Transactional
    @Override
    public ExpenseDao registerExpense(ExpenseDao expenseDao, UUID bankAccountId) {

        UUID userId = userDetailsService.getRequestingUserId();
        UserDao user = new UserDao();
        user.setId(userId);
        expenseDao.setUser(user);

        List<UUID> categoryIds = expenseDao.getExpenseCategories()
                .stream()
                .map(CategoryDao::getId)
                .collect(Collectors.toList());

        Set<CategoryDao> categoryDaos = categoryService.findAllById(categoryIds);
        expenseDao.setExpenseCategories(categoryDaos);

        BankAccountDao bankAccountDao = bankAccountService.findById(bankAccountId);
        authService.authorizeRequest(bankAccountDao.getUser().getId(), userId);

        bankAccountService.addAssociatedExpense(bankAccountDao, expenseDao.getAmount());
        expenseDao.setBankAccount(bankAccountDao);
        return expenseRepository.save(expenseDao);
    }

    @Transactional
    @Override
    public ExpenseDao updateExpense(UUID id, ExpenseDao expenseDao, UUID bankAccountId) {
        ExpenseDao expenseToEdit = this.findById(id);
        UUID userId = userDetailsService.getRequestingUserId();
        authService.authorizeRequest(expenseToEdit.getUser().getId(), userId);

        Set<CategoryDao> existingCategories = expenseToEdit.getExpenseCategories();

        Set<UUID> newCategoryIds = expenseDao.getExpenseCategories()
                .stream()
                .map(CategoryDao::getId)
                .collect(Collectors.toSet());

        Set<CategoryDao> categoryDaosToSave = new HashSet<>();
        Set<UUID> alreadyFetchedCategoryIds = new HashSet<>();
        for (CategoryDao categoryDao : existingCategories) {
            if (newCategoryIds.contains(categoryDao.getId())) {
                categoryDaosToSave.add(categoryDao);
                alreadyFetchedCategoryIds.add(categoryDao.getId());
            }
        }

        List<UUID> categoriesToFetch = new ArrayList<>();
        for (UUID categoryId : newCategoryIds) {
            if (!alreadyFetchedCategoryIds.contains(categoryId)) {
                categoriesToFetch.add(categoryId);
            }
        }

        if (!categoriesToFetch.isEmpty()) {
            Set<CategoryDao> newCategories = categoryService.findAllById(categoriesToFetch);
            authService.authorizeRequest(newCategories.stream().map(CategoryDao::getUser).map(UserDao::getId).collect(Collectors.toSet()), userId);
            categoryDaosToSave.addAll(newCategories);
        }

        expenseToEdit.setExpenseCategories(categoryDaosToSave);

        if (expenseToEdit.getBankAccount().getId() != bankAccountId) {
            BankAccountDao bankAccountDao = bankAccountService.findById(bankAccountId);
            bankAccountService.deleteAssociatedExpense(expenseToEdit.getBankAccount(), expenseToEdit.getAmount());
            bankAccountService.addAssociatedExpense(bankAccountDao, expenseDao.getAmount());
            // TODO: Check if this is mutable!
            expenseToEdit.setBankAccount(bankAccountDao);
        } else {
            bankAccountService.editAssociatedExpense(expenseToEdit.getBankAccount(), expenseToEdit.getAmount(), expenseDao.getAmount());
        }
        expenseToEdit.setDate(expenseDao.getDate());
        expenseToEdit.setAmount(expenseDao.getAmount());
        expenseToEdit.setName(expenseDao.getName());
        expenseToEdit.setAnnotation(expenseDao.getAnnotation());
        return expenseRepository.save(expenseToEdit);
    }

    @Override
    public void deleteExpense(UUID id) {
        ExpenseDao expenseToDelete = this.findById(id);
        BankAccountDao bankAccountDao = bankAccountService.findById(expenseToDelete.getBankAccount().getId());
        bankAccountService.deleteAssociatedExpense(bankAccountDao, expenseToDelete.getAmount());
        expenseRepository.delete(expenseToDelete);
    }

    @Transactional
    @Override
    public void deleteInBatch(Set<UUID> expensesId) {
        if (expensesId.size() > 60) {
            throw new BatchDeleteRequestToLargeException();
        }
        UUID userId = userDetailsService.getRequestingUserId();
        expenseRepository.deleteByIdInAndUserId(expensesId.stream().toList(), userId);
    }
}
