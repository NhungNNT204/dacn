package com.upnest.edu.modules.social.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PostReaction Entity - Đại diện cho các reaction (Like, Love, Haha, Wow, Sad, Angry)
 */
@Entity
@Table(name = "post_reactions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "post_id"})
}, indexes = {
    @Index(name = "idx_post_id", columnList = "post_id"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_reaction_type", columnList = "reaction_type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostReaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnoreProperties("reactions")
    private Post post;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "user_name")
    private String userName;
    
    @Column(name = "user_avatar")
    private String userAvatar;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "reaction_type")
    private ReactionType reactionType; // LIKE, LOVE, HAHA, WOW, SAD, ANGRY
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
