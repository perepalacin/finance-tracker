package com.pere_palacin.app.services.impl;

import com.pere_palacin.app.domains.*;
import com.pere_palacin.app.exceptions.InvestmentNotFoundException;
import com.pere_palacin.app.repositories.InvestmentRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestmentServiceImpl implements InvestmentService {

    private final UserRepository userRepository;
    private final InvestmentRepository investmentRepository;
    private final InvestmentCategoryService investmentCategoryService;
    private final BankAccountService bankAccountService;
    private final AuthService authService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public Page<InvestmentDao> findAll() {
        UUID userId = userDetailsService.getRequestingUserId();
        Sort sort = Sort.by("name").ascending();
        //TODO: Add these parameters on the request!
        Pageable pageable = PageRequest.of(0, 10, sort);
        return investmentRepository.findAllByUserIdOrderByName(userId, pageable);
    }

    @Override
    public InvestmentDao findById(UUID id) {
        InvestmentDao investmentDao = investmentRepository.findById(id).orElseThrow(
                () -> new InvestmentNotFoundException(id)
        );
        authService.authorizeRequest(investmentDao.getUser().getId(), null);
        return investmentDao;
    }

    @Transactional
    @Override
    public InvestmentDao createInvestment(InvestmentDao investmentDao, UUID bankAccountId) {
        Set<InvestmentCategoryDao> investmentCategoryDaos = investmentCategoryService.findAllById(investmentDao.getInvestmentCategories().stream().map(InvestmentCategoryDao::getId).toList());
        investmentDao.setInvestmentCategories(investmentCategoryDaos);
        BankAccountDao bankAccountDao = bankAccountService.findById(bankAccountId);
        authService.authorizeRequest(bankAccountDao.getUser().getId(), null);
        bankAccountService.addInvestment(bankAccountDao, investmentDao.getAmountInvested());
        investmentDao.setBankAccount(bankAccountDao);
        return investmentRepository.save(investmentDao);
    }

    @Transactional
    @Override
    public InvestmentDao updateInvestment(UUID id, InvestmentDao investmentDao, UUID bankAccountId) {
        InvestmentDao investmentToEdit = this.findById(id);
        UUID userId = userDetailsService.getRequestingUserId();
        authService.authorizeRequest(investmentToEdit.getUser().getId(), userId);

        Set<InvestmentCategoryDao> existingCategories = investmentToEdit.getInvestmentCategories();
        Set<UUID> existingCategoryIds = existingCategories
                .stream()
                .map(InvestmentCategoryDao::getId)
                .collect(Collectors.toSet());

        Set<UUID> newCategoryIds = investmentDao.getInvestmentCategories()
                .stream()
                .map(InvestmentCategoryDao::getId)
                .collect(Collectors.toSet());

        Set<InvestmentCategoryDao> investmentCategoryDaosToSave = new HashSet<>();
        Set<UUID> alreadyFetchedCategoryIds = new HashSet<>();
        for (InvestmentCategoryDao categoryDao : existingCategories) {
            if (newCategoryIds.contains(categoryDao.getId())) {
                investmentCategoryDaosToSave.add(categoryDao);
                alreadyFetchedCategoryIds.add(categoryDao.getId());
            }
        }

        List<UUID> categoriesToFetch = new ArrayList<>();
        for (UUID categoryId : newCategoryIds) {
            if (!alreadyFetchedCategoryIds.contains(categoryId)) {
                categoriesToFetch.add(categoryId);
            }
        }

        if (!categoriesToFetch.isEmpty()) {
            Set<InvestmentCategoryDao> newCategories = investmentCategoryService.findAllById(categoriesToFetch);
            authService.authorizeRequest(newCategories.stream().map(InvestmentCategoryDao::getUser).map(UserDao::getId).collect(Collectors.toSet()), userId);
            investmentCategoryDaosToSave.addAll(newCategories);
        }

        investmentToEdit.setInvestmentCategories(investmentCategoryDaosToSave);

        if (!Objects.equals(investmentToEdit.getBankAccount().getId(), bankAccountId)) {
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
        bankAccountService.deleteInvestedAmount(investmentToDelete.getBankAccount(), investmentToDelete.getAmountInvested());
        investmentRepository.delete(investmentToDelete);
    }
}

