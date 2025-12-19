package com.upnest.edu.modules.learning.payload;

import com.upnest.edu.modules.learning.entity.RoadmapStep;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho RoadmapStep để trả về cho Frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapStepDTO {
    private Long id;
    private Integer orderIndex;
    private String title;
    private String description;
    private Integer durationWeeks;
    private String difficulty;
    private Integer rewardXp;
    private String icon;
    private String status; // "completed", "active", "locked"
    private Integer progress; // 0-100

    public static RoadmapStepDTO fromEntity(RoadmapStep step, String status, Integer progress) {
        return RoadmapStepDTO.builder()
                .id(step.getId())
                .orderIndex(step.getOrderIndex())
                .title(step.getTitle())
                .description(step.getDescription())
                .durationWeeks(step.getDurationWeeks())
                .difficulty(step.getDifficulty().name())
                .rewardXp(step.getRewardXp())
                .icon(step.getIcon())
                .status(status)
                .progress(progress)
                .build();
    }
}

