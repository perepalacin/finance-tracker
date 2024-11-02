package com.pere_palacin.app.services.impl;

import com.pere_palacin.app.domains.IncomeSourceDao;
import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.exceptions.IncomeSourceNotFoundException;
import com.pere_palacin.app.exceptions.UnauthorizedRequestException;
import com.pere_palacin.app.repositories.IncomeSourceRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.AuthService;
import com.pere_palacin.app.services.IncomeSourceService;
import com.pere_palacin.app.services.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IncomeSourceServiceImpl implements IncomeSourceService {

    private final IncomeSourceRepository incomeSourceRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public IncomeSourceDao createIncomeSource(IncomeSourceDao incomeSourceDao) {
        UUID userId = userDetailsService.getRequestingUserId();
        UserDao user = UserDao.builder().id(userId).build();
        incomeSourceDao.setUser(user);
        return incomeSourceRepository.save(incomeSourceDao);
    }

    @Override
    public List<IncomeSourceDao> getAll() {
        UUID userId = userDetailsService.getRequestingUserId();
        return incomeSourceRepository.findByUserId(userId);
    }

    @Override
    public IncomeSourceDao findById(UUID id) {
        IncomeSourceDao incomeSourceDao = incomeSourceRepository.findById(id).orElseThrow(
                () -> new IncomeSourceNotFoundException(id)
        );
        authService.authorizeRequest(incomeSourceDao.getUser().getId(), null);
        return incomeSourceDao;
    }

    @Override
    public IncomeSourceDao updateIncomeSource(IncomeSourceDao incomeSourceDao, UUID id) {
        IncomeSourceDao incomeSourceToUpdate = this.findById(id);
        incomeSourceToUpdate.setName(incomeSourceDao.getName());
        incomeSourceToUpdate.setColor(incomeSourceDao.getColor());
        incomeSourceRepository.save(incomeSourceToUpdate);
        return incomeSourceToUpdate;
    }

    @Override
    public void deleteIncomeSource(UUID id) {
        IncomeSourceDao incomeSourceToDelete = this.findById(id);
        incomeSourceRepository.delete(incomeSourceToDelete);
    }
}
