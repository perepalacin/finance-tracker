package com.pere_palacin.app.services.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.pere_palacin.app.exceptions.BatchDeleteRequestToLargeException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.InvestmentCategoryDao;
import com.pere_palacin.app.domains.InvestmentDao;
import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.domains.sortBys.InvestmentSortBy;
import com.pere_palacin.app.exceptions.ImproperInvestmentDatesExpection;
import com.pere_palacin.app.exceptions.InvestmentNotFoundException;
import com.pere_palacin.app.repositories.InvestmentRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.AuthService;
import com.pere_palacin.app.services.BankAccountService;
import com.pere_palacin.app.services.InvestmentCategoryService;
import com.pere_palacin.app.services.InvestmentService;
import com.pere_palacin.app.services.UserDetailsServiceImpl;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvestmentServiceImpl implements InvestmentService {

    private final InvestmentRepository investmentRepository;
    private final InvestmentCategoryService investmentCategoryService;
    private final BankAccountService bankAccountService;
    private final AuthService authService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public List<InvestmentDao> findAll(InvestmentSortBy orderBy, int page, int pageSize, boolean ascending, String fromDate, String toDate, String searchInput) {
        UUID userId = userDetailsService.getRequestingUserId();
        Sort sort = Sort.by(ascending ? Sort.Direction.ASC : Sort.Direction.DESC, orderBy.getFieldName());
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate from = (fromDate != null) ? LocalDate.parse(fromDate, formatter) : null;
        LocalDate to = (toDate != null) ? LocalDate.parse(toDate, formatter) : null;
        if (fromDate == null && toDate == null && searchInput == null) {
            return investmentRepository.findAllByUserId(userId, pageable).getContent();
        } else if (fromDate == null && toDate == null) {
            return investmentRepository.findAllByUserIdAndAnnotationContainingIgnoreCaseOrNameContainingIgnoreCase(userId, searchInput, searchInput, pageable).getContent();
        } else if (searchInput == null) {
            return investmentRepository.findAllByUserIdAndStartDateBetweenOrEndDateBetween(userId, from, to, from, to, pageable).getContent();
        } else {
            return investmentRepository.findInvestmentsWithSearchInputBetweenTwoDates(userId, searchInput, from, to, pageable).getContent();
        }
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
        verifyInvestmentDates(investmentDao.getStartDate(), investmentDao.getEndDate());
        UUID userId = userDetailsService.getRequestingUserId();
        UserDao user = UserDao.builder().id(userId).build();
        investmentDao.setUser(user);
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
        verifyInvestmentDates(investmentDao.getStartDate(), investmentDao.getEndDate());
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
        investmentToEdit.setStartDate(investmentDao.getStartDate());
        investmentToEdit.setEndDate(investmentDao.getEndDate());
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

    @Override
    public void verifyInvestmentDates(LocalDate startDate, LocalDate endDate) throws ImproperInvestmentDatesExpection {
        if (startDate.isAfter(endDate)) {
            throw new ImproperInvestmentDatesExpection();
        }
    }

    @Transactional
    @Override
    public void deleteInBatch(Set<UUID> investmentsId) {
        if (investmentsId.size() > 60) {
            throw new BatchDeleteRequestToLargeException();
        }
        UUID userId = userDetailsService.getRequestingUserId();
        investmentRepository.deleteByIdInAndUserId(investmentsId.stream().toList(), userId);
    }
}

