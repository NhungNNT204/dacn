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
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private Long instructorId;
    private String instructorName;
    private String category;
    private Integer durationMinutes;
    private String durationFormatted; // "12 giờ 45 phút"
    private Integer totalLessons;
    private Double rating;
    private Integer ratingCount;
    private String thumbnailUrl;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

