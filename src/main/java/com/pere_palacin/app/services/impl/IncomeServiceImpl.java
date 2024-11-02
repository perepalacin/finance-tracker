package com.pere_palacin.app.services.impl;

import java.util.Objects;
import java.util.UUID;

import com.pere_palacin.app.services.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.IncomeDao;
import com.pere_palacin.app.domains.IncomeSourceDao;
import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.exceptions.IncomeNotFoundException;
import com.pere_palacin.app.exceptions.UnauthorizedRequestException;
import com.pere_palacin.app.repositories.IncomeRepository;
import com.pere_palacin.app.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;
    private final IncomeSourceService incomeSourceService;
    private final BankAccountService bankAccountService;
    private final AuthService authService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public Page<IncomeDao> findAllUserIncomes() {
        UUID userId = userDetailsService.getRequestingUserId();
        Sort sort = Sort.by("name").ascending();
        //TODO: Add these parameters on the request!
        Pageable pageable = PageRequest.of(0, 10, sort);
        return incomeRepository.findAllByUserIdOrderByName(userId, pageable);
    }

    @Override
    public IncomeDao findById(UUID id) {
        IncomeDao incomeDao = incomeRepository.findById(id).orElseThrow(
                () -> new IncomeNotFoundException(id)
        );
        authService.authorizeRequest(incomeDao.getUser().getId(), null);
        return incomeDao;
    }

    @Override
    public IncomeDao registerIncome(IncomeDao incomeDao, UUID incomeSourceId, UUID bankAccountId) {
        UUID userId = userDetailsService.getRequestingUserId();
        UserDao user = UserDao.builder().id(userId).build();
        incomeDao.setUser(user);
        IncomeSourceDao incomeSourceDao = incomeSourceService.findById(incomeSourceId);
        incomeDao.setIncomeSourceDao(incomeSourceDao);
        BankAccountDao bankAccountDao = bankAccountService.findById(bankAccountId);
        authService.authorizeRequest(bankAccountDao.getUser().getId(), userId);
        bankAccountService.addAssociatedIncome(bankAccountDao, incomeDao.getAmount());
        incomeDao.setBankAccount(bankAccountDao);
        return incomeRepository.save(incomeDao);
    }

    @Override
    public IncomeDao updateIncome(UUID id, IncomeDao incomeDao, UUID incomeSourceId, UUID bankAccountId) {
        IncomeDao incomeToEdit = this.findById(id);
        UUID userId = userDetailsService.getRequestingUserId();
        authService.authorizeRequest(incomeToEdit.getUser().getId(), userId);
        IncomeSourceDao incomeSourceDao = incomeSourceService.findById(incomeSourceId);
        incomeDao.setIncomeSourceDao(incomeSourceDao);
        BankAccountDao bankAccountDao = bankAccountService.findById(bankAccountId);
        if (incomeToEdit.getBankAccount().getId() != bankAccountId) {
            bankAccountService.deleteAssociatedIncome(incomeToEdit.getBankAccount(), incomeToEdit.getAmount());
            bankAccountService.addAssociatedIncome(bankAccountDao, incomeDao.getAmount());
        } else {
            bankAccountService.editAssociatedIncome(bankAccountDao, incomeToEdit.getAmount(), incomeDao.getAmount());
        }
        incomeDao.setBankAccount(bankAccountDao);
        incomeToEdit.setAmount(incomeDao.getAmount());
        incomeToEdit.setName(incomeDao.getName());
        incomeToEdit.setAnnotation(incomeDao.getAnnotation());
        return incomeRepository.save(incomeToEdit);
    }

    @Override
    public void deleteIncome(UUID id) {
        IncomeDao incomeToDelete = this.findById(id);
        BankAccountDao bankAccountDao = bankAccountService.findById(incomeToDelete.getBankAccount().getId());
        bankAccountService.deleteAssociatedIncome(bankAccountDao, incomeToDelete.getAmount());
        incomeRepository.delete(incomeToDelete);
    }
}
