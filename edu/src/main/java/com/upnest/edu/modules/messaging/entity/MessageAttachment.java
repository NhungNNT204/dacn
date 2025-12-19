package com.upnest.edu.modules.messaging.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * MessageAttachment - File đính kèm trong tin nhắn
 */
@Entity
@Table(name = "message_attachments", indexes = {
    @Index(name = "idx_message_id", columnList = "message_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageAttachment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attachment_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    /**
     * Tên file
     */
    @Column(name = "file_name", nullable = false, length = 500)
    private String fileName;

    /**
     * URL file
     */
    @Column(name = "file_url", nullable = false, length = 1000)
    private String fileUrl;

    /**
     * Loại file: PDF, IMAGE, VIDEO, AUDIO, OTHER
     */
    @Column(name = "file_type", length = 50)
    private String fileType;

    /**
     * Kích thước file (bytes)
     */
    @Column(name = "file_size")
    private Long fileSize;

    /**
     * MIME type
     */
    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

