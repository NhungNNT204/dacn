package com.upnest.edu.modules.social.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * PrivacySettings - Cài đặt quyền riêng tư cho posts
 * Điều chỉnh quyền xem posts
 */
@Entity
@Table(name = "privacy_settings", indexes = {
    @Index(name = "idx_user_profile_id", columnList = "user_profile_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrivacySettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false)
    @JsonIgnore
    private UserProfile userProfile;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    // Cái đặt thấy bài viết
    @Enumerated(EnumType.STRING)
    @Column(name = "post_visibility")
    private PostVisibility postVisibility; // PUBLIC, FRIENDS, PRIVATE
    
    // Cài đặt comment
    @Enumerated(EnumType.STRING)
    @Column(name = "comment_permission")
    private CommentPermission commentPermission; // EVERYONE, FRIENDS, NOBODY
    
    // Cài đặt reaction
    @Enumerated(EnumType.STRING)
    @Column(name = "reaction_permission")
    private ReactionPermission reactionPermission; // EVERYONE, FRIENDS, NOBODY
    
    // Cài đặt tag
    @Column(name = "allow_tag", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean allowTag = true;
    
    // Cài đặt thông báo
    @Column(name = "allow_notifications", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean allowNotifications = true;
    
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
    
    public enum PostVisibility {
        PUBLIC, FRIENDS, PRIVATE
    }
    
    public enum CommentPermission {
        EVERYONE, FRIENDS, NOBODY
    }
    
    public enum ReactionPermission {
        EVERYONE, FRIENDS, NOBODY
    }
}
