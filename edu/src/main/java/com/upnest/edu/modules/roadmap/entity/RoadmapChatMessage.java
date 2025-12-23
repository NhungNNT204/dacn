package com.upnest.edu.modules.roadmap.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * RoadmapChatMessage - Tin nhắn trong phòng thảo luận nhóm lộ trình
 */
@Entity
@Table(name = "roadmap_chat_messages", indexes = {
    @Index(name = "idx_chat_room_id", columnList = "chat_room_id"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "chat_room_id", nullable = false)
    private String chatRoomId; // UUID của phòng chat
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "user_name", nullable = false)
    private String userName;
    
    @Column(name = "user_avatar")
    private String userAvatar;
    
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Column(name = "message_type")
    @Enumerated(EnumType.STRING)
    private MessageType messageType = MessageType.TEXT; // TEXT, IMAGE, FILE, SYSTEM
    
    @Column(name = "attachment_url")
    private String attachmentUrl; // URL ảnh/file đính kèm
    
    @Column(name = "reply_to_message_id")
    private Long replyToMessageId; // ID tin nhắn được reply (nếu có)
    
    @Column(name = "is_pinned")
    private Boolean isPinned = false; // Tin nhắn được ghim (admin/mod)
    
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public enum MessageType {
        TEXT,           // Tin nhắn text thường
        IMAGE,          // Ảnh
        FILE,           // File (PDF, DOCX, ...)
        SYSTEM,         // Thông báo hệ thống (User joined, User left, ...)
        CODE_SNIPPET,   // Đoạn code (có syntax highlighting)
        POLL            // Bình chọn/survey
    }
}

