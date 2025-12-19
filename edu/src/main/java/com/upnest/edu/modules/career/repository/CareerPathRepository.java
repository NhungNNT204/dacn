package com.upnest.edu.modules.career.repository;

import com.upnest.edu.modules.career.entity.CareerPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CareerPathRepository extends JpaRepository<CareerPath, Long> {
    Optional<CareerPath> findByCode(String code);
}

