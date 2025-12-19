package com.upnest.edu.modules.course.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Response DTO cho "Khóa học của tôi"
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyCourseResponse {
    private Long enrollmentId;
    private CourseDTO course;
    private String status; // ENROLLED, IN_PROGRESS, COMPLETED
    private Boolean isFavorite;
    private Integer completedLessons;
    private Integer totalLessons;
    private Integer progressPercentage;
    private LocalDateTime enrolledAt;
    private LocalDateTime lastAccessedAt;
    private String lastAccessedFormatted; // "2 giờ trước", "3 ngày trước"
}

