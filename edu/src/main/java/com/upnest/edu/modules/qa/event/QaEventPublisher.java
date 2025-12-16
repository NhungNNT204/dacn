package com.upnest.edu.modules.qa.event;

import com.upnest.edu.modules.qa.message.QaMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

/**
 * Component: QaEventPublisher
 * Phát hành sự kiện realtime cho Q&A module
 * 
 * Được gọi từ Service layers để broadcast updates qua WebSocket
 */

@Slf4j
@Component
@lombok.RequiredArgsConstructor
public class QaEventPublisher {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Phát hành sự kiện: Câu hỏi mới được tạo
     * @param questionId ID câu hỏi
     * @param title Tiêu đề câu hỏi
     * @param userId ID user tạo
     * @param courseId ID khóa học (nếu có)
     */
    public void publishNewQuestion(Long questionId, String title, Long userId, Long courseId) {
        log.info("Publishing new question event: {}", questionId);
        
        QaMessage message = QaMessage.builder()
                .messageType("NEW_QUESTION")
                .questionId(questionId)
                .title(title)
                .userId(userId)
                .courseId(courseId)
                .timestamp(LocalDateTime.now())
                .build();
        
        if (courseId != null) {
            // Broadcast tới channel của khóa học
            messagingTemplate.convertAndSend("/topic/qa/course/" + courseId, message);
        }
        
        // Broadcast tới global channel
        messagingTemplate.convertAndSend("/topic/qa/questions/new", message);
    }
    
    /**
     * Phát hành sự kiện: Câu trả lời mới được tạo
     * @param questionId ID câu hỏi
     * @param answerId ID câu trả lời
     * @param content Nội dung câu trả lời
     * @param userId ID user trả lời
     */
    public void publishNewAnswer(Long questionId, Long answerId, String content, Long userId) {
        log.info("Publishing new answer event: {}", answerId);
        
        QaMessage message = QaMessage.builder()
                .messageType("NEW_ANSWER")
                .questionId(questionId)
                .answerId(answerId)
                .content(content)
                .userId(userId)
                .timestamp(LocalDateTime.now())
                .build();
        
        // Broadcast tới channel của question
        messagingTemplate.convertAndSend("/topic/qa/question/" + questionId, message);
    }
    
    /**
     * Phát hành sự kiện: Bình luận mới trên câu hỏi
     * @param questionId ID câu hỏi
     * @param commentId ID bình luận
     * @param content Nội dung bình luận
     * @param userId ID user bình luận
     */
    public void publishNewQuestionComment(Long questionId, Long commentId, String content, Long userId) {
        log.info("Publishing new question comment event: {}", commentId);
        
        QaMessage message = QaMessage.builder()
                .messageType("NEW_COMMENT")
                .questionId(questionId)
                .commentId(commentId)
                .content(content)
                .userId(userId)
                .timestamp(LocalDateTime.now())
                .build();
        
        // Broadcast tới channel của question
        messagingTemplate.convertAndSend("/topic/qa/question/" + questionId, message);
    }
    
    /**
     * Phát hành sự kiện: Bình luận mới trên câu trả lời
     * @param answerId ID câu trả lời
     * @param commentId ID bình luận
     * @param content Nội dung bình luận
     * @param userId ID user bình luận
     */
    public void publishNewAnswerComment(Long answerId, Long commentId, String content, Long userId) {
        log.info("Publishing new answer comment event: {}", commentId);
        
        QaMessage message = QaMessage.builder()
                .messageType("NEW_COMMENT")
                .answerId(answerId)
                .commentId(commentId)
                .content(content)
                .userId(userId)
                .timestamp(LocalDateTime.now())
                .build();
        
        // Broadcast tới channel của answer
        messagingTemplate.convertAndSend("/topic/qa/answer/" + answerId, message);
    }
    
    /**
     * Phát hành sự kiện: Phản ứng (Like/Dislike) trên câu trả lời
     * @param answerId ID câu trả lời
     * @param reactionType Loại phản ứng (LIKE/DISLIKE)
     * @param likeCount Số lượng like mới
     * @param userId ID user phản ứng
     */
    public void publishAnswerReaction(Long answerId, String reactionType, Integer likeCount, Long userId) {
        log.info("Publishing answer reaction event: {} - Type: {}", answerId, reactionType);
        
        QaMessage message = QaMessage.builder()
                .messageType("REACTION_UPDATED")
                .answerId(answerId)
                .reactionType(reactionType)
                .likeCount(likeCount)
                .userId(userId)
                .timestamp(LocalDateTime.now())
                .build();
        
        // Broadcast tới channel của answer
        messagingTemplate.convertAndSend("/topic/qa/answer/" + answerId, message);
    }
    
    /**
     * Phát hành sự kiện: Phản ứng (Like/Dislike) trên câu hỏi
     * @param questionId ID câu hỏi
     * @param reactionType Loại phản ứng (LIKE/DISLIKE)
     * @param likeCount Số lượng like mới
     * @param userId ID user phản ứng
     */
    public void publishQuestionReaction(Long questionId, String reactionType, Integer likeCount, Long userId) {
        log.info("Publishing question reaction event: {} - Type: {}", questionId, reactionType);
        
        QaMessage message = QaMessage.builder()
                .messageType("REACTION_UPDATED")
                .questionId(questionId)
                .reactionType(reactionType)
                .likeCount(likeCount)
                .userId(userId)
                .timestamp(LocalDateTime.now())
                .build();
        
        // Broadcast tới channel của question
        messagingTemplate.convertAndSend("/topic/qa/question/" + questionId, message);
    }
    
    /**
     * Phát hành sự kiện: Best Answer được đặt
     * @param questionId ID câu hỏi
     * @param answerId ID câu trả lời được chọn
     * @param userId ID user đặt best answer
     */
    public void publishBestAnswerSet(Long questionId, Long answerId, Long userId) {
        log.info("Publishing best answer set event: {} -> {}", questionId, answerId);
        
        QaMessage message = QaMessage.builder()
                .messageType("BEST_ANSWER_SET")
                .questionId(questionId)
                .answerId(answerId)
                .userId(userId)
                .timestamp(LocalDateTime.now())
                .build();
        
        // Broadcast tới channel của question
        messagingTemplate.convertAndSend("/topic/qa/question/" + questionId, message);
    }
}
