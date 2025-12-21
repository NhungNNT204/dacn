package com.upnest.edu.modules.messaging.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * ConversationParticipant - Thành viên trong cuộc trò cnhungện
 */
@Entity
@Table(name = "conversation_participants", indexes = {
    @Index(name = "idx_conversation_user", columnList = "conversation_id, user_id", unique = true),
    @Index(name = "idx_user_id", columnList = "user_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationParticipant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Số tin nhắn chưa đọc
     */
    @Column(name = "unread_count", nullable = false)
    @Builder.Default
    private Integer unreadCount = 0;

    /**
     * Đã tham gia
     */
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    /**
     * Thời gian đọc tin nhắn cuối
     */
    @Column(name = "last_read_at")
    private LocalDateTime lastReadAt;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
        lastReadAt = LocalDateTime.now();
    }
}

