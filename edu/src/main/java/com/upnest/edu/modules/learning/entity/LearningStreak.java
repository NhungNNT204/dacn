package com.upnest.edu.modules.learning.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * LearningStreak - Theo dõi chuỗi ngày học liên tiếp của User
 */
@Entity
@Table(name = "learning_streaks", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id", unique = true),
    @Index(name = "idx_last_activity_date", columnList = "last_activity_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningStreak {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "streak_id")
    private Long id;

    /**
     * User sở hữu streak này
     */
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    /**
     * Số ngày học liên tiếp hiện tại
     */
    @Column(name = "current_streak", nullable = false)
    @Builder.Default
    private Integer currentStreak = 0;

    /**
     * Số ngày học liên tiếp cao nhất từ trước đến nay
     */
    @Column(name = "longest_streak", nullable = false)
    @Builder.Default
    private Integer longestStreak = 0;

    /**
     * Ngày hoạt động học tập cuối cùng
     */
    @Column(name = "last_activity_date")
    private LocalDate lastActivityDate;

    /**
     * Tổng số ngày đã học (không nhất thiết liên tiếp)
     */
    @Column(name = "total_days", nullable = false)
    @Builder.Default
    private Integer totalDays = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentStreak == null) currentStreak = 0;
        if (longestStreak == null) longestStreak = 0;
        if (totalDays == null) totalDays = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

