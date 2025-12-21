package com.upnest.edu.modules.career.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * RoadmapStep - Các chặng trong lộ trình nghề nghiệp
 */
@Entity(name = "CareerRoadmapStep")
@Table(name = "roadmap_steps", indexes = {
    @Index(name = "idx_career_path_order", columnList = "career_path_id, order_index")
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
     * CareerPath mà step này thuộc về
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_path_id", nullable = false)
    private CareerPath careerPath;

    /**
     * Thứ tự trong lộ trình
     */
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    /**
     * Tiêu đề chặng
     */
    @Column(name = "title", nullable = false, length = 300)
    private String title;

    /**
     * Mô tả
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Danh sách tasks (JSON array hoặc TEXT)
     */
    @Column(name = "tasks", columnDefinition = "TEXT")
    private String tasks; // JSON array: ["Task 1", "Task 2"]

    /**
     * XP thưởng khi hoàn thành
     */
    @Column(name = "reward_xp", nullable = false)
    private Integer rewardXp;

    /**
     * Badge/Tên cấp độ
     */
    @Column(name = "badge", length = 100)
    private String badge;

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
}

