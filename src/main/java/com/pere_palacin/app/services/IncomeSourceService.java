package com.pere_palacin.app.services;


import com.pere_palacin.app.domains.IncomeSourceDao;

import java.util.List;
import java.util.UUID;

public interface IncomeSourceService {
    IncomeSourceDao createIncomeSource(IncomeSourceDao incomeSourceDao);
    List<IncomeSourceDao> getAll();
    IncomeSourceDao findById(UUID id);
    IncomeSourceDao updateIncomeSource(IncomeSourceDao incomeSourceDao, UUID id);
    void deleteIncomeSource(UUID id);
}
