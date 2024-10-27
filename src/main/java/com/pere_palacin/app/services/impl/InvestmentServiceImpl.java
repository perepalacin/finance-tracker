package com.pere_palacin.app.services.impl;

import com.pere_palacin.app.domains.*;
import com.pere_palacin.app.exceptions.InvestmentNotFoundException;
import com.pere_palacin.app.exceptions.UnauthorizedRequestException;
import com.pere_palacin.app.repositories.InvestmentRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.BankAccountService;
import com.pere_palacin.app.services.InvestmentCategoryService;
import com.pere_palacin.app.services.InvestmentService;
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
public class InvestmentServiceImpl implements InvestmentService {

    private final UserRepository userRepository;
    private final InvestmentRepository investmentRepository;
    private final InvestmentCategoryService investmentCategoryService;
    private final BankAccountService bankAccountService;

    @Override
    public Page<InvestmentDao> findAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        Sort sort = Sort.by("name").ascending();
        //TODO: Add these parameters on the request!
        Pageable pageable = PageRequest.of(0, 10, sort);
        return investmentRepository.findAllByUserIdOrderByName(user.getId(), pageable);
    }

    @Override
    public InvestmentDao findById(UUID id) {
        return investmentRepository.findById(id).orElseThrow(
                () -> new InvestmentNotFoundException(id)
        );
    }

    @Override
    public InvestmentDao createInvestment(InvestmentDao investmentDao, UUID investmentCategoryId, UUID bankAccountId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        investmentDao.setUser(user);
        InvestmentCategoryDao investmentCategoryDao = investmentCategoryService.findById(investmentCategoryId);
        if (!Objects.equals(investmentCategoryDao.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        investmentDao.setInvestmentCategory(investmentCategoryDao);
        BankAccountDao bankAccountDao = bankAccountService.findById(bankAccountId);
        if (!Objects.equals(bankAccountDao.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        bankAccountService.addInvestment(bankAccountDao, investmentDao.getAmountInvested());
        investmentDao.setBankAccount(bankAccountDao);
        System.out.println(bankAccountDao.getId());
        return investmentRepository.save(investmentDao);
    }

    @Override
    public InvestmentDao updateInvestment(UUID id, InvestmentDao investmentDao, UUID investmentCategoryId, UUID bankAccountId) {
        InvestmentDao investmentToEdit = this.findById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(user.getId(), investmentToEdit.getUser().getId())) {
            throw new UnauthorizedRequestException();
        }
        if (!Objects.equals(investmentToEdit.getInvestmentCategory().getId(), investmentCategoryId)) {
            InvestmentCategoryDao investmentCategoryDao = investmentCategoryService.findById(investmentCategoryId);
            if (!Objects.equals(user.getId(), investmentCategoryDao.getUser().getId())) {
                throw new UnauthorizedRequestException();
            }
            investmentToEdit.setInvestmentCategory(investmentCategoryDao);
        }
        if (!Objects.equals(investmentToEdit.getBankAccount().getId(), bankAccountId)) {
            // TODO: Transfer amount is not changing on both accounts, check out why!?
            bankAccountService.deleteInvestedAmount(investmentToEdit.getBankAccount(), investmentToEdit.getAmountInvested());
            investmentToEdit.setBankAccount(bankAccountService.addInvestment(bankAccountService.findById(bankAccountId), investmentDao.getAmountInvested()));
            investmentToEdit.setAmountInvested(investmentDao.getAmountInvested());
        } else if (!Objects.equals(investmentDao.getAmountInvested(), investmentToEdit.getAmountInvested())){
            investmentToEdit.setBankAccount(bankAccountService.updateInvestedAmount(investmentToEdit.getBankAccount(), investmentDao.getAmountInvested(), investmentToEdit.getAmountInvested()));
            investmentToEdit.setAmountInvested(investmentDao.getAmountInvested());
        }
        investmentToEdit.setName(investmentDao.getName());
        investmentToEdit.setStartDate(investmentDao.getStartDate());
        investmentToEdit.setEndDate(investmentDao.getEndDate());
        investmentToEdit.setAnnotation(investmentDao.getAnnotation());
        return investmentRepository.save(investmentToEdit);
    }

    @Transactional
    @Override
    public void deleteInvestment(UUID id) {
        InvestmentDao investmentToDelete = this.findById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(user.getId(), investmentToDelete.getUser().getId())) {
            throw new UnauthorizedRequestException();
        }
        bankAccountService.deleteInvestedAmount(investmentToDelete.getBankAccount(), investmentToDelete.getAmountInvested());
        investmentRepository.delete(investmentToDelete);
    }
}

