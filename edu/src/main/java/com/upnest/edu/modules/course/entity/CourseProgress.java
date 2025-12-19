package com.upnest.edu.modules.course.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * CourseProgress - Tiến độ học tập của user trong khóa học
 */
@Entity
@Table(name = "course_progress", indexes = {
    @Index(name = "idx_enrollment_id", columnList = "enrollment_id"),
    @Index(name = "idx_user_course", columnList = "user_id, course_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "progress_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private CourseEnrollment enrollment;

    /**
     * Số bài học đã hoàn thành
     */
    @Column(name = "completed_lessons", nullable = false)
    @Builder.Default
    private Integer completedLessons = 0;

    /**
     * Tỷ lệ hoàn thành (0-100)
     */
    @Column(name = "progress_percentage", nullable = false)
    @Builder.Default
    private Integer progressPercentage = 0;

    /**
     * Bài học hiện tại (lesson index)
     */
    @Column(name = "current_lesson_index")
    private Integer currentLessonIndex;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

