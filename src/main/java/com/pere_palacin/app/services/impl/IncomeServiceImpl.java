package com.pere_palacin.app.services.impl;

import com.pere_palacin.app.domains.*;
import com.pere_palacin.app.exceptions.IncomeNotFoundException;
import com.pere_palacin.app.exceptions.UnauthorizedRequestException;
import com.pere_palacin.app.repositories.IncomeRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.BankAccountService;
import com.pere_palacin.app.services.IncomeService;
import com.pere_palacin.app.services.IncomeSourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;
    private final IncomeSourceService incomeSourceService;
    private final BankAccountService bankAccountService;

    @Override
    public Page<IncomeDao> findAllUserIncomes() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        Sort sort = Sort.by("name").ascending();
        //TODO: Add these parameters on the request!
        Pageable pageable = PageRequest.of(0, 10, sort);
        return incomeRepository.findAllByUserIdOrderByName(user.getId(), pageable);
    }

    @Override
    public IncomeDao findById(UUID id) {
        IncomeDao incomeDao = incomeRepository.findById(id).orElseThrow(
                () -> new IncomeNotFoundException(id)
        );
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(incomeDao.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        return incomeDao;
    }

    @Override
    public IncomeDao registerIncome(IncomeDao incomeDao, UUID incomeSourceId, UUID bankAccountId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        incomeDao.setUser(user);
        IncomeSourceDao incomeSourceDao = incomeSourceService.findById(incomeSourceId);
        if (!Objects.equals(incomeSourceDao.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        incomeDao.setIncomeSourceDao(incomeSourceDao);
        BankAccountDao bankAccountDao = bankAccountService.findById(bankAccountId);
        if (!Objects.equals(bankAccountDao.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        bankAccountService.addAssociatedIncome(bankAccountDao, incomeDao.getAmount());
        incomeDao.setBankAccount(bankAccountDao);
        return incomeRepository.save(incomeDao);

    }

    @Override
    public IncomeDao updateIncome(UUID id, IncomeDao incomeDao, UUID incomeSourceId, UUID bankAccountId) {
        IncomeDao incomeToEdit = this.findById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(user.getId(), incomeToEdit.getUser().getId())) {
            throw new UnauthorizedRequestException();
        }
        IncomeSourceDao incomeSourceDao = incomeSourceService.findById(incomeSourceId);
        incomeDao.setIncomeSourceDao(incomeSourceDao);
        BankAccountDao bankAccountDao = bankAccountService.findById(bankAccountId);
        if (incomeToEdit.getBankAccount().getId() != bankAccountId) {
            bankAccountService.deleteAssociatedIncome(incomeToEdit.getBankAccount(), incomeToEdit.getAmount());
            bankAccountService.addAssociatedIncome(bankAccountDao, incomeDao.getAmount());
        } else {
            bankAccountService.editAssociatedExpense(bankAccountDao, incomeToEdit.getAmount(), incomeDao.getAmount());
        }
        incomeDao.setBankAccount(bankAccountDao);
        incomeToEdit.setAmount(incomeDao.getAmount());
        incomeToEdit.setName(incomeDao.getName());
        incomeToEdit.setAnnotation(incomeDao.getAnnotation());
        return incomeRepository.save(incomeDao);
        //TODO: TEST this feature both on income and expense
        //TODO: CHECK if category and bank account has changed before calling the service
    }

    @Override
    public void deleteIncome(UUID id) {
        IncomeDao incomeToDelete = this.findById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(user.getId(), incomeToDelete.getUser().getId())) {
            throw new UnauthorizedRequestException();
        }
        BankAccountDao bankAccountDao = bankAccountService.findById(incomeToDelete.getBankAccount().getId());
        bankAccountService.deleteAssociatedIncome(bankAccountDao, incomeToDelete.getAmount());
        incomeRepository.delete(incomeToDelete);
    }
}
