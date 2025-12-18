package com.upnest.edu.modules.chat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * CallRecord - Lịch sử cuộc gọi thoại/video
 */
@Entity
@Table(name = "call_records", indexes = {
    @Index(name = "idx_chat_group_id", columnList = "chat_group_id"),
    @Index(name = "idx_caller_id", columnList = "caller_id"),
    @Index(name = "idx_created_at", columnList = "created_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CallRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_group_id", nullable = false)
    @JsonIgnore
    private ChatGroup chatGroup;
    
    @Column(name = "chat_group_id", nullable = false, insertable = false, updatable = false)
    private Long chatGroupId;
    
    // Người gọi
    @Column(name = "caller_id", nullable = false)
    private Long callerId;
    
    @Column(name = "caller_name", length = 255)
    private String callerName;
    
    // Loại gọi
    @Enumerated(EnumType.STRING)
    @Column(name = "call_type")
    private CallType callType; // VOICE, VIDEO, GROUP
    
    // Trạng thái
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CallStatus status; // INITIATED, RINGING, ACCEPTED, REJECTED, ENDED, MISSED
    
    // Người trả lời (nếu là 1-1)
    @Column(name = "receiver_id")
    private Long receiverId;
    
    @Column(name = "receiver_name", length = 255)
    private String receiverName;
    
    // Thời lượng
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "ended_at")
    private LocalDateTime endedAt;
    
    @Column(name = "duration_seconds")
    private Long durationSeconds; // Tính bằng giây
    
    // Thông tin
    @Column(name = "message_id")
    private Long messageId; // Link đến tin nhắn ghi lại cuộc gọi
    
    @Column(name = "is_missed", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isMissed = false;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Custom getter for compatibility
    public CallStatus getCallStatus() {
        return this.status;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum CallType {
        VOICE, VIDEO, GROUP
    }
    
    public enum CallStatus {
        INITIATED, RINGING, ACCEPTED, REJECTED, ENDED, MISSED
    }
}
