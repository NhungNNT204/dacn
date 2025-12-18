package com.upnest.edu.modules.social.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Post Entity - Đại diện cho một bài đăng trên hệ thống
 * Hỗ trợ các loại bài: text, image, video, poll
 */
@Entity
@Table(name = "posts", indexes = {
    @Index(name = "idx_author_id", columnList = "author_id"),
    @Index(name = "idx_created_at", columnList = "created_at DESC"),
    @Index(name = "idx_is_deleted", columnList = "is_deleted")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long authorId;
    
    @Column(name = "author_name", nullable = false)
    private String authorName;
    
    @Column(name = "author_avatar")
    private String authorAvatar;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "author_type")
    private AuthorType authorType; // USER, PAGE, GROUP, COURSE
    
    @Column(columnDefinition = "LONGTEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    private PostType postType; // TEXT, IMAGE, VIDEO, POLL
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "video_url")
    private String videoUrl;
    
    @Column(name = "video_thumbnail")
    private String videoThumbnail;
    
    @Column(name = "like_count")
    private Integer likeCount = 0;
    
    @Column(name = "comment_count")
    private Integer commentCount = 0;
    
    @Column(name = "share_count")
    private Integer shareCount = 0;
    
    @Column(name = "view_count")
    private Integer viewCount = 0;
    
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;
    
    @Column(name = "is_hidden")
    private Boolean isHidden = false;
    
    @Column(name = "hidden_by_users", columnDefinition = "JSON")
    private String hiddenByUsers; // JSON array of user IDs who hid this post
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("post")
    private Set<PostReaction> reactions = new HashSet<>();
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("post")
    private Set<PostComment> comments = new HashSet<>();
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("post")
    private Set<PostReport> reports = new HashSet<>();
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("post")
    private Set<PostSave> savedBy = new HashSet<>();
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("post")
    private Set<PostShare> shares = new HashSet<>();
}
