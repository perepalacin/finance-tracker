package com.pere_palacin.app.services.impl;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.exceptions.BankAcountNotFoundException;
import com.pere_palacin.app.exceptions.UnauthorizedRequestException;
import com.pere_palacin.app.repositories.BankAccountRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.BankAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BankAccountServiceImpl implements BankAccountService {

    private final BankAccountRepository bankAccountRepository;
    private final UserRepository userRepository;

    @Override
    public BankAccountDao createAccount(BankAccountDao bankAccountDao) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        bankAccountDao.setUser(user);
        bankAccountDao.setTotalExpenses(new BigDecimal(0));
        bankAccountDao.setCurrentBalance(bankAccountDao.getInitialAmount());
        bankAccountDao.setTotalIncome(new BigDecimal(0));
        bankAccountDao.setTotalTransferIn(new BigDecimal(0));
        bankAccountDao.setTotalTransferOut(new BigDecimal(0));
        bankAccountDao.setTotalInvested(new BigDecimal(0));
        return bankAccountRepository.save(bankAccountDao);
    }

    @Override
    public List<BankAccountDao> findAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        return bankAccountRepository.findByUserId(user.getId());
    }

    @Override
    public BankAccountDao findById(UUID id) {
        return bankAccountRepository.findById(id).orElseThrow(
                () -> new BankAcountNotFoundException(id)
        );
    }

    @Override
    public BankAccountDao updateAccount(UUID id, BankAccountDao bankAccountDao) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        BankAccountDao bankAccountToEdit = this.findById(id);
        if (!Objects.equals(user.getId(), bankAccountToEdit.getUser().getId())) {
            throw new UnauthorizedRequestException();
        }
        bankAccountToEdit.setName(bankAccountDao.getName());
        bankAccountToEdit.setCurrentBalance(bankAccountToEdit.getCurrentBalance().subtract(bankAccountToEdit.getInitialAmount()).add(bankAccountDao.getInitialAmount()));
        bankAccountToEdit.setInitialAmount(bankAccountDao.getInitialAmount());
        bankAccountRepository.save(bankAccountToEdit);
        return bankAccountToEdit;
    }

    @Override
    public void addAssociatedExpense(BankAccountDao bankAccountDao, BigDecimal amountSpent) {
        bankAccountDao.setCurrentBalance(bankAccountDao.getCurrentBalance().subtract(amountSpent));
        bankAccountDao.setTotalExpenses(bankAccountDao.getTotalExpenses().add(amountSpent));
        bankAccountRepository.save(bankAccountDao);
    }

    @Override
    public void editAssociatedExpense(BankAccountDao bankAccountDao, BigDecimal initialAmount, BigDecimal newAmount) {
        bankAccountDao.setCurrentBalance(bankAccountDao.getCurrentBalance().add(initialAmount).subtract(newAmount));
        bankAccountDao.setTotalExpenses(bankAccountDao.getTotalExpenses().subtract(initialAmount).add(newAmount));
        bankAccountRepository.save(bankAccountDao);
    }

    @Override
    public void deleteAssociatedExpense(BankAccountDao bankAccountDao, BigDecimal amountToRemove) {
        bankAccountDao.setCurrentBalance(bankAccountDao.getCurrentBalance().add(amountToRemove));
        bankAccountDao.setTotalExpenses(bankAccountDao.getTotalExpenses().subtract(amountToRemove));
        bankAccountRepository.save(bankAccountDao);
    }

    @Override
    public void deleteAccount(UUID id) {
        BankAccountDao bankAccountDao = this.findById(id);
        bankAccountRepository.delete(bankAccountDao);
    }
}
