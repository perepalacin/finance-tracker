package com.pere_palacin.app.services.impl;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.exceptions.BankAcountNotFoundException;
import com.pere_palacin.app.repositories.BankAccountRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.BankAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
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
    public BankAccountDao updateAccount( UUID id, BigDecimal amount) {
        BankAccountDao bankAccountDao = this.findById(id);
        bankAccountDao.setCurrentBalance(bankAccountDao.getCurrentBalance().add(amount));
        bankAccountRepository.save(bankAccountDao);
        return bankAccountDao;
    }

    @Override
    public void deleteAccount(UUID id) {
        BankAccountDao bankAccountDao = this.findById(id);
        bankAccountRepository.delete(bankAccountDao);
    }
}
