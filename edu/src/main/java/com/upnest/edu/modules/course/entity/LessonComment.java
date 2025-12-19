package com.upnest.edu.modules.course.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * LessonComment - Bình luận/Thảo luận trong bài học
 */
@Entity
@Table(name = "lesson_comments", indexes = {
    @Index(name = "idx_lesson_id", columnList = "lesson_id"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_parent_id", columnList = "parent_id"),
    @Index(name = "idx_created_at", columnList = "created_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonComment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;

    @Column(name = "lesson_id", nullable = false)
    private Long lessonId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Parent comment ID (cho reply)
     */
    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * Số lượt like
     */
    @Column(name = "like_count", nullable = false)
    @Builder.Default
    private Integer likeCount = 0;

    /**
     * Trạng thái: ACTIVE, DELETED
     */
    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CommentStatus status = CommentStatus.ACTIVE;

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

    public enum CommentStatus {
        ACTIVE,
        DELETED
    }
}

