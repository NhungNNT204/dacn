package com.upnest.edu.modules.course.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO {
    private Long id;
    private Long courseId;
    private Integer orderIndex;
    private String title;
    private String description;
    private String lessonType;
    private String videoUrl;
    private Integer durationSeconds;
    private String durationFormatted; // "12:45"
    private String content;
    private String status;
    private Boolean isCompleted;
    private Integer progressPercentage;
    private LocalDateTime createdAt;
}

