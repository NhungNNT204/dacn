package com.upnest.edu.modules.learning.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * CareerTrack - Định hướng nghề nghiệp (Template cho lộ trình học tập)
 * Mỗi CareerTrack chứa các RoadmapStep mặc định
 */
@Entity
@Table(name = "career_tracks", indexes = {
    @Index(name = "idx_track_code", columnList = "code", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerTrack {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "track_id")
    private Long id;

    /**
     * Mã định danh duy nhất (ví dụ: "fullstack-java", "ai-data-science")
     */
    @Column(name = "code", nullable = false, unique = true, length = 100)
    private String code;

    /**
     * Tên định hướng nghề nghiệp
     */
    @Column(name = "name", nullable = false, length = 200)
    private String name;

    /**
     * Mô tả ngắn gọn về định hướng
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Icon name (để frontend render)
     */
    @Column(name = "icon", length = 50)
    private String icon;

    /**
     * Màu sắc chủ đạo (hex code)
     */
    @Column(name = "color", length = 20)
    private String color;

    /**
     * Các bước học tập trong track này
     */
    @OneToMany(mappedBy = "careerTrack", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private List<RoadmapStep> steps = new ArrayList<>();

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

