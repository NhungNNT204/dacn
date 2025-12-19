package com.upnest.edu.modules.career.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * CareerPath - Định hướng nghề nghiệp (BA, UI/UX, Data Analyst...)
 */
@Entity
@Table(name = "career_paths", indexes = {
    @Index(name = "idx_code", columnList = "code", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerPath {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "career_path_id")
    private Long id;

    /**
     * Mã định danh (ba, uiux, da...)
     */
    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    /**
     * Tên nghề nghiệp
     */
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    /**
     * Icon name (BarChart3, PenTool, TrendingUp...)
     */
    @Column(name = "icon", length = 50)
    private String icon;

    /**
     * Màu sắc (indigo, rose, emerald...)
     */
    @Column(name = "color", length = 50)
    private String color;

    /**
     * Mô tả ngắn
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Nhu cầu thị trường
     */
    @Column(name = "market_demand", length = 100)
    private String marketDemand;

    /**
     * Mức lương trung bình
     */
    @Column(name = "avg_salary", length = 100)
    private String avgSalary;

    /**
     * Độ khó (EASY, MODERATE, HARD)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", length = 20)
    private DifficultyLevel difficulty;

    /**
     * Thời gian học ước tính (tháng)
     */
    @Column(name = "duration_months")
    private Integer durationMonths;

    /**
     * Lý do AI recommend
     */
    @Column(name = "ai_reason", columnDefinition = "TEXT")
    private String aiReason;

    /**
     * Các bước trong lộ trình
     */
    @OneToMany(mappedBy = "careerPath", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RoadmapStep> steps;

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

    public enum DifficultyLevel {
        EASY, MODERATE, HARD
    }
}

