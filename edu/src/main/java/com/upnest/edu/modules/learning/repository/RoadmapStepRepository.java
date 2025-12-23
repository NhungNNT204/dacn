package com.upnest.edu.modules.learning.repository;

import com.upnest.edu.modules.learning.entity.RoadmapStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("learningRoadmapStepRepository")
public interface RoadmapStepRepository extends JpaRepository<RoadmapStep, Long> {
    
    /**
     * Lấy tất cả steps của một CareerTrack, sắp xếp theo orderIndex
     */
    @Query("SELECT s FROM LearningRoadmapStep s WHERE s.careerTrack.id = :trackId ORDER BY s.orderIndex ASC")
    List<RoadmapStep> findByTrackIdOrderByOrderIndex(@Param("trackId") Long trackId);
    
    /**
     * Lấy step theo trackId và orderIndex
     */
    @Query("SELECT s FROM LearningRoadmapStep s WHERE s.careerTrack.id = :trackId AND s.orderIndex = :orderIndex")
    Optional<RoadmapStep> findByTrackIdAndOrderIndex(@Param("trackId") Long trackId, @Param("orderIndex") Integer orderIndex);
}

