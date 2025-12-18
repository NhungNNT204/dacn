package com.upnest.edu.modules.social.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * PostSave Entity - Lưu bài đăng để xem sau
 */
@Entity
@Table(name = "post_saves", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "post_id"})
}, indexes = {
    @Index(name = "idx_post_id", columnList = "post_id"),
    @Index(name = "idx_user_id", columnList = "user_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostSave {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnoreProperties("savedBy")
    private Post post;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @CreationTimestamp
    @Column(name = "saved_at", nullable = false, updatable = false)
    private LocalDateTime savedAt;
}
