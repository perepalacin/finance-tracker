package com.pere_palacin.app.domains;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "income_sources")
public class IncomeSourceDao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String color;

    @ManyToOne
    @JoinColumn(name = "incomes", referencedColumnName = "id")
    private IncomeDao income;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserDao user;
}
