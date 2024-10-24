package com.pere_palacin.app.domains;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "investments")
public class InvestmentDao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private Date startDate;
    private Date endDate;

    private BigDecimal amountInvested;
    private BigDecimal currentAmount;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserDao user;

    @ManyToOne //We swap the id for the object it relates to and we provide the type of relationship on top.
    @JoinColumn(name = "bank_accounts", referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private BankAccountDao bankAccount;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private Instant created_at;

    @LastModifiedDate
    private Instant updated_at;
}
