package com.upnest.edu.modules.qa.service;

import com.upnest.edu.modules.qa.entity.*;
import com.upnest.edu.modules.qa.message.QAWebSocketMessage;
import com.upnest.edu.modules.qa.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Service: VoteService
 * Xử lý business logic cho bình chọn
 * 
 * Chức năng:
 * - Upvote/Downvote cho Question và Answer
 * - Thay đổi vote
 * - Xóa vote
 * - Đếm điểm vote
 * - Gửi realtime updates qua WebSocket
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class VoteService {
    
    private final VoteRepository voteRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Vote cho Question
     * @param userId ID người vote
     * @param questionId ID câu hỏi
     * @param voteType Loại vote (UPVOTE/DOWNVOTE)
     * @return Vote score mới
     */
    public Long voteQuestion(Long userId, Long questionId, Vote.VoteType voteType) {
        log.info("User {} voting {} for question {}", userId, voteType, questionId);
        
        // Kiểm tra question tồn tại
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        // Tìm vote cũ (nếu có)
        Optional<Vote> existingVote = voteRepository.findByUserIdAndQuestionId(userId, questionId);
        
        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            
            // Nếu vote giống cũ → Xóa vote (toggle)
            if (vote.getVoteType() == voteType) {
                voteRepository.delete(vote);
                log.info("Vote removed for question {}", questionId);
                
                // Gửi WebSocket notification
                sendVoteUpdate(questionId, null, userId, QAWebSocketMessage.EventType.VOTE_REMOVED);
            } else {
                // Đổi vote
                vote.setVoteType(voteType);
                voteRepository.save(vote);
                log.info("Vote changed for question {}", questionId);
                
                // Gửi WebSocket notification
                sendVoteUpdate(questionId, null, userId, QAWebSocketMessage.EventType.VOTE_CHANGED);
            }
        } else {
            // Tạo vote mới
            Vote newVote = Vote.builder()
                    .userId(userId)
                    .questionId(questionId)
                    .voteType(voteType)
                    .build();
            voteRepository.save(newVote);
            log.info("New vote added for question {}", questionId);
            
            // Gửi WebSocket notification
            sendVoteUpdate(questionId, null, userId, QAWebSocketMessage.EventType.VOTE_ADDED);
        }
        
        // Cập nhật vote score
        Long voteScore = voteRepository.countVoteScoreByQuestionId(questionId);
        question.setLikeCount(voteScore.intValue());
        questionRepository.save(question);
        
        return voteScore;
    }
    
    /**
     * Vote cho Answer
     * @param userId ID người vote
     * @param answerId ID câu trả lời
     * @param voteType Loại vote (UPVOTE/DOWNVOTE)
     * @return Vote score mới
     */
    public Long voteAnswer(Long userId, Long answerId, Vote.VoteType voteType) {
        log.info("User {} voting {} for answer {}", userId, voteType, answerId);
        
        // Kiểm tra answer tồn tại
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        
        // Tìm vote cũ (nếu có)
        Optional<Vote> existingVote = voteRepository.findByUserIdAndAnswerId(userId, answerId);
        
        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            
            // Nếu vote giống cũ → Xóa vote (toggle)
            if (vote.getVoteType() == voteType) {
                voteRepository.delete(vote);
                log.info("Vote removed for answer {}", answerId);
                
                // Gửi WebSocket notification
                sendVoteUpdate(answer.getQuestion().getQuestionId(), answerId, userId, 
                              QAWebSocketMessage.EventType.VOTE_REMOVED);
            } else {
                // Đổi vote
                vote.setVoteType(voteType);
                voteRepository.save(vote);
                log.info("Vote changed for answer {}", answerId);
                
                // Gửi WebSocket notification
                sendVoteUpdate(answer.getQuestion().getQuestionId(), answerId, userId, 
                              QAWebSocketMessage.EventType.VOTE_CHANGED);
            }
        } else {
            // Tạo vote mới
            Vote newVote = Vote.builder()
                    .userId(userId)
                    .answerId(answerId)
                    .voteType(voteType)
                    .build();
            voteRepository.save(newVote);
            log.info("New vote added for answer {}", answerId);
            
            // Gửi WebSocket notification
            sendVoteUpdate(answer.getQuestion().getQuestionId(), answerId, userId, 
                          QAWebSocketMessage.EventType.VOTE_ADDED);
        }
        
        // Cập nhật vote score
        Long voteScore = voteRepository.countVoteScoreByAnswerId(answerId);
        answer.setLikeCount(voteScore.intValue());
        answerRepository.save(answer);
        
        return voteScore;
    }
    
    /**
     * Lấy vote score của question
     */
    public Long getQuestionVoteScore(Long questionId) {
        return voteRepository.countVoteScoreByQuestionId(questionId);
    }
    
    /**
     * Lấy vote score của answer
     */
    public Long getAnswerVoteScore(Long answerId) {
        return voteRepository.countVoteScoreByAnswerId(answerId);
    }
    
    /**
     * Kiểm tra user đã vote cho question chưa
     */
    public Optional<Vote.VoteType> getUserVoteOnQuestion(Long userId, Long questionId) {
        return voteRepository.findByUserIdAndQuestionId(userId, questionId)
                .map(Vote::getVoteType);
    }
    
    /**
     * Kiểm tra user đã vote cho answer chưa
     */
    public Optional<Vote.VoteType> getUserVoteOnAnswer(Long userId, Long answerId) {
        return voteRepository.findByUserIdAndAnswerId(userId, answerId)
                .map(Vote::getVoteType);
    }
    
    /**
     * Gửi vote update qua WebSocket
     */
    private void sendVoteUpdate(Long questionId, Long answerId, Long userId, 
                                QAWebSocketMessage.EventType eventType) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("questionId", questionId);
        payload.put("answerId", answerId);
        
        if (answerId != null) {
            payload.put("voteScore", voteRepository.countVoteScoreByAnswerId(answerId));
        } else {
            payload.put("voteScore", voteRepository.countVoteScoreByQuestionId(questionId));
        }
        
        QAWebSocketMessage message = QAWebSocketMessage.builder()
                .eventType(eventType)
                .entityId(answerId != null ? answerId : questionId)
                .payload(payload)
                .userId(userId)
                .build();
        
        // Gửi đến tất cả clients đang theo dõi question này
        messagingTemplate.convertAndSend("/topic/questions/" + questionId, message);
    }
}

