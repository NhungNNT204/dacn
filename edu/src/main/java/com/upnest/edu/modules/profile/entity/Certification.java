package com.upnest.edu.modules.profile.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Certification - Chứng chỉ/chứng nhận
 */
@Entity
@Table(name = "certifications", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_issue_date", columnList = "issue_date DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certification_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Tên tổ chức cấp
     */
    @Column(name = "issuer", nullable = false, length = 500)
    private String issuer;

    /**
     * Tên chứng chỉ
     */
    @Column(name = "name", nullable = false, length = 500)
    private String name;

    /**
     * Mô tả
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Ngày cấp
     */
    @Column(name = "issue_date")
    private LocalDate issueDate;

    /**
     * Ngày hết hạn (null nếu không hết hạn)
     */
    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    /**
     * Xếp loại (Xuất sắc, Giỏi, Khá...)
     */
    @Column(name = "grade", length = 100)
    private String grade;

    /**
     * Điểm số/GPA
     */
    @Column(name = "score", length = 50)
    private String score; // "9.5/10", "3.7/4.0"

    /**
     * URL chứng chỉ
     */
    @Column(name = "certificate_url", length = 1000)
    private String certificateUrl;

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

