package com.upnest.edu.modules.qa.message;

import lombok.*;

import java.time.LocalDateTime;

/**
 * WebSocket Message cho Q&A Realtime
 * Sử dụng để gửi updates qua WebSocket
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QAWebSocketMessage {
    
    /**
     * Loại sự kiện
     */
    private EventType eventType;
    
    /**
     * ID của entity liên quan
     */
    private Long entityId;
    
    /**
     * Dữ liệu payload (JSON object)
     */
    private Object payload;
    
    /**
     * User ID của người thực hiện action
     */
    private Long userId;
    
    /**
     * Username của người thực hiện action
     */
    private String username;
    
    /**
     * Thông báo (nếu có)
     */
    private String message;
    
    /**
     * Thời gian tạo event
     */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    
    /**
     * Các loại event trong Q&A
     */
    public enum EventType {
        // Question events
        QUESTION_CREATED,
        QUESTION_UPDATED,
        QUESTION_DELETED,
        QUESTION_CLOSED,
        QUESTION_REOPENED,
        
        // Answer events
        ANSWER_CREATED,
        ANSWER_UPDATED,
        ANSWER_DELETED,
        ANSWER_MARKED_BEST,
        ANSWER_UNMARKED_BEST,
        
        // Comment events
        COMMENT_CREATED,
        COMMENT_UPDATED,
        COMMENT_DELETED,
        
        // Vote events
        VOTE_ADDED,
        VOTE_REMOVED,
        VOTE_CHANGED,
        
        // Moderation events
        CONTENT_FLAGGED,
        CONTENT_APPROVED,
        CONTENT_REJECTED
    }
}

