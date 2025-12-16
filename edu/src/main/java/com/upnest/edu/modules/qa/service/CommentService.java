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
 * Service: CommentService
 * Xử lý business logic liên quan đến Comments (QuestionComment + AnswerComment)
 * 
 * Các chức năng chính:
 * - Tạo, cập nhật, xóa bình luận
 * - Lấy bình luận theo câu hỏi/câu trả lời
 */

@Slf4j
@Service
@Transactional
@lombok.RequiredArgsConstructor
public class CommentService {
    
    private final QuestionCommentRepository questionCommentRepository;
    private final AnswerCommentRepository answerCommentRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    
    // ===== QUESTION COMMENTS =====
    
    /**
     * Tạo bình luận trên câu hỏi
     * @param questionId ID câu hỏi
     * @param userId ID user bình luận
     * @param request Nội dung bình luận
     * @return CommentResponse
     */
    public CommentResponse createQuestionComment(Long questionId, Long userId, CommentRequest request) {
        log.info("Creating comment on question: {} by user: {}", questionId, userId);
        
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        QuestionComment comment = QuestionComment.builder()
                .content(request.getContent())
                .userId(userId)
                .question(question)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        QuestionComment saved = questionCommentRepository.save(comment);
        log.info("Question comment created successfully with id: {}", saved.getCommentId());
        
        return mapQuestionCommentToResponse(saved);
    }
    
    /**
     * Lấy tất cả bình luận của một câu hỏi
     * @param questionId ID câu hỏi
     * @param pageable Phân trang
     * @return Page<CommentResponse>
     */
    public Page<CommentResponse> getQuestionComments(Long questionId, Pageable pageable) {
        log.info("Getting comments for question: {}", questionId);
        
        return questionCommentRepository.findByQuestionQuestionId(questionId, pageable)
                .map(this::mapQuestionCommentToResponse);
    }
    
    /**
     * Cập nhật bình luận trên câu hỏi
     * @param commentId ID bình luận
     * @param userId ID user (kiểm tra quyền)
     * @param request Nội dung cập nhật
     * @return CommentResponse
     */
    public CommentResponse updateQuestionComment(Long commentId, Long userId, CommentRequest request) {
        log.info("Updating question comment: {} by user: {}", commentId, userId);
        
        QuestionComment comment = questionCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this comment");
        }
        
        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        
        QuestionComment updated = questionCommentRepository.save(comment);
        return mapQuestionCommentToResponse(updated);
    }
    
    /**
     * Xóa bình luận trên câu hỏi
     * @param commentId ID bình luận
     * @param userId ID user (kiểm tra quyền)
     */
    public void deleteQuestionComment(Long commentId, Long userId) {
        log.info("Deleting question comment: {} by user: {}", commentId, userId);
        
        QuestionComment comment = questionCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this comment");
        }
        
        questionCommentRepository.delete(comment);
    }
    
    // ===== ANSWER COMMENTS =====
    
    /**
     * Tạo bình luận trên câu trả lời
     * @param answerId ID câu trả lời
     * @param userId ID user bình luận
     * @param request Nội dung bình luận
     * @return CommentResponse
     */
    public CommentResponse createAnswerComment(Long answerId, Long userId, CommentRequest request) {
        log.info("Creating comment on answer: {} by user: {}", answerId, userId);
        
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        
        AnswerComment comment = AnswerComment.builder()
                .content(request.getContent())
                .userId(userId)
                .answer(answer)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        AnswerComment saved = answerCommentRepository.save(comment);
        log.info("Answer comment created successfully with id: {}", saved.getCommentId());
        
        return mapAnswerCommentToResponse(saved);
    }
    
    /**
     * Lấy tất cả bình luận của một câu trả lời
     * @param answerId ID câu trả lời
     * @param pageable Phân trang
     * @return Page<CommentResponse>
     */
    public Page<CommentResponse> getAnswerComments(Long answerId, Pageable pageable) {
        log.info("Getting comments for answer: {}", answerId);
        
        return answerCommentRepository.findByAnswerAnswerId(answerId, pageable)
                .map(this::mapAnswerCommentToResponse);
    }
    
    /**
     * Cập nhật bình luận trên câu trả lời
     * @param commentId ID bình luận
     * @param userId ID user (kiểm tra quyền)
     * @param request Nội dung cập nhật
     * @return CommentResponse
     */
    public CommentResponse updateAnswerComment(Long commentId, Long userId, CommentRequest request) {
        log.info("Updating answer comment: {} by user: {}", commentId, userId);
        
        AnswerComment comment = answerCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this comment");
        }
        
        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        
        AnswerComment updated = answerCommentRepository.save(comment);
        return mapAnswerCommentToResponse(updated);
    }
    
    /**
     * Xóa bình luận trên câu trả lời
     * @param commentId ID bình luận
     * @param userId ID user (kiểm tra quyền)
     */
    public void deleteAnswerComment(Long commentId, Long userId) {
        log.info("Deleting answer comment: {} by user: {}", commentId, userId);
        
        AnswerComment comment = answerCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this comment");
        }
        
        answerCommentRepository.delete(comment);
    }
    
    // ===== CONVERTERS =====
    
    private CommentResponse mapQuestionCommentToResponse(QuestionComment comment) {
        return CommentResponse.builder()
                .commentId(comment.getCommentId())
                .content(comment.getContent())
                .userId(comment.getUserId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
    
    private CommentResponse mapAnswerCommentToResponse(AnswerComment comment) {
        return CommentResponse.builder()
                .commentId(comment.getCommentId())
                .content(comment.getContent())
                .userId(comment.getUserId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
