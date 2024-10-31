package com.pere_palacin.app.services.impl;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.exceptions.BankAcountNotFoundException;
import com.pere_palacin.app.exceptions.UnauthorizedRequestException;
import com.pere_palacin.app.repositories.BankAccountRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.BankAccountService;
import com.pere_palacin.app.services.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BankAccountServiceImpl implements BankAccountService {

    private final BankAccountRepository bankAccountRepository;
    private final UserRepository userRepository;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public BankAccountDao createAccount(BankAccountDao bankAccountDao) {
        UUID userId = userDetailsService.getRequestingUserId();
        UserDao user = UserDao.builder().id(userId).build();
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
        UUID userId = userDetailsService.getRequestingUserId();
        return bankAccountRepository.findByUserId(userId);
    }

    @Override
    public BankAccountDao findById(UUID id) {
        UUID userId = userDetailsService.getRequestingUserId();
        //TODO: Check if authorized!
        return bankAccountRepository.findById(id).orElseThrow(
                () -> new BankAcountNotFoundException(id)
        );
    }

    @Override
    public BankAccountDao updateAccount(UUID id, BankAccountDao bankAccountDao) {
        UUID userId = userDetailsService.getRequestingUserId();
        UserDao user = UserDao.builder().id(userId).build();
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
    public void addAssociatedIncome(BankAccountDao bankAccountDao, BigDecimal incomeAmount) {
        bankAccountDao.setCurrentBalance(bankAccountDao.getCurrentBalance().add(incomeAmount));
        bankAccountDao.setTotalIncome(bankAccountDao.getTotalIncome().add(incomeAmount));
        bankAccountRepository.save(bankAccountDao);
    }

    @Override
    public void editAssociatedIncome(BankAccountDao bankAccountDao, BigDecimal initialIncome, BigDecimal newIncome) {
        bankAccountDao.setCurrentBalance(bankAccountDao.getCurrentBalance().subtract(initialIncome).add(newIncome));
        bankAccountDao.setTotalIncome(bankAccountDao.getTotalIncome().subtract(initialIncome).add(newIncome));
        bankAccountRepository.save(bankAccountDao);
    }

    @Override
    public void deleteAssociatedIncome(BankAccountDao bankAccountDao, BigDecimal amountToRemove) {
        bankAccountDao.setCurrentBalance(bankAccountDao.getCurrentBalance().subtract(amountToRemove));
        bankAccountDao.setTotalIncome(bankAccountDao.getTotalIncome().subtract(amountToRemove));
        bankAccountRepository.save(bankAccountDao);
    }

    @Override
    public void deleteAccount(UUID id) {
        BankAccountDao bankAccountDao = this.findById(id);
        bankAccountRepository.delete(bankAccountDao);
    }

    @Override
    public void createTransfer(BankAccountDao receivingBankAccount, BankAccountDao sendingBankAccount, BigDecimal amount) {
        receivingBankAccount.setTotalTransferIn(receivingBankAccount.getTotalTransferIn().add(amount));
        receivingBankAccount.setCurrentBalance(receivingBankAccount.getCurrentBalance().add(amount));
        sendingBankAccount.setTotalTransferOut(sendingBankAccount.getTotalTransferOut().add(amount));
        sendingBankAccount.setCurrentBalance(sendingBankAccount.getCurrentBalance().subtract(amount));
        bankAccountRepository.save(receivingBankAccount);
        bankAccountRepository.save(sendingBankAccount);
    }

    @Override
    public void editTransferAmount(BankAccountDao bankAccountDao, BigDecimal oldAmount, BigDecimal newAmount, boolean isTransferOut) {
        if (isTransferOut) {
            bankAccountDao.setCurrentBalance(bankAccountDao.getCurrentBalance().add(oldAmount).subtract(newAmount));
            bankAccountDao.setTotalTransferOut(bankAccountDao.getTotalTransferOut().subtract(oldAmount).add(newAmount));
        } else {
            bankAccountDao.setCurrentBalance(bankAccountDao.getCurrentBalance().subtract(oldAmount).add(newAmount));
            bankAccountDao.setTotalTransferIn(bankAccountDao.getTotalTransferIn().subtract(oldAmount).add(newAmount));
        }
        bankAccountRepository.save(bankAccountDao);
    }

    @Override
    public void changeReceivingTransferAccount(BankAccountDao oldReceivingAccount, BankAccountDao newReceivingAccount, BigDecimal amount) {
        oldReceivingAccount.setCurrentBalance(oldReceivingAccount.getCurrentBalance().subtract(amount));
        oldReceivingAccount.setTotalTransferIn(oldReceivingAccount.getTotalTransferIn().subtract(amount));
        newReceivingAccount.setCurrentBalance(newReceivingAccount.getCurrentBalance().add(amount));
        newReceivingAccount.setTotalTransferIn(newReceivingAccount.getTotalTransferIn().add(amount));
        bankAccountRepository.save(oldReceivingAccount);
        bankAccountRepository.save(newReceivingAccount);
    }

    @Override
    public void changeSendingReceivingTransferAccount(BankAccountDao oldSendingAccount, BankAccountDao newSendingAccount, BigDecimal amount) {
        oldSendingAccount.setCurrentBalance(oldSendingAccount.getCurrentBalance().add(amount));
        oldSendingAccount.setTotalTransferOut(oldSendingAccount.getTotalTransferOut().subtract(amount));
        newSendingAccount.setCurrentBalance(newSendingAccount.getCurrentBalance().subtract(amount));
        newSendingAccount.setTotalTransferOut(newSendingAccount.getTotalTransferOut().add(amount));
        bankAccountRepository.save(oldSendingAccount);
        bankAccountRepository.save(newSendingAccount);
    }

    @Override
    public void deleteTransfer(BankAccountDao receivingBankAccount, BankAccountDao sendingBankAccount, BigDecimal amount) {
        receivingBankAccount.setCurrentBalance(receivingBankAccount.getCurrentBalance().subtract(amount));
        receivingBankAccount.setTotalTransferIn(receivingBankAccount.getTotalTransferIn().subtract(amount));
        sendingBankAccount.setCurrentBalance(sendingBankAccount.getCurrentBalance().add(amount));
        sendingBankAccount.setTotalTransferOut(sendingBankAccount.getTotalTransferOut().subtract(amount));
        bankAccountRepository.save(receivingBankAccount);
        bankAccountRepository.save(receivingBankAccount);
    }

    @Override
    public BankAccountDao addInvestment(BankAccountDao bankAccountDao, BigDecimal investedAmount) {
        bankAccountDao.setTotalInvested(bankAccountDao.getTotalInvested().add(investedAmount));
        return bankAccountRepository.save(bankAccountDao);
    }

    @Override
    public BankAccountDao updateInvestedAmount(BankAccountDao bankAccountDao, BigDecimal newAmount, BigDecimal oldAmount) {
        bankAccountDao.setTotalInvested(bankAccountDao.getTotalInvested().subtract(oldAmount).add(newAmount));
        return bankAccountRepository.save(bankAccountDao);
    }

    @Override
    public void deleteInvestedAmount(BankAccountDao bankAccountDao, BigDecimal amount) {
        bankAccountDao.setTotalInvested(bankAccountDao.getTotalInvested().subtract(amount));
        bankAccountRepository.save(bankAccountDao);
    }
}
