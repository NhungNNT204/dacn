package com.upnest.edu.modules.qa.message;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO: QaMessage
 * Định nghĩa cấu trúc message cho WebSocket realtime Q&A
 * 
 * Các loại message:
 * - NEW_QUESTION: Có câu hỏi mới
 * - NEW_ANSWER: Có câu trả lời mới
 * - NEW_COMMENT: Có bình luận mới
 * - REACTION_UPDATED: Phản ứng được cập nhật
 * - BEST_ANSWER_SET: Đặt best answer
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QaMessage {
    
    /**
     * Loại message: NEW_QUESTION, NEW_ANSWER, NEW_COMMENT, REACTION_UPDATED, BEST_ANSWER_SET
     */
    @JsonProperty("messageType")
    private String messageType;
    
    /**
     * ID của question (nếu liên quan đến question)
     */
    @JsonProperty("questionId")
    private Long questionId;
    
    /**
     * ID của answer (nếu liên quan đến answer)
     */
    @JsonProperty("answerId")
    private Long answerId;
    
    /**
     * ID của comment (nếu liên quan đến comment)
     */
    @JsonProperty("commentId")
    private Long commentId;
    
    /**
     * ID user tạo action
     */
    @JsonProperty("userId")
    private Long userId;
    
    /**
     * Nội dung message (question title, answer content, comment, ...)
     */
    @JsonProperty("content")
    private String content;
    
    /**
     * Tiêu đề (nếu là question)
     */
    @JsonProperty("title")
    private String title;
    
    /**
     * Loại phản ứng (LIKE/DISLIKE) - nếu là REACTION_UPDATED
     */
    @JsonProperty("reactionType")
    private String reactionType;
    
    /**
     * Số lượng like mới - nếu là REACTION_UPDATED
     */
    @JsonProperty("likeCount")
    private Integer likeCount;
    
    /**
     * Timestamp khi message được tạo
     */
    @JsonProperty("timestamp")
    private LocalDateTime timestamp = LocalDateTime.now();
    
    /**
     * ID khóa học (nếu câu hỏi liên quan đến khóa học)
     */
    @JsonProperty("courseId")
    private Long courseId;
}
