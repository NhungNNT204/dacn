package com.upnest.edu.modules.messaging.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Conversation - Cuộc trò cnhungện
 */
@Entity
@Table(name = "conversations", indexes = {
    @Index(name = "idx_type", columnList = "conversation_type"),
    @Index(name = "idx_updated_at", columnList = "updated_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conversation_id")
    private Long id;

    /**
     * Loại cuộc trò cnhungện: INDIVIDUAL, GROUP, AI
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "conversation_type", nullable = false)
    private ConversationType conversationType;

    /**
     * Tên cuộc trò cnhungện (cho group)
     */
    @Column(name = "name", length = 500)
    private String name;

    /**
     * Avatar URL
     */
    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    /**
     * Màu avatar
     */
    @Column(name = "avatar_color", length = 50)
    private String avatarColor;

    /**
     * Participants (JSON array hoặc separate table)
     */
    @Column(name = "participant_ids", columnDefinition = "TEXT")
    private String participantIds; // JSON array: [1, 2, 3]

    /**
     * Tin nhắn cuối cùng
     */
    @Column(name = "last_message", columnDefinition = "TEXT")
    private String lastMessage;

    /**
     * ID người gửi tin nhắn cuối
     */
    @Column(name = "last_message_sender_id")
    private Long lastMessageSenderId;

    /**
     * Thời gian tin nhắn cuối
     */
    @Column(name = "last_message_time")
    private LocalDateTime lastMessageTime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Message> messages = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ConversationType {
        INDIVIDUAL,
        GROUP,
        AI
    }
}

