package com.healthcare.HealthCareSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.healthcare.HealthCareSystem.model.Role;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
