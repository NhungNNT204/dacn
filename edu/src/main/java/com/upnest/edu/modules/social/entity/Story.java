package com.upnest.edu.modules.social.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Story - Tin trong ngày (24h)
 * Cấu trúc: ảnh/video, thời gian tạo, người xem, hết hạn
 */
@Entity
@Table(name = "stories", indexes = {
    @Index(name = "idx_user_profile_id", columnList = "user_profile_id"),
    @Index(name = "idx_created_at", columnList = "created_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Story {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false)
    @JsonIgnore
    private UserProfile userProfile;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "user_name", length = 255)
    private String userName;
    
    @Column(name = "user_avatar", columnDefinition = "TEXT")
    private String userAvatar;
    
    // Nội dung
    @Column(name = "media_url", columnDefinition = "TEXT", nullable = false)
    private String mediaUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "media_type")
    private MediaType mediaType; // IMAGE, VIDEO
    
    @Column(name = "caption", columnDefinition = "TEXT")
    private String caption;
    
    @Column(name = "duration")
    private Integer duration; // milliseconds
    
    // Trạng thái
    @Column(name = "is_deleted", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isDeleted = false;
    
    // Thống kê
    @Column(name = "views_count", columnDefinition = "INT DEFAULT 0")
    private Integer viewsCount = 0;
    
    // Thời gian sống 24h
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        // Story hết hạn sau 24h
        expiresAt = createdAt.plusHours(24);
    }
    
    public enum MediaType {
        IMAGE, VIDEO
    }
}
