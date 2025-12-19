package com.upnest.edu.modules.career.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerRoadmapResponse {
    private CareerPathDTO careerPath;
    private Integer overallProgress;
    private Integer currentStepIndex;
    private Integer currentProgress;
    private String aiAnalysis;
    private String aiRecommendation;
    private List<RoadmapStepDTO> steps;
}

