package com.upnest.edu.modules.course.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Lesson - Bài học trong khóa học
 */
@Entity
@Table(name = "lessons", indexes = {
    @Index(name = "idx_course_id", columnList = "course_id"),
    @Index(name = "idx_order_index", columnList = "course_id, order_index")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lesson_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    /**
     * Thứ tự bài học trong khóa
     */
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Loại bài học: VIDEO, DOCUMENT, QUIZ, ASSIGNMENT
     */
    @Column(name = "lesson_type", nullable = false, length = 20)
    private String lessonType;

    /**
     * URL video (nếu là video lesson)
     */
    @Column(name = "video_url", length = 1000)
    private String videoUrl;

    /**
     * Độ dài video (giây)
     */
    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    /**
     * Nội dung bài học (HTML/text content)
     */
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    /**
     * Trạng thái: DRAFT, PUBLISHED
     */
    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LessonStatus status = LessonStatus.PUBLISHED;

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

    public enum LessonStatus {
        DRAFT,
        PUBLISHED
    }
}
