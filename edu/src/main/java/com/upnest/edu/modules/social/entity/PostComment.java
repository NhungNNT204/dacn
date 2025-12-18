package com.upnest.edu.modules.social.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * PostComment Entity - Đại diện cho bình luận trên bài đăng
 * Hỗ trợ bình luận lồng nhau (reply comments)
 */
@Entity
@Table(name = "post_comments", indexes = {
    @Index(name = "idx_post_id", columnList = "post_id"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_parent_comment_id", columnList = "parent_comment_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostComment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnoreProperties("comments")
    private Post post;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "user_name")
    private String userName;
    
    @Column(name = "user_avatar")
    private String userAvatar;
    
    @Column(columnDefinition = "LONGTEXT")
    private String content;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    @JsonIgnoreProperties("replies")
    private PostComment parentComment;
    
    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("parentComment")
    private Set<PostComment> replies = new HashSet<>();
    
    @Column(name = "like_count")
    private Integer likeCount = 0;
    
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
