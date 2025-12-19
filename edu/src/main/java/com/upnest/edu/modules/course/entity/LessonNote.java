package com.upnest.edu.modules.course.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * LessonNote - Ghi chú của user trong bài học
 */
@Entity
@Table(name = "lesson_notes", indexes = {
    @Index(name = "idx_user_lesson", columnList = "user_id, lesson_id", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonNote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "note_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "lesson_id", nullable = false)
    private Long lessonId;

    /**
     * Nội dung ghi chú
     */
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

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

