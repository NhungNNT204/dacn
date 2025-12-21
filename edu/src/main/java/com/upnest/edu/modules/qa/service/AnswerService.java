package com.upnest.edu.modules.qa.service;

import com.upnest.edu.modules.qa.entity.*;
import com.upnest.edu.modules.qa.payload.*;
import com.upnest.edu.modules.qa.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service: AnswerService
 * Xử lý business logic liên quan đến Answer
 * 
 * Các chức năng chính:
 * - Tạo, cập nhật, xóa câu trả lời
 * - Quản lý like count
 * - Lấy câu trả lời theo câu hỏi
 */

@Slf4j
@Service
@Transactional
@lombok.RequiredArgsConstructor
public class AnswerService {
    
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final AnswerCommentRepository answerCommentRepository;
    private final AnswerReactionRepository answerReactionRepository;
    
    /**
     * Tạo câu trả lời mới
     * @param questionId ID câu hỏi
     * @param userId ID user tạo câu trả lời
     * @param request Nội dung câu trả lời
     * @return AnswerResponse
     */
    public AnswerResponse createAnswer(Long questionId, Long userId, AnswerRequest request) {
        log.info("Creating answer for question: {} by user: {}", questionId, userId);
        
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        Answer answer = Answer.builder()
                .content(request.getContent())
                .userId(userId)
                .question(question)
                .isBestAnswer(false)
                .likeCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Answer saved = answerRepository.save(answer);
        
        // Cập nhật status câu hỏi nếu chưa có câu trả lời
        if (question.getStatus() == QuestionStatus.OPEN) {
            question.setStatus(QuestionStatus.ANSWERED);
            questionRepository.save(question);
        }
        
        log.info("Answer created successfully with id: {}", saved.getAnswerId());
        return mapToResponse(saved);
    }
    
    /**
     * Cập nhật câu trả lời
     * @param answerId ID câu trả lời
     * @param userId ID user (kiểm tra quyền)
     * @param request Nội dung cập nhật
     * @return AnswerResponse
     */
    public AnswerResponse updateAnswer(Long answerId, Long userId, AnswerRequest request) {
        log.info("Updating answer: {} by user: {}", answerId, userId);
        
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        
        // Kiểm tra quyền
        if (!answer.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this answer");
        }
        
        answer.setContent(request.getContent());
        answer.setUpdatedAt(LocalDateTime.now());
        
        Answer updated = answerRepository.save(answer);
        return mapToResponse(updated);
    }
    
    /**
     * Lấy thông tin chi tiết câu trả lời
     * @param answerId ID câu trả lời
     * @return AnswerResponse
     */
    public AnswerResponse getAnswerDetail(Long answerId) {
        log.info("Getting answer detail: {}", answerId);
        
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        
        return mapToResponse(answer);
    }
    
    /**
     * Lấy tất cả câu trả lời của một câu hỏi
     * @param questionId ID câu hỏi
     * @param pageable Phân trang
     * @return Page<AnswerResponse>
     */
    public Page<AnswerResponse> getAnswersByQuestion(Long questionId, Pageable pageable) {
        log.info("Getting answers for question: {}", questionId);
        
        return answerRepository.findByQuestionQuestionId(questionId, pageable)
                .map(this::mapToResponse);
    }
    
    /**
     * Lấy câu trả lời được like nhiều nhất
     * @param questionId ID câu hỏi
     * @param pageable Phân trang
     * @return Page<AnswerResponse>
     */
    public Page<AnswerResponse> getMostLikedAnswers(Long questionId, Pageable pageable) {
        log.info("Getting most liked answers for question: {}", questionId);
        
        return answerRepository.findMostLikedAnswers(questionId, pageable)
                .map(this::mapToResponse);
    }
    
    /**
     * Lấy tất cả câu trả lời của một user
     * @param userId ID user
     * @param pageable Phân trang
     * @return Page<AnswerResponse>
     */
    public Page<AnswerResponse> getUserAnswers(Long userId, Pageable pageable) {
        log.info("Getting answers for user: {}", userId);
        
        return answerRepository.findByUserId(userId, pageable)
                .map(this::mapToResponse);
    }
    
    /**
     * Xóa câu trả lời
     * @param answerId ID câu trả lời
     * @param userId ID user (kiểm tra quyền)
     */
    public void deleteAnswer(Long answerId, Long userId) {
        log.info("Deleting answer: {} by user: {}", answerId, userId);
        
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        
        // Kiểm tra quyền
        if (!answer.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this answer");
        }
        
        answerRepository.delete(answer);
    }
    
    /**
     * Cnhungển đổi Answer entity sang AnswerResponse DTO
     */
    private AnswerResponse mapToResponse(Answer answer) {
        Long commentCount = answerCommentRepository.countByAnswerAnswerId(answer.getAnswerId());
        
        return AnswerResponse.builder()
                .answerId(answer.getAnswerId())
                .content(answer.getContent())
                .userId(answer.getUserId())
                .questionId(answer.getQuestion().getQuestionId())
                .isBestAnswer(answer.getIsBestAnswer())
                .likeCount(answer.getLikeCount())
                .commentCount(commentCount)
                .createdAt(answer.getCreatedAt())
                .updatedAt(answer.getUpdatedAt())
                .build();
    }
}
