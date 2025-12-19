package com.upnest.edu.modules.learning.repository;

import com.upnest.edu.modules.learning.entity.EarlyAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EarlyAlertRepository extends JpaRepository<EarlyAlert, Long> {
    List<EarlyAlert> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<EarlyAlert> findByUserIdAndStatus(Long userId, EarlyAlert.AlertStatus status);
    List<EarlyAlert> findByAdvisorIdAndStatus(Long advisorId, EarlyAlert.AlertStatus status);
}

