package com.upnest.edu.modules.social.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * PostShare Entity - Chia sẻ bài đăng
 */
@Entity
@Table(name = "post_shares", indexes = {
    @Index(name = "idx_post_id", columnList = "post_id"),
    @Index(name = "idx_user_id", columnList = "user_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostShare {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnoreProperties("shares")
    private Post post;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "user_name")
    private String userName;
    
    @Column(columnDefinition = "LONGTEXT")
    private String shareMessage;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "share_type")
    private ShareType shareType; // FEED, MESSAGE, GROUP
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
