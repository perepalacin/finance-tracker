package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.UserDao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserDao, UUID> {
    UserDao findByUsername(String username);
}
