package com.pere_palacin.app.services.impl;

import com.pere_palacin.app.domains.*;
import com.pere_palacin.app.exceptions.ExpenseNotFoundException;
import com.pere_palacin.app.exceptions.IncomeNotFoundException;
import com.pere_palacin.app.exceptions.TransferNotFoundException;
import com.pere_palacin.app.exceptions.UnauthorizedRequestException;
import com.pere_palacin.app.repositories.TransferRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.BankAccountService;
import com.pere_palacin.app.services.TransferService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransferServiceImpl implements TransferService {

    private final TransferRepository transferRepository;
    private final UserRepository userRepository;
    private final BankAccountService bankAccountService;

    @Override
    public Page<TransferDao> findAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        Sort sort = Sort.by("name").ascending();
        //TODO: Add these parameters on the request!
        Pageable pageable = PageRequest.of(0, 10, sort);
        return transferRepository.findAllByUserIdOrderByName(user.getId(), pageable);
    }

    @Override
    public TransferDao findById(UUID id) {
        TransferDao transferDao = transferRepository.findById(id).orElseThrow(
                () -> new TransferNotFoundException(id)
        );
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(transferDao.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        return transferDao;
    }

    @Override
    public TransferDao registerTransfer(TransferDao transferDao, UUID receivingBankAccountId, UUID sendingBankAccountId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        transferDao.setUser(user);
        BankAccountDao receivingBankAccount = bankAccountService.findById(receivingBankAccountId);
        if (!Objects.equals(receivingBankAccount.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        transferDao.setReceivingAccount(receivingBankAccount);
        BankAccountDao sendingBankAccount = bankAccountService.findById(sendingBankAccountId);
        if (!Objects.equals(sendingBankAccount.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        transferDao.setReceivingAccount(sendingBankAccount);
        bankAccountService.createTransfer(receivingBankAccount, sendingBankAccount, transferDao.getAmount());
        return transferRepository.save(transferDao);
    }

    @Override
    public TransferDao updateTransfer(UUID id, TransferDao transferDao, UUID receivingBankAccountId, UUID sendingBankAccountId) {
        TransferDao transferToEdit = this.findById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(user.getId(), transferToEdit.getUser().getId())) {
            throw new UnauthorizedRequestException();
        }
        if (receivingBankAccountId != transferToEdit.getReceivingAccount().getId()) {
            BankAccountDao newReceivingBankAccount = bankAccountService.findById(receivingBankAccountId);
            if (!Objects.equals(newReceivingBankAccount.getUser().getId(), user.getId())) {
                throw new UnauthorizedRequestException();
            }
            transferToEdit.setReceivingAccount(newReceivingBankAccount);
            bankAccountService.changeReceivingTransferAccount(transferDao.getReceivingAccount(), newReceivingBankAccount, transferDao.getAmount());
        } else {
        }
        if (sendingBankAccountId != transferToEdit.getSendingAccount().getId()) {
            BankAccountDao newSendingBankAccount = bankAccountService.findById(sendingBankAccountId);
            if (!Objects.equals(newSendingBankAccount.getUser().getId(), user.getId())) {
                throw new UnauthorizedRequestException();
            }
            transferToEdit.setSendingAccount(newSendingBankAccount);
            bankAccountService.changeSendingReceivingTransferAccount(transferToEdit.getSendingAccount(), newSendingBankAccount, transferDao.getAmount());
        } else {

        }
        transferToEdit.setAmount(transferDao.getAmount());
        transferToEdit.setName(transferDao.getName());
        transferToEdit.setAnnotation(transferDao.getAnnotation());
        return transferRepository.save(transferToEdit);
    }

    @Override
    public void deleteTransfer(UUID id) {
        TransferDao transferToDelete = this.findById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(transferToDelete.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        BankAccountDao receivingBankAccount = bankAccountService.findById(transferToDelete.getReceivingAccount().getId());
        if (!Objects.equals(receivingBankAccount.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        BankAccountDao sendingBankAccount = bankAccountService.findById(transferToDelete.getSendingAccount().getId());
        if (!Objects.equals(sendingBankAccount.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        bankAccountService.deleteTransfer(receivingBankAccount, sendingBankAccount, transferToDelete.getAmount());
        transferRepository.delete(transferToDelete);
    }
}
