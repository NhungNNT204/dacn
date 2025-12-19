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
public class RoadmapStepDTO {
    private Long id;
    private Integer orderIndex;
    private String title;
    private String description;
    private List<String> tasks;
    private Integer rewardXp;
    private String badge;
    private String icon;
    private String status; // completed, active, locked
}

