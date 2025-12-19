package com.upnest.edu.modules.learning.repository;

import com.upnest.edu.modules.learning.entity.SkillsAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SkillsAuditRepository extends JpaRepository<SkillsAudit, Long> {
    Optional<SkillsAudit> findByUserId(Long userId);
}

