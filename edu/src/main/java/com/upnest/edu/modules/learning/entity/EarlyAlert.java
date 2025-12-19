package com.upnest.edu.modules.learning.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * EarlyAlert - Cảnh báo sớm khi sinh viên có dấu hiệu gặp khó khăn
 */
@Entity
@Table(name = "early_alerts", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EarlyAlert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alert_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Loại cảnh báo: PROGRESS_LAG, LOW_ENGAGEMENT, DIFFICULTY_SPIKE, MISSING_DEADLINE
     */
    @Column(name = "alert_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private AlertType alertType;

    /**
     * Mức độ nghiêm trọng: LOW, MEDIUM, HIGH, CRITICAL
     */
    @Column(name = "severity", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private AlertSeverity severity;

    /**
     * Tiêu đề cảnh báo
     */
    @Column(name = "title", nullable = false, length = 300)
    private String title;

    /**
     * Mô tả chi tiết
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Dữ liệu phân tích (JSON format)
     */
    @Column(name = "analytics_data", columnDefinition = "TEXT")
    private String analyticsData;

    /**
     * Giải pháp đề xuất
     */
    @Column(name = "suggested_action", columnDefinition = "TEXT")
    private String suggestedAction;

    /**
     * Trạng thái: ACTIVE, ACKNOWLEDGED, RESOLVED
     */
    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AlertStatus status = AlertStatus.ACTIVE;

    /**
     * ID của advisor được thông báo (nếu có)
     */
    @Column(name = "advisor_id")
    private Long advisorId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AlertType {
        PROGRESS_LAG,      // Chậm tiến độ
        LOW_ENGAGEMENT,    // Tương tác thấp
        DIFFICULTY_SPIKE, // Độ khó tăng đột ngột
        MISSING_DEADLINE,  // Bỏ lỡ deadline
        PREDICTED_FAILURE  // Dự đoán có thể thất bại
    }

    public enum AlertSeverity {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public enum AlertStatus {
        ACTIVE,
        ACKNOWLEDGED,
        RESOLVED
    }
}

