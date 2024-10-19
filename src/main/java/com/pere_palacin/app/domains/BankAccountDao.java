package com.pere_palacin.app.domains;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Getter
@Setter
@Table(name = "bank_accounts")
public class BankAccountDao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private BigDecimal currentBalance;
    @Column(nullable = false)
    private BigDecimal initialAmount;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal totalTransferOut;
    private BigDecimal totalTransferIn;
    private BigDecimal totalInvested;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Instant created_at;

    @LastModifiedDate
    private Instant updated_at;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserDao user;
}
