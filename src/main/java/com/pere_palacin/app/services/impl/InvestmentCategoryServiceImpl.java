package com.pere_palacin.app.services.impl;

import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.IncomeSourceDao;
import com.pere_palacin.app.domains.InvestmentCategoryDao;
import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.exceptions.CategoryNotFoundException;
import com.pere_palacin.app.exceptions.IncomeSourceNotFoundException;
import com.pere_palacin.app.exceptions.InvestmentCategoryNotFoundException;
import com.pere_palacin.app.exceptions.UnauthorizedRequestException;
import com.pere_palacin.app.repositories.InvestmentCategoryRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.InvestmentCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestmentCategoryServiceImpl implements InvestmentCategoryService {

    private final InvestmentCategoryRepository investmentCategoryRepository;
    private final UserRepository userRepository;

    @Override
    public InvestmentCategoryDao createInvestmentCategory(InvestmentCategoryDao investmentCategoryDao) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        investmentCategoryDao.setUser(user);
        return investmentCategoryRepository.save(investmentCategoryDao);
    }

    @Override
    public List<InvestmentCategoryDao> findAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        return investmentCategoryRepository.findByUserId(user.getId());
    }

    @Override
    public InvestmentCategoryDao findById(UUID id) {
        InvestmentCategoryDao investmentCategoryDao = investmentCategoryRepository.findById(id).orElseThrow(
                () -> new InvestmentCategoryNotFoundException(id)
        );
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(investmentCategoryDao.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        return investmentCategoryDao;
    }

    @Override
    public Set<InvestmentCategoryDao> findAllById(List<UUID> categoryIds) {
        List<InvestmentCategoryDao> investmentCategoryDaos = investmentCategoryRepository.findAllById(categoryIds);
        Set<UUID> foundIds = investmentCategoryDaos.stream()
                .map(InvestmentCategoryDao::getId)
                .collect(Collectors.toSet());
        for (UUID id : categoryIds) {
            if (!foundIds.contains(id)) {
                throw new CategoryNotFoundException(id);
            }
        }
        return new HashSet<>(investmentCategoryDaos);
    }

    @Override
    public InvestmentCategoryDao updateInvestmentCategory(InvestmentCategoryDao investmentCategoryDao, UUID id) {
        InvestmentCategoryDao investmentCategoryToUpdate = this.findById(id);
        investmentCategoryToUpdate.setInvestmentCategoryName(investmentCategoryDao.getInvestmentCategoryName());
        investmentCategoryToUpdate.setColor(investmentCategoryDao.getColor());
        investmentCategoryRepository.save(investmentCategoryToUpdate);
        return investmentCategoryToUpdate;
    }

    @Override
    public void deleteInvestmentCategory(UUID id) {
        InvestmentCategoryDao investmentCategoryToDelete = this.findById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(investmentCategoryToDelete.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        investmentCategoryRepository.delete(investmentCategoryToDelete);
    }
}
