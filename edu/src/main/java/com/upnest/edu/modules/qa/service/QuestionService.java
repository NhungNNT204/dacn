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
import java.util.Optional;

/**
 * Service: QuestionService
 * Xử lý business logic liên quan đến Question
 * 
 * Các chức năng chính:
 * - Tạo, cập nhật, xóa câu hỏi
 * - Tìm kiếm câu hỏi
 * - Quản lý view count, like count
 * - Quản lý best answer
 */

@Slf4j
@Service
@Transactional
@lombok.RequiredArgsConstructor
public class QuestionService {
    
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuestionCommentRepository questionCommentRepository;
    private final QuestionReactionRepository questionReactionRepository;
    
    /**
     * Tạo câu hỏi mới
     * @param userId ID của user tạo câu hỏi
     * @param request Thông tin câu hỏi
     * @return QuestionResponse
     */
    public QuestionResponse createQuestion(Long userId, QuestionRequest request) {
        log.info("Creating question for user: {}", userId);
        
        Question question = Question.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .userId(userId)
                .courseId(request.getCourseId())
                .tags(request.getTags())
                .status(QuestionStatus.OPEN)
                .viewCount(0)
                .likeCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Question saved = questionRepository.save(question);
        log.info("Question created successfully with id: {}", saved.getQuestionId());
        
        return mapToResponse(saved);
    }
    
    /**
     * Cập nhật câu hỏi
     * @param questionId ID câu hỏi
     * @param userId ID user (kiểm tra quyền)
     * @param request Thông tin cập nhật
     * @return QuestionResponse
     */
    public QuestionResponse updateQuestion(Long questionId, Long userId, QuestionRequest request) {
        log.info("Updating question: {} by user: {}", questionId, userId);
        
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        // Kiểm tra quyền
        if (!question.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this question");
        }
        
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setTags(request.getTags());
        question.setUpdatedAt(LocalDateTime.now());
        
        Question updated = questionRepository.save(question);
        return mapToResponse(updated);
    }
    
    /**
     * Lấy thông tin chi tiết câu hỏi
     * @param questionId ID câu hỏi
     * @return QuestionResponse
     */
    public QuestionResponse getQuestionDetail(Long questionId) {
        log.info("Getting question detail: {}", questionId);
        
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        // Tăng view count
        question.setViewCount(question.getViewCount() + 1);
        questionRepository.save(question);
        
        return mapToResponse(question);
    }
    
    /**
     * Lấy tất cả câu hỏi của user
     * @param userId ID user
     * @param pageable Phân trang
     * @return Page<QuestionResponse>
     */
    public Page<QuestionResponse> getUserQuestions(Long userId, Pageable pageable) {
        log.info("Getting questions for user: {}", userId);
        
        return questionRepository.findByUserId(userId, pageable)
                .map(this::mapToResponse);
    }
    
    /**
     * Tìm kiếm câu hỏi theo tiêu đề
     * @param keyword Từ khóa tìm kiếm
     * @param pageable Phân trang
     * @return Page<QuestionResponse>
     */
    public Page<QuestionResponse> searchQuestions(String keyword, Pageable pageable) {
        log.info("Searching questions with keyword: {}", keyword);
        
        return questionRepository.findByTitleContainingIgnoreCase(keyword, pageable)
                .map(this::mapToResponse);
    }
    
    /**
     * Lấy câu hỏi nổi bật
     * @param pageable Phân trang
     * @return Page<QuestionResponse>
     */
    public Page<QuestionResponse> getTrendingQuestions(Pageable pageable) {
        log.info("Getting trending questions");
        
        return questionRepository.findTrendingQuestions(pageable)
                .map(this::mapToResponse);
    }
    
    /**
     * Lấy câu hỏi theo khóa học
     * @param courseId ID khóa học
     * @param pageable Phân trang
     * @return Page<QuestionResponse>
     */
    public Page<QuestionResponse> getQuestionsByCourse(Long courseId, Pageable pageable) {
        log.info("Getting questions for course: {}", courseId);
        
        return questionRepository.findByCourseId(courseId, pageable)
                .map(this::mapToResponse);
    }
    
    /**
     * Xóa câu hỏi
     * @param questionId ID câu hỏi
     * @param userId ID user (kiểm tra quyền)
     */
    public void deleteQuestion(Long questionId, Long userId) {
        log.info("Deleting question: {} by user: {}", questionId, userId);
        
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        // Kiểm tra quyền
        if (!question.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this question");
        }
        
        questionRepository.delete(question);
    }
    
    /**
     * Đặt best answer cho câu hỏi
     * @param questionId ID câu hỏi
     * @param answerId ID câu trả lời
     * @param userId ID user (kiểm tra quyền)
     */
    public void setBestAnswer(Long questionId, Long answerId, Long userId) {
        log.info("Setting best answer {} for question: {}", answerId, questionId);
        
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        // Kiểm tra quyền (chỉ người tạo câu hỏi mới có thể đặt best answer)
        if (!question.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to set best answer");
        }
        
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        
        // Xóa best answer cũ nếu có
        if (question.getBestAnswerId() != null) {
            Answer oldBestAnswer = answerRepository.findById(question.getBestAnswerId()).orElse(null);
            if (oldBestAnswer != null) {
                oldBestAnswer.setIsBestAnswer(false);
                answerRepository.save(oldBestAnswer);
            }
        }
        
        // Đặt best answer mới
        answer.setIsBestAnswer(true);
        answerRepository.save(answer);
        
        question.setBestAnswerId(answerId);
        question.setStatus(QuestionStatus.ANSWERED);
        questionRepository.save(question);
    }
    
    /**
     * Chuyển đổi Question entity sang QuestionResponse DTO
     */
    private QuestionResponse mapToResponse(Question question) {
        Long answerCount = answerRepository.countByQuestionQuestionId(question.getQuestionId());
        Long commentCount = questionCommentRepository.countByQuestionQuestionId(question.getQuestionId());
        
        return QuestionResponse.builder()
                .questionId(question.getQuestionId())
                .title(question.getTitle())
                .content(question.getContent())
                .userId(question.getUserId())
                .courseId(question.getCourseId())
                .tags(question.getTags())
                .status(question.getStatus().toString())
                .viewCount(question.getViewCount())
                .likeCount(question.getLikeCount())
                .answerCount(answerCount)
                .commentCount(commentCount)
                .bestAnswerId(question.getBestAnswerId())
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .build();
    }
}
