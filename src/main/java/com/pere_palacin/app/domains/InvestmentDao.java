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
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@EntityListeners(AuditingEntityListener.class)
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
    private String annotation;
    private Date startDate;
    private Date endDate;

    private BigDecimal amountInvested;

    @ManyToOne
    @JoinColumn(name = "investment_category", referencedColumnName = "id")
    private InvestmentCategoryDao investmentCategory;

    @ManyToOne
    @JoinColumn(name = "bank_accounts", referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private BankAccountDao bankAccount;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private Instant created_at;

    @LastModifiedDate
    private Instant updated_at;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserDao user;

}
