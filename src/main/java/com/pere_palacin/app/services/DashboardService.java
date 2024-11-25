package com.pere_palacin.app.services;


import com.pere_palacin.app.domains.InvestmentDao;
import com.pere_palacin.app.domains.dto.IncomeAndExpensesChartDto;
import com.pere_palacin.app.domains.dto.IncomeSourceWithAmountDto;
import com.pere_palacin.app.domains.dto.InvestmentCategoriesWithAmountDto;

import java.util.List;

public interface DashboardService {
    List<IncomeAndExpensesChartDto> getExpensesAndIncomesChartData();
    List<IncomeSourceWithAmountDto> getIncomeSourcesChartData();
    List<InvestmentCategoriesWithAmountDto> findInvestmentCategoriesWithAmounts();
    List<InvestmentDao> findInvestmentsAboutToExpire();
}
