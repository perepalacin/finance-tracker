package com.pere_palacin.app.domains;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "categories")
public class CategoryDao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private String categoryName;
    private String iconName;

    @ManyToMany(mappedBy = "expenseCategories")
    private Set<ExpenseDao> expensesAssociated;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserDao user;
}
