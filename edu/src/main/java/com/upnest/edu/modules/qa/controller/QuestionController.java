package com.upnest.edu.modules.qa.controller;

import com.upnest.edu.modules.qa.payload.*;
import com.upnest.edu.modules.qa.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller: QuestionController
 * REST API endpoints cho Question (Câu hỏi)
 * 
 * Các endpoint:
 * - POST /api/qa/questions - Tạo câu hỏi mới
 * - GET /api/qa/questions - Lấy danh sách câu hỏi
 * - GET /api/qa/questions/{id} - Lấy chi tiết câu hỏi
 * - PUT /api/qa/questions/{id} - Cập nhật câu hỏi
 * - DELETE /api/qa/questions/{id} - Xóa câu hỏi
 * - POST /api/qa/questions/{id}/best-answer - Đặt best answer
 */

@Slf4j
@RestController
@RequestMapping("/api/v1/qa/questions")
public class QuestionController {
    
    @org.springframework.beans.factory.annotation.Autowired
    private QuestionService questionService;
    @org.springframework.beans.factory.annotation.Autowired
    private AnswerService answerService;
    @org.springframework.beans.factory.annotation.Autowired
    private CommentService commentService;
    @org.springframework.beans.factory.annotation.Autowired
    private ReactionService reactionService;
    
    /**
     * Tạo câu hỏi mới
     * POST /api/qa/questions
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<QuestionResponse> createQuestion(
            @RequestBody QuestionRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("Creating new question for user: {}", userId);
        
        QuestionResponse response = questionService.createQuestion(userId, request);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    
    /**
     * Lấy danh sách câu hỏi với phân trang
     * GET /api/qa/questions?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Getting all questions - page: {}, size: {}", page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<QuestionResponse> questions = questionService
                .getTrendingQuestions(pageable);
        
        return ResponseEntity.ok(buildPageResponse(questions));
    }
    
    /**
     * Lấy câu hỏi theo khóa học
     * GET /api/qa/courses/{courseId}/questions
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<Map<String, Object>> getQuestionsByCourse(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Getting questions for course: {}", courseId);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<QuestionResponse> questions = questionService
                .getQuestionsByCourse(courseId, pageable);
        
        return ResponseEntity.ok(buildPageResponse(questions));
    }
    
    /**
     * Tìm kiếm câu hỏi theo tiêu đề
     * GET /api/qa/questions/search?keyword=java
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchQuestions(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Searching questions with keyword: {}", keyword);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<QuestionResponse> questions = questionService
                .searchQuestions(keyword, pageable);
        
        return ResponseEntity.ok(buildPageResponse(questions));
    }
    
    /**
     * Lấy câu hỏi của user hiện tại
     * GET /api/qa/questions/my-questions
     */
    @GetMapping("/my-questions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getMyQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Long userId = getCurrentUserId();
        log.info("Getting questions for current user: {}", userId);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<QuestionResponse> questions = questionService
                .getUserQuestions(userId, pageable);
        
        return ResponseEntity.ok(buildPageResponse(questions));
    }
    
    /**
     * Lấy chi tiết câu hỏi
     * GET /api/qa/questions/{questionId}
     */
    @GetMapping("/{questionId}")
    public ResponseEntity<QuestionResponse> getQuestionDetail(
            @PathVariable Long questionId) {
        
        log.info("Getting question detail: {}", questionId);
        
        QuestionResponse response = questionService.getQuestionDetail(questionId);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Cập nhật câu hỏi
     * PUT /api/qa/questions/{questionId}
     */
    @PutMapping("/{questionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<QuestionResponse> updateQuestion(
            @PathVariable Long questionId,
            @RequestBody QuestionRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("Updating question: {} by user: {}", questionId, userId);
        
        QuestionResponse response = questionService
                .updateQuestion(questionId, userId, request);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa câu hỏi
     * DELETE /api/qa/questions/{questionId}
     */
    @DeleteMapping("/{questionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deleteQuestion(
            @PathVariable Long questionId) {
        
        Long userId = getCurrentUserId();
        log.info("Deleting question: {} by user: {}", questionId, userId);
        
        questionService.deleteQuestion(questionId, userId);
        
        return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
    }
    
    /**
     * Đặt best answer cho câu hỏi
     * POST /api/qa/questions/{questionId}/best-answer/{answerId}
     */
    @PostMapping("/{questionId}/best-answer/{answerId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> setBestAnswer(
            @PathVariable Long questionId,
            @PathVariable Long answerId) {
        
        Long userId = getCurrentUserId();
        log.info("Setting best answer {} for question: {} by user: {}", answerId, questionId, userId);
        
        questionService.setBestAnswer(questionId, answerId, userId);
        
        return ResponseEntity.ok(Map.of("message", "Best answer set successfully"));
    }
    
    /**
     * Lấy tất cả câu trả lời của câu hỏi
     * GET /api/qa/questions/{questionId}/answers
     */
    @GetMapping("/{questionId}/answers")
    public ResponseEntity<Map<String, Object>> getAnswersByQuestion(
            @PathVariable Long questionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Getting answers for question: {}", questionId);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AnswerResponse> answers = answerService
                .getAnswersByQuestion(questionId, pageable);
        
        return ResponseEntity.ok(buildPageResponse(answers));
    }
    
    /**
     * Lấy tất cả bình luận của câu hỏi
     * GET /api/qa/questions/{questionId}/comments
     */
    @GetMapping("/{questionId}/comments")
    public ResponseEntity<Map<String, Object>> getCommentsOnQuestion(
            @PathVariable Long questionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Getting comments for question: {}", questionId);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CommentResponse> comments = commentService
                .getQuestionComments(questionId, pageable);
        
        return ResponseEntity.ok(buildPageResponse(comments));
    }
    
    // ===== HELPERS =====
    
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Giả sử claim "userId" hoặc username được lưu trong JWT
        return Long.valueOf(auth.getName()); // Thay đổi tùy theo cách lưu user info
    }
    
    private <T> Map<String, Object> buildPageResponse(Page<T> page) {
        Map<String, Object> response = new HashMap<>();
        response.put("content", page.getContent());
        response.put("totalElements", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        response.put("currentPage", page.getNumber());
        response.put("pageSize", page.getSize());
        return response;
    }
}
