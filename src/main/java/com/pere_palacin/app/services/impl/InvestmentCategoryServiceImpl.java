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
import com.pere_palacin.app.services.AuthService;
import com.pere_palacin.app.services.InvestmentCategoryService;
import com.pere_palacin.app.services.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestmentCategoryServiceImpl implements InvestmentCategoryService {

    private final InvestmentCategoryRepository investmentCategoryRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public InvestmentCategoryDao createInvestmentCategory(InvestmentCategoryDao investmentCategoryDao) {
        UUID userId = userDetailsService.getRequestingUserId();
        UserDao user = UserDao.builder().id(userId).build();
        investmentCategoryDao.setUser(user);
        return investmentCategoryRepository.save(investmentCategoryDao);
    }

    @Override
    public List<InvestmentCategoryDao> findAll() {
        UUID userId = userDetailsService.getRequestingUserId();
        return investmentCategoryRepository.findByUserId(userId);
    }

    @Override
    public InvestmentCategoryDao findById(UUID id) {
        InvestmentCategoryDao investmentCategoryDao = investmentCategoryRepository.findById(id).orElseThrow(
                () -> new InvestmentCategoryNotFoundException(id)
        );
        authService.authorizeRequest(investmentCategoryDao.getUser().getId(), null);
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
        authService.authorizeRequest(investmentCategoryDaos.stream().map(InvestmentCategoryDao::getUser).map(UserDao::getId).collect(Collectors.toSet()), null);
        return new HashSet<>(investmentCategoryDaos);
    }

    @Override
    public InvestmentCategoryDao updateInvestmentCategory(InvestmentCategoryDao investmentCategoryDao, UUID id) {
        InvestmentCategoryDao investmentCategoryToUpdate = this.findById(id);
        investmentCategoryToUpdate.setInvestmentCategoryName(investmentCategoryDao.getInvestmentCategoryName());
        investmentCategoryToUpdate.setColor(investmentCategoryDao.getColor());
        return investmentCategoryRepository.save(investmentCategoryToUpdate);
    }

    @Override
    public void deleteInvestmentCategory(UUID id) {
        InvestmentCategoryDao investmentCategoryToDelete = this.findById(id);
        investmentCategoryRepository.delete(investmentCategoryToDelete);
    }
}
