package com.upnest.edu.modules.learning.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO cho Learning Roadmap
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningRoadmapResponse {
    private Long roadmapId;
    private String studentName;
    private String targetCareer;
    private String careerTrackCode;
    private Integer currentStepIndex;
    private Integer currentProgress;
    private AIInsightDTO aiInsight;
    private List<RoadmapStepDTO> milestones;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AIInsightDTO {
        private String testResult;
        private String score;
        private String recommendation;
        private String strength;
        private String suggestion;
    }
}

