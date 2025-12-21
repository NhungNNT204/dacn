package com.upnest.edu.modules.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity: UserProfile (Hồ sơ cá nhân)
 * Lưu trữ thông tin chi tiết hồ sơ của người dùng
 * 
 * Quan hệ: 1-1 với User
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_profiles", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id")
})
public class UserProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;
    
    /**
     * User (Foreign Key)
     */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    /**
     * Ảnh đại diện URL
     */
    @Column(name = "avatar_url", columnDefinition = "NVARCHAR(MAX)")
    private String avatarUrl;
    
    /**
     * Ngày sinh
     */
    @Column(name = "date_of_birth")
    private String dateOfBirth;
    
    /**
     * Giới tính: MALE, FEMALE, OTHER
     */
    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    /**
     * Địa chỉ
     */
    @Column(name = "address", length = 500)
    private String address;
    
    /**
     * Thành phố
     */
    @Column(name = "city", length = 100)
    private String city;
    
    /**
     * Quốc gia
     */
    @Column(name = "country", length = 100)
    private String country;
    
    /**
     * Cnhungên ngành / Lĩnh vực học
     */
    @Column(name = "specialization", length = 255)
    private String specialization;
    
    /**
     * Trường học / Công ty
     */
    @Column(name = "institution", length = 255)
    private String institution;
    
    /**
     * Năm học
     */
    @Column(name = "academic_year", length = 50)
    private String academicYear;
    
    /**
     * Mô tả cá nhân / Bio
     */
    @Column(name = "bio", columnDefinition = "NVARCHAR(MAX)")
    private String bio;
    
    /**
     * Website / Blog
     */
    @Column(name = "website", length = 500)
    private String website;
    
    /**
     * GitHub profile
     */
    @Column(name = "github_url", length = 500)
    private String githubUrl;
    
    /**
     * LinkedIn profile
     */
    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;
    
    /**
     * Thời gian tạo hồ sơ
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * Thời gian cập nhật
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
