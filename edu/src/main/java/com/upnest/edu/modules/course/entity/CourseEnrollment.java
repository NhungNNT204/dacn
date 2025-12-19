package com.upnest.edu.modules.course.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * CourseEnrollment - Đăng ký khóa học của user
 */
@Entity
@Table(name = "course_enrollments", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_course_id", columnList = "course_id"),
    @Index(name = "idx_user_course", columnList = "user_id, course_id", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseEnrollment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enrollment_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    /**
     * Trạng thái: ENROLLED, IN_PROGRESS, COMPLETED, DROPPED
     */
    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EnrollmentStatus status = EnrollmentStatus.ENROLLED;

    /**
     * Yêu thích
     */
    @Column(name = "is_favorite", nullable = false)
    @Builder.Default
    private Boolean isFavorite = false;

    @Column(name = "enrolled_at", nullable = false, updatable = false)
    private LocalDateTime enrolledAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        enrolledAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum EnrollmentStatus {
        ENROLLED,
        IN_PROGRESS,
        COMPLETED,
        DROPPED
    }
}

