package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.TransferDao;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface TransferService {
    Page<TransferDao> findAll();
    TransferDao findById(UUID id);
    TransferDao registerTransfer(TransferDao transferDao, UUID receivingBankAccountId, UUID sendingBankAccountId);
    TransferDao updateTransfer(UUID id, TransferDao transferDao, UUID receivingBankAccountId, UUID sendingBankAccountId);
    void deleteTransfer(UUID id);
}
