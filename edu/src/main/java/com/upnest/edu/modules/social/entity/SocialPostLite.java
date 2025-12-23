package com.upnest.edu.modules.social.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Đơn giản hoá bài đăng với trường kỹ năng, huy hiệu và tagging.
 * Tách biệt với entity Post hiện có để tránh trùng lặp schema.
 */
@Entity
@Table(name = "social_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialPostLite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String authorName;
    private String authorAvatar;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String mediaUrl;
    private String mediaType; // IMAGE, VIDEO
    private String musicTitle;

    @ElementCollection
    @CollectionTable(name = "social_post_skills", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "skill")
    private List<String> skills;

    @ElementCollection
    @CollectionTable(name = "social_post_badges", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "badge")
    private List<String> badges;

    @ElementCollection
    @CollectionTable(name = "social_post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tagged_user_id")
    private List<Long> taggedUserIds;

    @Builder.Default
    @Column(name = "like_count")
    private int likeCount = 0;

    @Builder.Default
    @Column(name = "share_count")
    private int shareCount = 0;

    @Builder.Default
    @Column(name = "is_hidden")
    private boolean hidden = false;

    private Long originalPostId;

    @Builder.Default
    @Column(name = "is_deleted")
    private boolean deleted = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Transient
    private boolean liked;

    @Transient
    private boolean saved;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

