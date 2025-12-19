package com.upnest.edu.modules.learning.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * RoadmapStep - Chặng học tập trong một CareerTrack
 * Đây là template, mỗi User sẽ có LearningRoadmap riêng dựa trên các steps này
 */
@Entity
@Table(name = "roadmap_steps", indexes = {
    @Index(name = "idx_track_id", columnList = "track_id"),
    @Index(name = "idx_order_index", columnList = "track_id, order_index")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapStep {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "step_id")
    private Long id;

    /**
     * CareerTrack mà step này thuộc về
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private CareerTrack careerTrack;

    /**
     * Thứ tự trong track (1, 2, 3, ...)
     */
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    /**
     * Tiêu đề chặng học tập
     */
    @Column(name = "title", nullable = false, length = 300)
    private String title;

    /**
     * Mô tả chi tiết
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Thời gian dự kiến (tuần)
     */
    @Column(name = "duration_weeks", nullable = false)
    private Integer durationWeeks;

    /**
     * Độ khó: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
     */
    @Column(name = "difficulty", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;

    /**
     * Số XP thưởng khi hoàn thành
     */
    @Column(name = "reward_xp", nullable = false)
    private Integer rewardXp;

    /**
     * Icon name
     */
    @Column(name = "icon", length = 50)
    private String icon;

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

    /**
     * Enum cho độ khó
     */
    public enum DifficultyLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        EXPERT
    }
}

