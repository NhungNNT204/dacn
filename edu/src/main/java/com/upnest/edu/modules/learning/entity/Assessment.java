package com.upnest.edu.modules.learning.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Assessment - Đánh giá tổng kết (Summative Assessment)
 */
@Entity
@Table(name = "assessments", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_goal_id", columnList = "goal_id"),
    @Index(name = "idx_type", columnList = "assessment_type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assessment_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Learning Goal mà assessment này đánh giá
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false)
    private LearningGoal learningGoal;

    /**
     * Loại đánh giá: CAPSTONE_PROJECT, FINAL_EXAM, PORTFOLIO_REVIEW
     */
    @Column(name = "assessment_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private AssessmentType assessmentType;

    /**
     * Tiêu đề
     */
    @Column(name = "title", nullable = false, length = 300)
    private String title;

    /**
     * Mô tả
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Điểm số (0-100)
     */
    @Column(name = "score")
    private Integer score;

    /**
     * Phản hồi chi tiết (JSON format)
     */
    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback; // JSON object với các competency scores

    /**
     * Đề xuất bước tiếp theo
     */
    @Column(name = "next_steps", columnDefinition = "TEXT")
    private String nextSteps; // JSON array string

    /**
     * Trạng thái: PENDING, IN_PROGRESS, COMPLETED
     */
    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AssessmentStatus status = AssessmentStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AssessmentType {
        CAPSTONE_PROJECT,  // Dự án tổng hợp
        FINAL_EXAM,        // Bài thi cuối kỳ
        PORTFOLIO_REVIEW,  // Đánh giá portfolio
        PEER_ASSESSMENT    // Đánh giá từ đồng nghiệp
    }

    public enum AssessmentStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED
    }
}

