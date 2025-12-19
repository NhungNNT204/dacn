package com.upnest.edu.modules.learning.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * LearningRoadmap - Lộ trình học tập cá nhân hóa của từng User
 * Mỗi User có một LearningRoadmap gắn với một CareerTrack
 */
@Entity
@Table(name = "learning_roadmaps", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id", unique = true),
    @Index(name = "idx_track_id", columnList = "track_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningRoadmap {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roadmap_id")
    private Long id;

    /**
     * User sở hữu lộ trình này
     */
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    /**
     * CareerTrack đang theo đuổi
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private CareerTrack careerTrack;

    /**
     * Bước hiện tại đang học (orderIndex của RoadmapStep)
     */
    @Column(name = "current_step_index", nullable = false)
    @Builder.Default
    private Integer currentStepIndex = 0;

    /**
     * Tiến độ của bước hiện tại (0-100)
     */
    @Column(name = "current_progress", nullable = false)
    @Builder.Default
    private Integer currentProgress = 0;

    /**
     * Lời khuyên từ AI (JSON string hoặc TEXT)
     */
    @Column(name = "ai_insight", columnDefinition = "TEXT")
    private String aiInsight;

    /**
     * Mô tả về điểm mạnh của học viên
     */
    @Column(name = "strength_description", columnDefinition = "TEXT")
    private String strengthDescription;

    /**
     * Đề xuất từ AI
     */
    @Column(name = "recommendation", length = 200)
    private String recommendation;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentStepIndex == null) currentStepIndex = 0;
        if (currentProgress == null) currentProgress = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

