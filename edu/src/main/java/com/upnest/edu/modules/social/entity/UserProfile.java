package com.upnest.edu.modules.social.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * UserProfile - Thông tin hồ sơ cá nhân người dùng
 * Chứa: thông tin cá nhân, ảnh bìa, avatar, stories, bạn bè
 */
@Entity
@Table(name = "user_profiles", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_created_at", columnList = "created_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private Long userId;
    
    // Thông tin cơ bản
    @Column(name = "first_name", length = 100)
    private String firstName;
    
    @Column(name = "last_name", length = 100)
    private String lastName;
    
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;
    
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Column(name = "email", length = 255)
    private String email;
    
    @Column(name = "website", length = 255)
    private String website;
    
    @Column(name = "location", length = 255)
    private String location;
    
    @Column(name = "date_of_birth")
    private LocalDateTime dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;
    
    // Ảnh
    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;
    
    @Column(name = "cover_url", columnDefinition = "TEXT")
    private String coverUrl;
    
    // Thống kê
    @Column(name = "followers_count", columnDefinition = "INT DEFAULT 0")
    private Integer followersCount = 0;
    
    @Column(name = "following_count", columnDefinition = "INT DEFAULT 0")
    private Integer followingCount = 0;
    
    @Column(name = "posts_count", columnDefinition = "INT DEFAULT 0")
    private Integer postsCount = 0;
    
    @Column(name = "friends_count", columnDefinition = "INT DEFAULT 0")
    private Integer friendsCount = 0;
    
    // Trạng thái
    @Column(name = "is_verified", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isVerified = false;
    
    @Column(name = "is_private", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isPrivate = false;
    
    @Column(name = "is_active", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isActive = true;
    
    // Bộ sưu tập
    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<StoryHighlight> storyHighlights = new ArrayList<>();
    
    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<UserAvatar> avatars = new ArrayList<>();
    
    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<PrivacySettings> privacySettings = new ArrayList<>();
    
    // Thời gian
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum Gender {
        MALE, FEMALE, OTHER
    }
}
