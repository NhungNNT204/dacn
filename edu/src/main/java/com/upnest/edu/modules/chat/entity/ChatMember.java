package com.upnest.edu.modules.chat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * ChatMember - Thành viên của nhóm chat
 */
@Entity
@Table(name = "chat_members", indexes = {
    @Index(name = "idx_chat_group_id", columnList = "chat_group_id"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_joined_at", columnList = "joined_at DESC")
}, uniqueConstraints = {
    @UniqueConstraint(columnNames = {"chat_group_id", "user_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMember {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_group_id", nullable = false)
    @JsonIgnore
    private ChatGroup chatGroup;
    
    @Column(name = "chat_group_id", nullable = false, insertable = false, updatable = false)
    private Long chatGroupId;
    
    // Thành viên
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "user_name", length = 255)
    private String userName;
    
    @Column(name = "user_avatar", columnDefinition = "TEXT")
    private String userAvatar;
    
    // Role
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private MemberRole role; // OWNER, ADMIN, MEMBER
    
    // Trạng thái
    @Column(name = "is_active", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isActive = true;
    
    @Column(name = "is_muted", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isMuted = false;
    
    @Column(name = "is_blocked", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isBlocked = false;
    
    // Thời gian
    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;
    
    @Column(name = "last_read_at")
    private LocalDateTime lastReadAt;
    
    @Column(name = "unread_count", columnDefinition = "INT DEFAULT 0")
    private Integer unreadCount = 0;
    
    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }
    
    public enum MemberRole {
        OWNER, ADMIN, MEMBER
    }
}
