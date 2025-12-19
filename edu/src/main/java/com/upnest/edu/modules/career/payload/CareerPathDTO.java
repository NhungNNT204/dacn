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
public class CareerPathDTO {
    private Long id;
    private String code;
    private String title;
    private String icon;
    private String color;
    private String description;
    private String marketDemand;
    private String avgSalary;
    private String difficulty;
    private Integer durationMonths;
    private String aiReason;
    private Integer matchPercentage; // AI tính toán độ phù hợp
    private List<RoadmapStepDTO> steps;
}

