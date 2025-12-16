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
 * Controller: CommentController
 * REST API endpoints cho Comments (Bình luận trên Câu hỏi)
 * 
 * Các endpoint:
 * - POST /api/qa/questions/{questionId}/comments - Tạo bình luận
 * - PUT /api/qa/questions/comments/{commentId} - Cập nhật bình luận
 * - DELETE /api/qa/questions/comments/{commentId} - Xóa bình luận
 */

@Slf4j
@RestController
@lombok.RequiredArgsConstructor
@RequestMapping("/api/v1/qa")
public class CommentController {
    
    private final CommentService commentService;
    
    /**
     * Tạo bình luận trên câu hỏi
     * POST /api/qa/questions/{questionId}/comments
     */
    @PostMapping("/questions/{questionId}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> createCommentOnQuestion(
            @PathVariable Long questionId,
            @RequestBody CommentRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("Creating comment on question: {} by user: {}", questionId, userId);
        
        CommentResponse response = commentService.createQuestionComment(questionId, userId, request);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    
    /**
     * Cập nhật bình luận trên câu hỏi
     * PUT /api/qa/questions/comments/{commentId}
     */
    @PutMapping("/questions/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> updateQuestionComment(
            @PathVariable Long commentId,
            @RequestBody CommentRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("Updating question comment: {} by user: {}", commentId, userId);
        
        CommentResponse response = commentService.updateQuestionComment(commentId, userId, request);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa bình luận trên câu hỏi
     * DELETE /api/qa/questions/comments/{commentId}
     */
    @DeleteMapping("/questions/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deleteQuestionComment(
            @PathVariable Long commentId) {
        
        Long userId = getCurrentUserId();
        log.info("Deleting question comment: {} by user: {}", commentId, userId);
        
        commentService.deleteQuestionComment(commentId, userId);
        
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
    }
    
    /**
     * Cập nhật bình luận trên câu trả lời
     * PUT /api/qa/answers/comments/{commentId}
     */
    @PutMapping("/answers/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> updateAnswerComment(
            @PathVariable Long commentId,
            @RequestBody CommentRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("Updating answer comment: {} by user: {}", commentId, userId);
        
        CommentResponse response = commentService.updateAnswerComment(commentId, userId, request);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa bình luận trên câu trả lời
     * DELETE /api/qa/answers/comments/{commentId}
     */
    @DeleteMapping("/answers/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deleteAnswerComment(
            @PathVariable Long commentId) {
        
        Long userId = getCurrentUserId();
        log.info("Deleting answer comment: {} by user: {}", commentId, userId);
        
        commentService.deleteAnswerComment(commentId, userId);
        
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
    }
    
    // ===== HELPERS =====
    
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return Long.valueOf(auth.getName());
    }
}
