package com.upnest.edu.modules.learning.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * LearningPlaylist - Danh sách phát học tập thích ứng
 */
@Entity
@Table(name = "learning_playlists", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_goal_id", columnList = "goal_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningPlaylist {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playlist_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Learning Goal mà playlist này phục vụ
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false)
    private LearningGoal learningGoal;

    /**
     * Tiêu đề playlist
     */
    @Column(name = "title", nullable = false, length = 300)
    private String title;

    /**
     * Thứ tự hiện tại trong playlist (index của item đang học)
     */
    @Column(name = "current_index", nullable = false)
    @Builder.Default
    private Integer currentIndex = 0;

    /**
     * Các items trong playlist (JSON format)
     * Mỗi item có: type (video/reading/project/discussion), contentId, order, completed
     */
    @Column(name = "items", columnDefinition = "TEXT")
    private String items; // JSON array string

    /**
     * Độ khó hiện tại (được điều chỉnh dựa trên performance)
     */
    @Column(name = "current_difficulty", length = 20)
    @Enumerated(EnumType.STRING)
    private DifficultyLevel currentDifficulty;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentIndex == null) currentIndex = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum DifficultyLevel {
        EASY,
        MEDIUM,
        HARD,
        EXPERT
    }
}

