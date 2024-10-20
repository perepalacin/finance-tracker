package com.pere_palacin.app.services.impl;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.ExpenseDao;
import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.exceptions.ExpenseNotFoundException;
import com.pere_palacin.app.exceptions.UnauthorizedRequestException;
import com.pere_palacin.app.repositories.ExpenseRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.BankAccountService;
import com.pere_palacin.app.services.CategoryService;
import com.pere_palacin.app.services.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryService categoryService;
    private final BankAccountService bankAccountService;

    @Override
    public ExpenseDao findById(UUID id) {
        return expenseRepository.findById(id).orElseThrow(
                () -> new ExpenseNotFoundException(id)
        );
    }

    @Override
    public ExpenseDao registerExpense(ExpenseDao expenseDao, UUID categoryId, UUID bankAccountId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        expenseDao.setUser(user);
        CategoryDao categoryDao = categoryService.findById(categoryId);
        expenseDao.setCategory(categoryDao);
        BankAccountDao bankAccountDao = bankAccountService.findById(bankAccountId);
        expenseDao.setBankAccount(bankAccountDao);
        return expenseRepository.save(expenseDao);
        //TODO: update the accounts!
    }

    @Override
    public ExpenseDao updateExpense(UUID id, ExpenseDao expenseDao, UUID categoryId, UUID bankAccountId) {
        ExpenseDao expensteToEdit = this.findById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (user.getId() != expensteToEdit.getUser().getId()) {
            throw new UnauthorizedRequestException();
        }
        CategoryDao categoryDao = categoryService.findById(categoryId);
        expenseDao.setCategory(categoryDao);
        BankAccountDao bankAccountDao = bankAccountService.findById(bankAccountId);
        expenseDao.setBankAccount(bankAccountDao);
        expensteToEdit.setAmount(expenseDao.getAmount());
        return expenseRepository.save(expenseDao);
    }

    @Override
    public void deleteExpense(UUID id) {

    }
}
