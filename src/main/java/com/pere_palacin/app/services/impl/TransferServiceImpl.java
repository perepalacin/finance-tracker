package com.pere_palacin.app.services.impl;

import com.pere_palacin.app.domains.*;
import com.pere_palacin.app.exceptions.ExpenseNotFoundException;
import com.pere_palacin.app.exceptions.IncomeNotFoundException;
import com.pere_palacin.app.exceptions.TransferNotFoundException;
import com.pere_palacin.app.exceptions.UnauthorizedRequestException;
import com.pere_palacin.app.repositories.TransferRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.AuthService;
import com.pere_palacin.app.services.BankAccountService;
import com.pere_palacin.app.services.TransferService;
import com.pere_palacin.app.services.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransferServiceImpl implements TransferService {

    private final TransferRepository transferRepository;
    private final UserRepository userRepository;
    private final BankAccountService bankAccountService;
    private final AuthService authService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public Page<TransferDao> findAll() {
        UUID userId = userDetailsService.getRequestingUserId();
        Sort sort = Sort.by("name").ascending();
        //TODO: Add these parameters on the request!
        Pageable pageable = PageRequest.of(0, 10, sort);
        return transferRepository.findAllByUserIdOrderByName(userId, pageable);
    }

    @Override
    public TransferDao findById(UUID id) {
        TransferDao transferDao = transferRepository.findById(id).orElseThrow(
                () -> new TransferNotFoundException(id)
        );
        authService.authorizeRequest(transferDao.getUser().getId(), null);
        return transferDao;
    }

    @Transactional
    @Override
    public TransferDao registerTransfer(TransferDao transferDao, UUID receivingBankAccountId, UUID sendingBankAccountId) {
        UUID userId = userDetailsService.getRequestingUserId();
        UserDao user = UserDao.builder().id(userId).build();

        transferDao.setUser(user);

        BankAccountDao receivingBankAccount = bankAccountService.findById(receivingBankAccountId);
        transferDao.setReceivingAccount(receivingBankAccount);

        BankAccountDao sendingBankAccount = bankAccountService.findById(sendingBankAccountId);
        transferDao.setReceivingAccount(sendingBankAccount);

        bankAccountService.createTransfer(receivingBankAccount, sendingBankAccount, transferDao.getAmount());

        return transferRepository.save(transferDao);
    }

    @Transactional
    @Override
    public TransferDao updateTransfer(UUID id, TransferDao transferDao, UUID receivingBankAccountId, UUID sendingBankAccountId) {
        TransferDao transferToEdit = this.findById(id);

        if (receivingBankAccountId != transferToEdit.getReceivingAccount().getId()) {
            BankAccountDao newReceivingBankAccount = bankAccountService.findById(receivingBankAccountId);
            transferToEdit.setReceivingAccount(newReceivingBankAccount);
            bankAccountService.changeReceivingTransferAccount(transferDao.getReceivingAccount(), newReceivingBankAccount, transferDao.getAmount());
        } else {
            bankAccountService.editTransferAmount(transferToEdit.getReceivingAccount(), transferToEdit.getAmount(), transferDao.getAmount(), true);
        }
        if (sendingBankAccountId != transferToEdit.getSendingAccount().getId()) {
            BankAccountDao newSendingBankAccount = bankAccountService.findById(sendingBankAccountId);
            transferToEdit.setSendingAccount(newSendingBankAccount);
            bankAccountService.changeSendingReceivingTransferAccount(transferToEdit.getSendingAccount(), newSendingBankAccount, transferDao.getAmount());
        } else {
            bankAccountService.editTransferAmount(transferToEdit.getSendingAccount(), transferToEdit.getAmount(), transferDao.getAmount(), false);
        }
        transferToEdit.setAmount(transferDao.getAmount());
        transferToEdit.setName(transferDao.getName());
        transferToEdit.setAnnotation(transferDao.getAnnotation());
        return transferRepository.save(transferToEdit);
    }

    @Transactional
    @Override
    public void deleteTransfer(UUID id) {
        TransferDao transferToDelete = this.findById(id);
        BankAccountDao receivingBankAccount = bankAccountService.findById(transferToDelete.getReceivingAccount().getId());
        BankAccountDao sendingBankAccount = bankAccountService.findById(transferToDelete.getSendingAccount().getId());
        bankAccountService.deleteTransfer(receivingBankAccount, sendingBankAccount, transferToDelete.getAmount());
        transferRepository.delete(transferToDelete);
    }
}
