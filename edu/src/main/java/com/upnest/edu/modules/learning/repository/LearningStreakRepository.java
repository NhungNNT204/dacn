package com.upnest.edu.modules.learning.repository;

import com.upnest.edu.modules.learning.entity.LearningStreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LearningStreakRepository extends JpaRepository<LearningStreak, Long> {
    
    /**
     * Tìm LearningStreak của một User
     */
    Optional<LearningStreak> findByUserId(Long userId);
    
    /**
     * Kiểm tra User đã có streak chưa
     */
    boolean existsByUserId(Long userId);
}

