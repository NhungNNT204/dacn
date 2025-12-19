package com.upnest.edu.modules.learning.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * SkillsAudit - Đánh giá nền tảng và phân khúc người học
 */
@Entity
@Table(name = "skills_audits", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillsAudit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audit_id")
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    /**
     * Persona type: BEGINNER, INTERMEDIATE, ADVANCED
     */
    @Column(name = "persona_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private PersonaType personaType;

    /**
     * Điểm số đánh giá tổng thể (0-100)
     */
    @Column(name = "overall_score", nullable = false)
    @Builder.Default
    private Integer overallScore = 0;

    /**
     * Kết quả đánh giá từng kỹ năng (JSON format)
     * Ví dụ: {"Java": 75, "Spring Boot": 60, "React": 40}
     */
    @Column(name = "skill_scores", columnDefinition = "TEXT")
    private String skillScores; // JSON string

    /**
     * Điểm mạnh được xác định
     */
    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths; // JSON array string

    /**
     * Lỗ hổng kiến thức cần bổ sung
     */
    @Column(name = "knowledge_gaps", columnDefinition = "TEXT")
    private String knowledgeGaps; // JSON array string

    /**
     * Gợi ý lộ trình dựa trên audit
     */
    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations; // JSON array string

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

    public enum PersonaType {
        BEGINNER,      // Người mới bắt đầu
        INTERMEDIATE,  // Người đã có nền tảng
        ADVANCED       // Người học nâng cao
    }
}

