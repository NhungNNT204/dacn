package com.upnest.edu.modules.chat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Message - Tin nhắn trong cuộc hội thoại
 * Hỗ trợ: text, ảnh, video, emoji, mentions
 */
@Entity(name = "ChatMessage")
@Table(name = "messages", indexes = {
    @Index(name = "idx_chat_group_id", columnList = "chat_group_id"),
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
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_group_id", nullable = false)
    @JsonIgnore
    private ChatGroup chatGroup;
    
    @Column(name = "chat_group_id", nullable = false, insertable = false, updatable = false)
    private Long chatGroupId;
    
    // Người gửi
    @Column(name = "sender_id", nullable = false)
    private Long senderId;
    
    @Column(name = "sender_name", length = 255)
    private String senderName;
    
    @Column(name = "sender_avatar", columnDefinition = "TEXT")
    private String senderAvatar;
    
    // Nội dung
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "message_type")
    private MessageType messageType; // TEXT, IMAGE, VIDEO, AUDIO, EMOJI
    
    // Media URL (nếu là hình/video)
    @Column(name = "media_url", columnDefinition = "TEXT")
    private String mediaUrl;
    
    @Column(name = "media_type", length = 50)
    private String mediaType; // image/jpeg, video/mp4, etc.
    
    @Column(name = "media_size")
    private Long mediaSize;
    
    // Emoji reactions
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "message_reactions", joinColumns = @JoinColumn(name = "message_id"))
    @MapKeyColumn(name = "emoji")
    @Column(name = "count")
    private Map<String, Integer> reactions = new HashMap<>();
    
    // Mentions (@username)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "message_mentions", joinColumns = @JoinColumn(name = "message_id"))
    @Column(name = "user_id")
    private List<Long> mentions = new ArrayList<>();
    
    // Trạng thái
    @Column(name = "is_edited", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isEdited = false;
    
    @Column(name = "is_deleted", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isDeleted = false;
    
    @Column(name = "is_pinned", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isPinned = false;
    
    // Thời gian
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "edited_at")
    private LocalDateTime editedAt;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    // Replies (trả lời tin nhắn)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to_id")
    @JsonIgnore
    private Message replyTo;
    
    @Column(name = "reply_to_id", insertable = false, updatable = false)
    private Long replyToId;
    
    @OneToMany(mappedBy = "replyTo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Message> replies = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum MessageType {
        TEXT, IMAGE, VIDEO, AUDIO, EMOJI, FILE
    }
}
