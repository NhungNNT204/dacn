package com.upnest.edu.modules.qa.controller;

import com.upnest.edu.modules.qa.payload.*;
import com.upnest.edu.modules.qa.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller: ReactionController
 * REST API endpoints cho Reactions (Like/Dislike trên Câu hỏi)
 * 
 * Các endpoint:
 * - POST /api/qa/questions/{questionId}/react - Like/Dislike câu hỏi
 * - DELETE /api/qa/questions/{questionId}/react - Hủy phản ứng
 */

@Slf4j
@RestController
@RequestMapping("/api/v1/qa")
@lombok.RequiredArgsConstructor
public class ReactionController {
    
    private final ReactionService reactionService;
    
    /**
     * Phản ứng (Like/Dislike) trên câu hỏi
     * POST /api/qa/questions/{questionId}/react
     */
    @PostMapping("/questions/{questionId}/react")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReactionResponse> reactToQuestion(
            @PathVariable Long questionId,
            @RequestBody ReactionRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("User {} is reacting to question: {}", userId, questionId);
        
        ReactionResponse response = reactionService.reactToQuestion(questionId, userId, request);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    
    /**
     * Hủy phản ứng trên câu hỏi
     * DELETE /api/qa/questions/{questionId}/react
     */
    @DeleteMapping("/questions/{questionId}/react")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> removeQuestionReaction(
            @PathVariable Long questionId) {
        
        Long userId = getCurrentUserId();
        log.info("Removing reaction from question: {} by user: {}", questionId, userId);
        
        reactionService.removeQuestionReaction(questionId, userId);
        
        return ResponseEntity.ok(Map.of("message", "Reaction removed successfully"));
    }
    
    // ===== HELPERS =====
    
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return Long.valueOf(auth.getName());
    }
}
