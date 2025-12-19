package com.upnest.edu.modules.learning.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * SocialTouchpoint - Điểm chạm xã hội trong lộ trình học tập
 */
@Entity
@Table(name = "social_touchpoints", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_playlist_id", columnList = "playlist_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialTouchpoint {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "touchpoint_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Playlist mà touchpoint này thuộc về
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_id")
    private LearningPlaylist playlist;

    /**
     * Loại tương tác: DISCUSSION_GROUP, PEER_REVIEW, MENTOR_MATCH, FORUM_QUESTION
     */
    @Column(name = "touchpoint_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private TouchpointType touchpointType;

    /**
     * Tiêu đề/tên của touchpoint
     */
    @Column(name = "title", nullable = false, length = 300)
    private String title;

    /**
     * Mô tả
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * ID của group/discussion/forum liên quan
     */
    @Column(name = "related_id")
    private Long relatedId;

    /**
     * Trạng thái: PENDING, ACTIVE, COMPLETED
     */
    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TouchpointStatus status = TouchpointStatus.PENDING;

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

    public enum TouchpointType {
        DISCUSSION_GROUP,    // Nhóm thảo luận
        PEER_REVIEW,         // Bình duyệt bài tập của bạn
        MENTOR_MATCH,        // Ghép cặp với mentor
        FORUM_QUESTION       // Đặt câu hỏi trong diễn đàn
    }

    public enum TouchpointStatus {
        PENDING,
        ACTIVE,
        COMPLETED
    }
}

