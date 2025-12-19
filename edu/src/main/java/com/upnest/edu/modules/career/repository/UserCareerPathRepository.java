package com.upnest.edu.modules.career.repository;

import com.upnest.edu.modules.career.entity.UserCareerPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserCareerPathRepository extends JpaRepository<UserCareerPath, Long> {
    Optional<UserCareerPath> findByUserId(Long userId);
}

