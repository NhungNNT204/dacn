package com.upnest.edu.modules.qa.controller;

import com.upnest.edu.modules.qa.entity.Vote;
import com.upnest.edu.modules.qa.service.VoteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller: VoteController
 * REST API endpoints cho bình chọn (Vote)
 * 
 * Các endpoint:
 * - POST /api/v1/qa/questions/{id}/vote - Vote cho question
 * - POST /api/v1/qa/answers/{id}/vote - Vote cho answer
 * - DELETE /api/v1/qa/questions/{id}/vote - Xóa vote cho question
 * - DELETE /api/v1/qa/answers/{id}/vote - Xóa vote cho answer
 * - GET /api/v1/qa/questions/{id}/vote-score - Lấy điểm vote của question
 * - GET /api/v1/qa/answers/{id}/vote-score - Lấy điểm vote của answer
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/qa")
@RequiredArgsConstructor
public class VoteController {
    
    private final VoteService voteService;
    
    /**
     * Upvote cho question
     * POST /api/v1/qa/questions/{questionId}/upvote
     */
    @PostMapping("/questions/{questionId}/upvote")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> upvoteQuestion(@PathVariable Long questionId) {
        Long userId = getCurrentUserId();
        log.info("User {} upvoting question {}", userId, questionId);
        
        Long voteScore = voteService.voteQuestion(userId, questionId, Vote.VoteType.UPVOTE);
        
        Map<String, Object> response = new HashMap<>();
        response.put("questionId", questionId);
        response.put("voteScore", voteScore);
        response.put("message", "Upvoted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Downvote cho question
     * POST /api/v1/qa/questions/{questionId}/downvote
     */
    @PostMapping("/questions/{questionId}/downvote")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> downvoteQuestion(@PathVariable Long questionId) {
        Long userId = getCurrentUserId();
        log.info("User {} downvoting question {}", userId, questionId);
        
        Long voteScore = voteService.voteQuestion(userId, questionId, Vote.VoteType.DOWNVOTE);
        
        Map<String, Object> response = new HashMap<>();
        response.put("questionId", questionId);
        response.put("voteScore", voteScore);
        response.put("message", "Downvoted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Upvote cho answer
     * POST /api/v1/qa/answers/{answerId}/upvote
     */
    @PostMapping("/answers/{answerId}/upvote")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> upvoteAnswer(@PathVariable Long answerId) {
        Long userId = getCurrentUserId();
        log.info("User {} upvoting answer {}", userId, answerId);
        
        Long voteScore = voteService.voteAnswer(userId, answerId, Vote.VoteType.UPVOTE);
        
        Map<String, Object> response = new HashMap<>();
        response.put("answerId", answerId);
        response.put("voteScore", voteScore);
        response.put("message", "Upvoted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Downvote cho answer
     * POST /api/v1/qa/answers/{answerId}/downvote
     */
    @PostMapping("/answers/{answerId}/downvote")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> downvoteAnswer(@PathVariable Long answerId) {
        Long userId = getCurrentUserId();
        log.info("User {} downvoting answer {}", userId, answerId);
        
        Long voteScore = voteService.voteAnswer(userId, answerId, Vote.VoteType.DOWNVOTE);
        
        Map<String, Object> response = new HashMap<>();
        response.put("answerId", answerId);
        response.put("voteScore", voteScore);
        response.put("message", "Downvoted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy điểm vote của question
     * GET /api/v1/qa/questions/{questionId}/vote-score
     */
    @GetMapping("/questions/{questionId}/vote-score")
    public ResponseEntity<Map<String, Object>> getQuestionVoteScore(@PathVariable Long questionId) {
        Long voteScore = voteService.getQuestionVoteScore(questionId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("questionId", questionId);
        response.put("voteScore", voteScore);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy điểm vote của answer
     * GET /api/v1/qa/answers/{answerId}/vote-score
     */
    @GetMapping("/answers/{answerId}/vote-score")
    public ResponseEntity<Map<String, Object>> getAnswerVoteScore(@PathVariable Long answerId) {
        Long voteScore = voteService.getAnswerVoteScore(answerId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("answerId", answerId);
        response.put("voteScore", voteScore);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy thông tin vote của user hiện tại cho question
     * GET /api/v1/qa/questions/{questionId}/my-vote
     */
    @GetMapping("/questions/{questionId}/my-vote")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getMyVoteOnQuestion(@PathVariable Long questionId) {
        Long userId = getCurrentUserId();
        
        Map<String, Object> response = new HashMap<>();
        response.put("questionId", questionId);
        response.put("hasVoted", voteService.getUserVoteOnQuestion(userId, questionId).isPresent());
        response.put("voteType", voteService.getUserVoteOnQuestion(userId, questionId).orElse(null));
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy thông tin vote của user hiện tại cho answer
     * GET /api/v1/qa/answers/{answerId}/my-vote
     */
    @GetMapping("/answers/{answerId}/my-vote")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getMyVoteOnAnswer(@PathVariable Long answerId) {
        Long userId = getCurrentUserId();
        
        Map<String, Object> response = new HashMap<>();
        response.put("answerId", answerId);
        response.put("hasVoted", voteService.getUserVoteOnAnswer(userId, answerId).isPresent());
        response.put("voteType", voteService.getUserVoteOnAnswer(userId, answerId).orElse(null));
        
        return ResponseEntity.ok(response);
    }
    
    // ===== HELPERS =====
    
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return Long.valueOf(auth.getName());
    }
}

