package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.TransferDao;
import com.pere_palacin.app.domains.sortBys.TransferSortBy;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface TransferService {
    List<TransferDao> findAll(TransferSortBy orderBy, int page, int pageSize, boolean ascending, String fromDate, String toDate, String searchInput);
    TransferDao findById(UUID id);
    TransferDao registerTransfer(TransferDao transferDao, UUID receivingBankAccountId, UUID sendingBankAccountId);
    TransferDao updateTransfer(UUID id, TransferDao transferDao, UUID receivingBankAccountId, UUID sendingBankAccountId);
    void deleteTransfer(UUID id);
    void deleteInBatch(Set<UUID> transfersId);

}
