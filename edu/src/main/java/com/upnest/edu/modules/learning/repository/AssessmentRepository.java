package com.upnest.edu.modules.learning.repository;

import com.upnest.edu.modules.learning.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Assessment> findByUserIdAndLearningGoalId(Long userId, Long goalId);
    List<Assessment> findByUserIdAndStatus(Long userId, Assessment.AssessmentStatus status);
}

