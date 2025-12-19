package com.upnest.edu.modules.course.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Course - Khóa học
 */
@Entity
@Table(name = "courses", indexes = {
    @Index(name = "idx_instructor_id", columnList = "instructor_id"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_created_at", columnList = "created_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long id;

    @Column(name = "title", nullable = false, length = 300)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Instructor ID
     */
    @Column(name = "instructor_id", nullable = false)
    private Long instructorId;

    /**
     * Tên giảng viên
     */
    @Column(name = "instructor_name", length = 200)
    private String instructorName;

    /**
     * Category: DESIGN, PROGRAMMING, BUSINESS, MARKETING, DATA, LANGUAGE, AI, etc.
     */
    @Column(name = "category", nullable = false, length = 50)
    private String category;

    /**
     * Thời lượng (phút)
     */
    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    /**
     * Số bài học
     */
    @Column(name = "total_lessons", nullable = false)
    @Builder.Default
    private Integer totalLessons = 0;

    /**
     * Đánh giá trung bình (0-5)
     */
    @Column(name = "rating", columnDefinition = "DECIMAL(3,2) DEFAULT 0.00")
    @Builder.Default
    private Double rating = 0.0;

    /**
     * Số lượt đánh giá
     */
    @Column(name = "rating_count", nullable = false)
    @Builder.Default
    private Integer ratingCount = 0;

    /**
     * URL ảnh thumbnail
     */
    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    /**
     * Trạng thái: DRAFT, PUBLISHED, ARCHIVED
     */
    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CourseStatus status = CourseStatus.PUBLISHED;

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

    public enum CourseStatus {
        DRAFT,
        PUBLISHED,
        ARCHIVED
    }
}
