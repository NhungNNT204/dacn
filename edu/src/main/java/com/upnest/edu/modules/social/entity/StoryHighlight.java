package com.upnest.edu.modules.social.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * StoryHighlight - Highlight của stories (lưu trữ lâu dài)
 * Hiển thị trong profile người dùng
 */
@Entity
@Table(name = "story_highlights", indexes = {
    @Index(name = "idx_user_profile_id", columnList = "user_profile_id"),
    @Index(name = "idx_created_at", columnList = "created_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoryHighlight {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false)
    @JsonIgnore
    private UserProfile userProfile;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    // Thông tin highlight
    @Column(name = "title", nullable = false, length = 100)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    private String thumbnailUrl;
    
    // Stories trong highlight
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "highlight_stories", joinColumns = @JoinColumn(name = "highlight_id"))
    @Column(name = "story_id")
    private List<Long> storyIds = new ArrayList<>();
    
    // Thống kê
    @Column(name = "views_count", columnDefinition = "INT DEFAULT 0")
    private Integer viewsCount = 0;
    
    // Thời gian
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
