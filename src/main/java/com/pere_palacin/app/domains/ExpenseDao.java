package com.pere_palacin.app.domains;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "expenses")
public class ExpenseDao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private BigDecimal amount;
    private String annotation;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date created_at;

    @ManyToOne(cascade = CascadeType.ALL) //We swap the id for the object it relates to and we provide the type of relationship on top.
    @JoinColumn(name = "bank_accounts")
    private BankAccountDao bankAccount;
}
