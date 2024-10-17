package com.pere_palacin.app.domains;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "bank_accounts")
public class BankAccountDao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private BigDecimal currentBalance;
    @Column(nullable = false)
    private BigDecimal initialAmount;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal totalTransferOut;
    private BigDecimal totalTransferIn;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date created_at;

    @ManyToOne(cascade = CascadeType.ALL) //We swap the id for the object it relates to and we provide the type of relationship on top.
    @JoinColumn(name = "users")
    private UserDao user;
}
