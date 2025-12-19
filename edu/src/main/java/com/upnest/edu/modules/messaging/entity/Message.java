package com.upnest.edu.modules.messaging.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Message - Tin nhắn trong cuộc trò chuyện
 */
@Entity
@Table(name = "messages", indexes = {
    @Index(name = "idx_conversation_id", columnList = "conversation_id"),
    @Index(name = "idx_sender_id", columnList = "sender_id"),
    @Index(name = "idx_created_at", columnList = "created_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "sender_name", length = 200)
    private String senderName;

    @Column(name = "sender_avatar", length = 500)
    private String senderAvatar;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    /**
     * Loại tin nhắn: TEXT, IMAGE, FILE, VIDEO, AUDIO
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false)
    @Builder.Default
    private MessageType messageType = MessageType.TEXT;

    /**
     * Trạng thái: SENT, DELIVERED, READ
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private MessageStatus status = MessageStatus.SENT;

    /**
     * Đã bị xóa
     */
    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<MessageAttachment> attachments = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum MessageType {
        TEXT,
        IMAGE,
        FILE,
        VIDEO,
        AUDIO
    }

    public enum MessageStatus {
        SENT,
        DELIVERED,
        READ
    }
}

