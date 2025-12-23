package com.upnest.edu.modules.career.repository;

import com.upnest.edu.modules.career.entity.RoadmapStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository("careerRoadmapStepRepository")
public interface RoadmapStepRepository extends JpaRepository<RoadmapStep, Long> {
    List<RoadmapStep> findByCareerPathIdOrderByOrderIndexAsc(Long careerPathId);
}

