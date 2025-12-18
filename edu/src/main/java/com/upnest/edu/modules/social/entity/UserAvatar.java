package com.upnest.edu.modules.social.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * UserAvatar - Lịch sử ảnh đại diện
 * Lưu trữ các ảnh avatar cũ
 */
@Entity
@Table(name = "user_avatars", indexes = {
    @Index(name = "idx_user_profile_id", columnList = "user_profile_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAvatar {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false)
    @JsonIgnore
    private UserProfile userProfile;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    // Avatar URL
    @Column(name = "avatar_url", columnDefinition = "TEXT", nullable = false)
    private String avatarUrl;
    
    // Metadata
    @Column(name = "is_current", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isCurrent = false;
    
    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;
    
    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
