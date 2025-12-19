package com.upnest.edu.modules.messaging.controller;

import com.upnest.edu.modules.messaging.payload.*;
import com.upnest.edu.modules.messaging.service.MessagingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * MessagingController - API endpoints cho messaging
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/messaging")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessagingController {

    private final MessagingService messagingService;

    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return Long.parseLong(authentication.getName());
    }

    /**
     * GET /api/v1/messaging/conversations?filter=all|individual|group|ai
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations(
            @RequestParam(required = false, defaultValue = "all") String filter,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        List<ConversationDTO> conversations = messagingService.getConversations(userId, filter);
        return ResponseEntity.ok(conversations);
    }

    /**
     * GET /api/v1/messaging/conversations/{conversationId}/messages?page=0&size=50
     */
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageDTO>> getMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        List<MessageDTO> messages = messagingService.getMessages(conversationId, userId, page, size);
        return ResponseEntity.ok(messages);
    }

    /**
     * POST /api/v1/messaging/conversations/{conversationId}/messages
     */
    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<MessageDTO> sendMessage(
            @PathVariable Long conversationId,
            @RequestBody SendMessageRequest request,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        MessageDTO message = messagingService.sendMessage(conversationId, userId, request);
        return ResponseEntity.ok(message);
    }

    /**
     * POST /api/v1/messaging/conversations/{conversationId}/read
     */
    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long conversationId,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        messagingService.markAsRead(conversationId, userId);
        return ResponseEntity.ok().build();
    }
}

