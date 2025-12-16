package com.upnest.edu.modules.qa.controller;

import com.upnest.edu.modules.qa.message.QaMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

/**
 * Controller: WebSocketQaController
 * Xử lý WebSocket messages cho Q&A realtime
 * 
 * Message mapping:
 * - /app/qa/join/{questionId} - User subscribe để nhận updates cho câu hỏi
 * - /app/qa/question/{questionId}/new-answer - Khi có câu trả lời mới
 * - /app/qa/answer/{answerId}/new-comment - Khi có bình luận mới
 * - /app/qa/answer/{answerId}/react - Khi có phản ứng mới
 */

@Slf4j
@Controller
@lombok.RequiredArgsConstructor
public class WebSocketQaController {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * User subscribe vào channel của một câu hỏi
     * Client gửi: /app/qa/join/123
     * Server broadcast: /topic/qa/question/123
     */
    @MessageMapping("/qa/join/{questionId}")
    public void joinQuestion(
            @DestinationVariable Long questionId,
            @Payload String message) {
        
        log.info("User joined question channel: {}", questionId);
        
        QaMessage msg = QaMessage.builder()
                .messageType("USER_JOINED")
                .questionId(questionId)
                .content("User joined the question")
                .timestamp(LocalDateTime.now())
                .build();
        
        // Broadcast tới tất cả user subscribe /topic/qa/question/{questionId}
        messagingTemplate.convertAndSend("/topic/qa/question/" + questionId, msg);
    }
    
    /**
     * Broadcast khi có câu trả lời mới
     * Client gửi: /app/qa/question/{questionId}/new-answer
     * Server broadcast: /topic/qa/question/{questionId}
     */
    @MessageMapping("/qa/question/{questionId}/new-answer")
    public void notifyNewAnswer(
            @DestinationVariable Long questionId,
            @Payload QaMessage message) {
        
        log.info("New answer for question {}: {}", questionId, message.getAnswerId());
        
        message.setMessageType("NEW_ANSWER");
        message.setQuestionId(questionId);
        message.setTimestamp(LocalDateTime.now());
        
        // Broadcast tới tất cả user subscribe câu hỏi này
        messagingTemplate.convertAndSend("/topic/qa/question/" + questionId, message);
    }
    
    /**
     * Broadcast khi có bình luận mới trên câu trả lời
     * Client gửi: /app/qa/answer/{answerId}/new-comment
     * Server broadcast: /topic/qa/answer/{answerId}
     */
    @MessageMapping("/qa/answer/{answerId}/new-comment")
    public void notifyNewComment(
            @DestinationVariable Long answerId,
            @Payload QaMessage message) {
        
        log.info("New comment on answer {}: {}", answerId, message.getCommentId());
        
        message.setMessageType("NEW_COMMENT");
        message.setAnswerId(answerId);
        message.setTimestamp(LocalDateTime.now());
        
        // Broadcast tới tất cả user theo dõi câu trả lời này
        messagingTemplate.convertAndSend("/topic/qa/answer/" + answerId, message);
    }
    
    /**
     * Broadcast khi có phản ứng (Like/Dislike) mới
     * Client gửi: /app/qa/answer/{answerId}/react
     * Server broadcast: /topic/qa/answer/{answerId}
     */
    @MessageMapping("/qa/answer/{answerId}/react")
    public void notifyReaction(
            @DestinationVariable Long answerId,
            @Payload QaMessage message) {
        
        log.info("Reaction on answer {}: {}", answerId, message.getReactionType());
        
        message.setMessageType("REACTION_UPDATED");
        message.setAnswerId(answerId);
        message.setTimestamp(LocalDateTime.now());
        
        // Broadcast tới tất cả user theo dõi
        messagingTemplate.convertAndSend("/topic/qa/answer/" + answerId, message);
    }
    
    /**
     * Broadcast khi question được đánh dấu Best Answer
     * Client gửi: /app/qa/question/{questionId}/best-answer
     * Server broadcast: /topic/qa/question/{questionId}
     */
    @MessageMapping("/qa/question/{questionId}/best-answer")
    public void notifyBestAnswerSet(
            @DestinationVariable Long questionId,
            @Payload QaMessage message) {
        
        log.info("Best answer set for question {}: {}", questionId, message.getAnswerId());
        
        message.setMessageType("BEST_ANSWER_SET");
        message.setQuestionId(questionId);
        message.setTimestamp(LocalDateTime.now());
        
        // Broadcast tới tất cả user theo dõi câu hỏi
        messagingTemplate.convertAndSend("/topic/qa/question/" + questionId, message);
    }
    
    /**
     * Broadcast khi có câu hỏi mới trong khóa học
     * Client gửi: /app/qa/course/{courseId}/new-question
     * Server broadcast: /topic/qa/course/{courseId}
     */
    @MessageMapping("/qa/course/{courseId}/new-question")
    public void notifyNewQuestion(
            @DestinationVariable Long courseId,
            @Payload QaMessage message) {
        
        log.info("New question in course {}: {}", courseId, message.getQuestionId());
        
        message.setMessageType("NEW_QUESTION");
        message.setCourseId(courseId);
        message.setTimestamp(LocalDateTime.now());
        
        // Broadcast tới tất cả user của khóa học
        messagingTemplate.convertAndSend("/topic/qa/course/" + courseId, message);
    }
}
