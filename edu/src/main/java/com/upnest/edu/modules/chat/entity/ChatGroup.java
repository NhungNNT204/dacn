package com.upnest.edu.modules.chat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * ChatGroup - Nhóm chat/cuộc hội thoại
 * Có thể là 1-1 hoặc group chat
 */
@Entity
@Table(name = "chat_groups", indexes = {
    @Index(name = "idx_created_at", columnList = "created_at DESC"),
    @Index(name = "idx_is_group", columnList = "is_group")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatGroup {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Thông tin cơ bản
    @Column(name = "name", length = 255)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;
    
    // Loại chat
    @Column(name = "is_group", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isGroup = false;
    
    // Cho group chat
    @Column(name = "group_owner_id")
    private Long groupOwnerId;
    
    @Column(name = "max_members", columnDefinition = "INT DEFAULT 100")
    private Integer maxMembers = 100;
    
    // Thành viên
    @OneToMany(mappedBy = "chatGroup", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ChatMember> members = new ArrayList<>();
    
    // Messages
    @OneToMany(mappedBy = "chatGroup", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Message> messages = new ArrayList<>();
    
    // Cài đặt
    @Column(name = "is_muted", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isMuted = false;
    
    @Column(name = "is_archived", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isArchived = false;
    
    @Column(name = "allow_members_invite", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean allowMembersInvite = true;
    
    @Column(name = "allow_members_edit_group", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean allowMembersEditGroup = false;
    
    // Thời gian
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;
    
    // Custom getters for compatibility
    public String getGroupName() {
        return this.name;
    }
    
    public List<ChatMember> getChatMembers() {
        return this.members;
    }
    
    public LocalDateTime getLastMessageAt() {
        if (messages == null || messages.isEmpty()) {
            return createdAt;
        }
        return messages.stream()
            .map(Message::getCreatedAt)
            .max(java.time.LocalDateTime::compareTo)
            .orElse(createdAt);
    }
    
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
