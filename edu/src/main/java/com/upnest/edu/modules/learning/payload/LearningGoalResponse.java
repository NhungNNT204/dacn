package com.upnest.edu.modules.learning.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningGoalResponse {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String successCriteria;
    private Integer feasibilityScore;
    private Integer relevanceScore;
    private LocalDate deadline;
    private String status;
    private Integer progress;
    private Long trackId;
    private LocalDateTime createdAt;
}

