package com.upnest.edu.modules.profile.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * UserProfile - Hồ sơ người dùng mở rộng
 */
@Entity(name = "ProfileUserProfile")
@Table(name = "profile_user_profiles", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    /**
     * Ảnh đại diện
     */
    @Column(name = "avatar_url", length = 1000)
    private String avatarUrl;

    /**
     * Tiêu đề nghề nghiệp
     */
    @Column(name = "job_title", length = 200)
    private String jobTitle;

    /**
     * Giới thiệu bản thân
     */
    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    /**
     * Địa chỉ
     */
    @Column(name = "location", length = 500)
    private String location;

    /**
     * Số điện thoại
     */
    @Column(name = "phone", length = 50)
    private String phone;

    /**
     * GitHub URL
     */
    @Column(name = "github_url", length = 500)
    private String githubUrl;

    /**
     * LinkedIn URL
     */
    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;

    /**
     * Portfolio URL
     */
    @Column(name = "portfolio_url", length = 500)
    private String portfolioUrl;

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

