package com.upnest.edu.modules.learning.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * LearningGoal - Mục tiêu học tập SMART
 */
@Entity
@Table(name = "learning_goals", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningGoal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goal_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Tiêu đề mục tiêu (Specific)
     */
    @Column(name = "title", nullable = false, length = 500)
    private String title;

    /**
     * Mô tả chi tiết mục tiêu
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Tiêu chí đo lường (Measurable)
     */
    @Column(name = "success_criteria", columnDefinition = "TEXT")
    private String successCriteria;

    /**
     * Mức độ khả thi (Achievable) - Điểm từ 0-100
     */
    @Column(name = "feasibility_score")
    private Integer feasibilityScore;

    /**
     * Mức độ liên quan (Relevant) - Điểm từ 0-100
     */
    @Column(name = "relevance_score")
    private Integer relevanceScore;

    /**
     * Thời hạn hoàn thành (Time-bound)
     */
    @Column(name = "deadline", nullable = false)
    private LocalDate deadline;

    /**
     * Trạng thái: ACTIVE, COMPLETED, CANCELLED
     */
    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GoalStatus status = GoalStatus.ACTIVE;

    /**
     * Tiến độ hoàn thành (0-100)
     */
    @Column(name = "progress", nullable = false)
    @Builder.Default
    private Integer progress = 0;

    /**
     * Career track liên quan
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id")
    private CareerTrack careerTrack;

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

    public enum GoalStatus {
        ACTIVE,
        COMPLETED,
        CANCELLED
    }
}

