package com.upnest.edu.modules.qa.service;

import com.upnest.edu.modules.qa.entity.*;
import com.upnest.edu.modules.qa.payload.*;
import com.upnest.edu.modules.qa.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service: ReactionService
 * Xử lý business logic liên quan đến Reactions (Like/Dislike) trên Question/Answer
 * 
 * Các chức năng chính:
 * - Tạo/cập nhật phản ứng
 * - Xóa phản ứng
 * - Đếm phản ứng
 */

@Slf4j
@Service
@Transactional
@lombok.RequiredArgsConstructor
public class ReactionService {
    
    private final QuestionReactionRepository questionReactionRepository;
    private final AnswerReactionRepository answerReactionRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    
    // ===== QUESTION REACTIONS =====
    
    /**
     * Tạo hoặc cập nhật phản ứng trên câu hỏi
     * @param questionId ID câu hỏi
     * @param userId ID user phản ứng
     * @param request Loại phản ứng (LIKE/DISLIKE)
     * @return ReactionResponse
     */
    public ReactionResponse reactToQuestion(Long questionId, Long userId, ReactionRequest request) {
        log.info("User {} is reacting to question {} with type: {}", userId, questionId, request.getReactionType());
        
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        ReactionType reactionType = ReactionType.valueOf(request.getReactionType().toUpperCase());
        
        // Kiểm tra xem đã có reaction trước đó không
        Optional<QuestionReaction> existingReaction = questionReactionRepository
                .findByQuestionQuestionIdAndUserId(questionId, userId);
        
        QuestionReaction reaction;
        if (existingReaction.isPresent()) {
            // Cập nhật reaction cũ
            reaction = existingReaction.get();
            ReactionType oldType = reaction.getReactionType();
            
            // Cập nhật count nếu loại phản ứng thay đổi
            if (oldType == ReactionType.LIKE && reactionType == ReactionType.DISLIKE) {
                question.setLikeCount(Math.max(0, question.getLikeCount() - 1));
            } else if (oldType == ReactionType.DISLIKE && reactionType == ReactionType.LIKE) {
                question.setLikeCount(question.getLikeCount() + 1);
            }
            
            reaction.setReactionType(reactionType);
        } else {
            // Tạo reaction mới
            reaction = QuestionReaction.builder()
                    .reactionType(reactionType)
                    .userId(userId)
                    .question(question)
                    .createdAt(LocalDateTime.now())
                    .build();
            
            if (reactionType == ReactionType.LIKE) {
                question.setLikeCount(question.getLikeCount() + 1);
            }
        }
        
        QuestionReaction saved = questionReactionRepository.save(reaction);
        questionRepository.save(question);
        
        return mapQuestionReactionToResponse(saved);
    }
    
    /**
     * Xóa phản ứng trên câu hỏi
     * @param questionId ID câu hỏi
     * @param userId ID user
     */
    public void removeQuestionReaction(Long questionId, Long userId) {
        log.info("Removing reaction from question {} by user: {}", questionId, userId);
        
        Optional<QuestionReaction> reaction = questionReactionRepository
                .findByQuestionQuestionIdAndUserId(questionId, userId);
        
        if (reaction.isPresent()) {
            QuestionReaction r = reaction.get();
            Question question = r.getQuestion();
            
            if (r.getReactionType() == ReactionType.LIKE) {
                question.setLikeCount(Math.max(0, question.getLikeCount() - 1));
            }
            
            questionReactionRepository.delete(r);
            questionRepository.save(question);
        }
    }
    
    // ===== ANSWER REACTIONS =====
    
    /**
     * Tạo hoặc cập nhật phản ứng trên câu trả lời
     * @param answerId ID câu trả lời
     * @param userId ID user phản ứng
     * @param request Loại phản ứng (LIKE/DISLIKE)
     * @return ReactionResponse
     */
    public ReactionResponse reactToAnswer(Long answerId, Long userId, ReactionRequest request) {
        log.info("User {} is reacting to answer {} with type: {}", userId, answerId, request.getReactionType());
        
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        
        ReactionType reactionType = ReactionType.valueOf(request.getReactionType().toUpperCase());
        
        // Kiểm tra xem đã có reaction trước đó không
        Optional<AnswerReaction> existingReaction = answerReactionRepository
                .findByAnswerAnswerIdAndUserId(answerId, userId);
        
        AnswerReaction reaction;
        if (existingReaction.isPresent()) {
            // Cập nhật reaction cũ
            reaction = existingReaction.get();
            ReactionType oldType = reaction.getReactionType();
            
            // Cập nhật count nếu loại phản ứng thay đổi
            if (oldType == ReactionType.LIKE && reactionType == ReactionType.DISLIKE) {
                answer.setLikeCount(Math.max(0, answer.getLikeCount() - 1));
            } else if (oldType == ReactionType.DISLIKE && reactionType == ReactionType.LIKE) {
                answer.setLikeCount(answer.getLikeCount() + 1);
            }
            
            reaction.setReactionType(reactionType);
        } else {
            // Tạo reaction mới
            reaction = AnswerReaction.builder()
                    .reactionType(reactionType)
                    .userId(userId)
                    .answer(answer)
                    .createdAt(LocalDateTime.now())
                    .build();
            
            if (reactionType == ReactionType.LIKE) {
                answer.setLikeCount(answer.getLikeCount() + 1);
            }
        }
        
        AnswerReaction saved = answerReactionRepository.save(reaction);
        answerRepository.save(answer);
        
        return mapAnswerReactionToResponse(saved);
    }
    
    /**
     * Xóa phản ứng trên câu trả lời
     * @param answerId ID câu trả lời
     * @param userId ID user
     */
    public void removeAnswerReaction(Long answerId, Long userId) {
        log.info("Removing reaction from answer {} by user: {}", answerId, userId);
        
        Optional<AnswerReaction> reaction = answerReactionRepository
                .findByAnswerAnswerIdAndUserId(answerId, userId);
        
        if (reaction.isPresent()) {
            AnswerReaction r = reaction.get();
            Answer answer = r.getAnswer();
            
            if (r.getReactionType() == ReactionType.LIKE) {
                answer.setLikeCount(Math.max(0, answer.getLikeCount() - 1));
            }
            
            answerReactionRepository.delete(r);
            answerRepository.save(answer);
        }
    }
    
    // ===== CONVERTERS =====
    
    private ReactionResponse mapQuestionReactionToResponse(QuestionReaction reaction) {
        return ReactionResponse.builder()
                .reactionId(reaction.getReactionId())
                .reactionType(reaction.getReactionType().toString())
                .userId(reaction.getUserId())
                .createdAt(reaction.getCreatedAt())
                .build();
    }
    
    private ReactionResponse mapAnswerReactionToResponse(AnswerReaction reaction) {
        return ReactionResponse.builder()
                .reactionId(reaction.getReactionId())
                .reactionType(reaction.getReactionType().toString())
                .userId(reaction.getUserId())
                .createdAt(reaction.getCreatedAt())
                .build();
    }
}
