package com.upnest.edu.modules.learning.repository;

import com.upnest.edu.modules.learning.entity.LearningGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LearningGoalRepository extends JpaRepository<LearningGoal, Long> {
    List<LearningGoal> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<LearningGoal> findByUserIdAndStatus(Long userId, LearningGoal.GoalStatus status);
}

