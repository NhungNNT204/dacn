package com.upnest.edu.modules.career.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * UserCareerPath - Lộ trình nghề nghiệp mà user đã chọn
 */
@Entity
@Table(name = "user_career_paths", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCareerPath {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_career_path_id")
    private Long id;

    /**
     * User sở hữu lộ trình này
     */
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    /**
     * CareerPath đã chọn
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_path_id", nullable = false)
    private CareerPath careerPath;

    /**
     * Bước hiện tại đang học (orderIndex)
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
     * Tổng tiến độ lộ trình (0-100)
     */
    @Column(name = "overall_progress", nullable = false)
    @Builder.Default
    private Integer overallProgress = 0;

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

