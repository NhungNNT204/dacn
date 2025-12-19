package com.upnest.edu.modules.learning.repository;

import com.upnest.edu.modules.learning.entity.LearningRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LearningRoadmapRepository extends JpaRepository<LearningRoadmap, Long> {
    
    /**
     * Tìm LearningRoadmap của một User
     */
    Optional<LearningRoadmap> findByUserId(Long userId);
    
    /**
     * Kiểm tra User đã có roadmap chưa
     */
    boolean existsByUserId(Long userId);
    
    /**
     * Lấy roadmap với career track được load
     */
    @Query("SELECT r FROM LearningRoadmap r LEFT JOIN FETCH r.careerTrack WHERE r.userId = :userId")
    Optional<LearningRoadmap> findByUserIdWithTrack(@Param("userId") Long userId);
}

