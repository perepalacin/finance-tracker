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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryService categoryService;
    private final BankAccountService bankAccountService;

    @Override
    public Page<ExpenseDao> findAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        Sort sort = Sort.by("name").ascending();
        //TODO: Add these parameters on the request!
        Pageable pageable = PageRequest.of(0, 10, sort);
        return expenseRepository.findAllByUserIdOrderByName(user.getId(), pageable);
    }

    @Override
    public ExpenseDao findById(UUID id) {
        return expenseRepository.findById(id).orElseThrow(
                () -> new ExpenseNotFoundException(id)
        );
    }

    @Transactional
    @Override
    public ExpenseDao registerExpense(ExpenseDao expenseDao, UUID bankAccountId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        expenseDao.setUser(user);

        List<UUID> categoryIds = expenseDao.getExpenseCategories()
                .stream()
                .map(CategoryDao::getId)
                .collect(Collectors.toList());

        Set<CategoryDao> categoryDaos = categoryService.findAllById(categoryIds);

        //TODO: move this to a method!
        for (CategoryDao categoryDao : categoryDaos) {
            if (!Objects.equals(categoryDao.getUser().getId(), user.getId())) {
                throw new UnauthorizedRequestException();
            }
        }

        expenseDao.setExpenseCategories(categoryDaos);

        BankAccountDao bankAccountDao = bankAccountService.findById(bankAccountId);
        if (!Objects.equals(bankAccountDao.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }

        bankAccountService.addAssociatedExpense(bankAccountDao, expenseDao.getAmount());
        expenseDao.setBankAccount(bankAccountDao);
        return expenseRepository.save(expenseDao);
    }

    @Transactional
    @Override
    public ExpenseDao updateExpense(UUID id, ExpenseDao expenseDao, UUID categoryId, UUID bankAccountId) {
        ExpenseDao expenseToEdit = this.findById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(user.getId(), expenseToEdit.getUser().getId())) {
            throw new UnauthorizedRequestException();
        }
        CategoryDao categoryDao = categoryService.findById(categoryId);
//        expenseDao.setCategory(categoryDao);
        BankAccountDao bankAccountDao = bankAccountService.findById(bankAccountId);
        if (expenseToEdit.getBankAccount().getId() != bankAccountId) {
            bankAccountService.deleteAssociatedExpense(expenseToEdit.getBankAccount(), expenseToEdit.getAmount());
            bankAccountService.addAssociatedExpense(bankAccountDao, expenseDao.getAmount());
        } else {
            bankAccountService.editAssociatedExpense(bankAccountDao, expenseToEdit.getAmount(), expenseDao.getAmount());
        }
        expenseDao.setBankAccount(bankAccountDao);
        expenseToEdit.setAmount(expenseDao.getAmount());
        expenseToEdit.setName(expenseDao.getName());
        expenseToEdit.setAnnotation(expenseDao.getAnnotation());
        return expenseRepository.save(expenseDao);
    }

    @Override
    public void deleteExpense(UUID id) {
        ExpenseDao expenseToDelete = this.findById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(user.getId(), expenseToDelete.getUser().getId())) {
            throw new UnauthorizedRequestException();
        }
        BankAccountDao bankAccountDao = bankAccountService.findById(expenseToDelete.getBankAccount().getId());
        bankAccountService.deleteAssociatedExpense(bankAccountDao, expenseToDelete.getAmount());
        expenseRepository.delete(expenseToDelete);
    }
}
