package com.pere_palacin.app.services.impl;

import com.pere_palacin.app.domains.IncomeSourceDao;
import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.exceptions.IncomeSourceNotFoundException;
import com.pere_palacin.app.exceptions.UnauthorizedRequestException;
import com.pere_palacin.app.repositories.IncomeSourceRepository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.IncomeSourceService;
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
    @Override
    public IncomeSourceDao createIncomeSource(IncomeSourceDao incomeSourceDao) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        incomeSourceDao.setUser(user);
        return incomeSourceRepository.save(incomeSourceDao);
    }

    @Override
    public List<IncomeSourceDao> getAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        return incomeSourceRepository.findByUserId(user.getId());
    }

    @Override
    public IncomeSourceDao findById(UUID id) {
        IncomeSourceDao incomeSourceDao = incomeSourceRepository.findById(id).orElseThrow(
                () -> new IncomeSourceNotFoundException(id)
        );
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(incomeSourceDao.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
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
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        if (!Objects.equals(incomeSourceToDelete.getUser().getId(), user.getId())) {
            throw new UnauthorizedRequestException();
        }
        incomeSourceRepository.delete(incomeSourceToDelete);
    }
}
