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
 * Controller: AnswerController
 * REST API endpoints cho Answer (Câu trả lời)
 * 
 * Các endpoint:
 * - POST /api/qa/questions/{questionId}/answers - Tạo câu trả lời
 * - GET /api/qa/answers/{answerId} - Lấy chi tiết câu trả lời
 * - PUT /api/qa/answers/{answerId} - Cập nhật câu trả lời
 * - DELETE /api/qa/answers/{answerId} - Xóa câu trả lời
 * - POST /api/qa/answers/{answerId}/react - Like/Dislike câu trả lời
 */

@Slf4j
@RestController
@RequestMapping("/api/v1/qa")
@lombok.RequiredArgsConstructor
public class AnswerController {
    
    private final AnswerService answerService;
    private final CommentService commentService;
    private final ReactionService reactionService;
    
    /**
     * Tạo câu trả lời mới
     * POST /api/qa/questions/{questionId}/answers
     */
    @PostMapping("/questions/{questionId}/answers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AnswerResponse> createAnswer(
            @PathVariable Long questionId,
            @RequestBody AnswerRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("Creating answer for question: {} by user: {}", questionId, userId);
        
        AnswerResponse response = answerService.createAnswer(questionId, userId, request);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    
    /**
     * Lấy chi tiết câu trả lời
     * GET /api/qa/answers/{answerId}
     */
    @GetMapping("/answers/{answerId}")
    public ResponseEntity<AnswerResponse> getAnswerDetail(
            @PathVariable Long answerId) {
        
        log.info("Getting answer detail: {}", answerId);
        
        AnswerResponse response = answerService.getAnswerDetail(answerId);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Cập nhật câu trả lời
     * PUT /api/qa/answers/{answerId}
     */
    @PutMapping("/answers/{answerId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AnswerResponse> updateAnswer(
            @PathVariable Long answerId,
            @RequestBody AnswerRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("Updating answer: {} by user: {}", answerId, userId);
        
        AnswerResponse response = answerService.updateAnswer(answerId, userId, request);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa câu trả lời
     * DELETE /api/qa/answers/{answerId}
     */
    @DeleteMapping("/answers/{answerId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deleteAnswer(
            @PathVariable Long answerId) {
        
        Long userId = getCurrentUserId();
        log.info("Deleting answer: {} by user: {}", answerId, userId);
        
        answerService.deleteAnswer(answerId, userId);
        
        return ResponseEntity.ok(Map.of("message", "Answer deleted successfully"));
    }
    
    /**
     * Lấy câu trả lời được like nhiều nhất cho một câu hỏi
     * GET /api/qa/questions/{questionId}/answers/top-rated
     */
    @GetMapping("/questions/{questionId}/answers/top-rated")
    public ResponseEntity<Map<String, Object>> getMostLikedAnswers(
            @PathVariable Long questionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Getting most liked answers for question: {}", questionId);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AnswerResponse> answers = answerService
                .getMostLikedAnswers(questionId, pageable);
        
        return ResponseEntity.ok(buildPageResponse(answers));
    }
    
    /**
     * Lấy câu trả lời của user
     * GET /api/qa/user/answers?page=0&size=10
     */
    @GetMapping("/user/answers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getUserAnswers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Long userId = getCurrentUserId();
        log.info("Getting answers for user: {}", userId);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AnswerResponse> answers = answerService
                .getUserAnswers(userId, pageable);
        
        return ResponseEntity.ok(buildPageResponse(answers));
    }
    
    /**
     * Phản ứng (Like/Dislike) trên câu trả lời
     * POST /api/qa/answers/{answerId}/react
     */
    @PostMapping("/answers/{answerId}/react")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReactionResponse> reactToAnswer(
            @PathVariable Long answerId,
            @RequestBody ReactionRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("User {} is reacting to answer: {}", userId, answerId);
        
        ReactionResponse response = reactionService.reactToAnswer(answerId, userId, request);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    
    /**
     * Hủy phản ứng trên câu trả lời
     * DELETE /api/qa/answers/{answerId}/react
     */
    @DeleteMapping("/answers/{answerId}/react")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> removeAnswerReaction(
            @PathVariable Long answerId) {
        
        Long userId = getCurrentUserId();
        log.info("Removing reaction from answer: {} by user: {}", answerId, userId);
        
        reactionService.removeAnswerReaction(answerId, userId);
        
        return ResponseEntity.ok(Map.of("message", "Reaction removed successfully"));
    }
    
    /**
     * Lấy tất cả bình luận trên câu trả lời
     * GET /api/qa/answers/{answerId}/comments
     */
    @GetMapping("/answers/{answerId}/comments")
    public ResponseEntity<Map<String, Object>> getCommentsOnAnswer(
            @PathVariable Long answerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Getting comments for answer: {}", answerId);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CommentResponse> comments = commentService
                .getAnswerComments(answerId, pageable);
        
        return ResponseEntity.ok(buildPageResponse(comments));
    }
    
    /**
     * Tạo bình luận trên câu trả lời
     * POST /api/qa/answers/{answerId}/comments
     */
    @PostMapping("/answers/{answerId}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> createCommentOnAnswer(
            @PathVariable Long answerId,
            @RequestBody CommentRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("Creating comment on answer: {} by user: {}", answerId, userId);
        
        CommentResponse response = commentService.createAnswerComment(answerId, userId, request);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    
    // ===== HELPERS =====
    
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return Long.valueOf(auth.getName());
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
