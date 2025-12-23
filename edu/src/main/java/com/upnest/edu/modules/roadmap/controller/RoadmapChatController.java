package com.upnest.edu.modules.roadmap.controller;

import com.upnest.edu.modules.roadmap.entity.RoadmapChatMessage;
import com.upnest.edu.modules.roadmap.entity.RoadmapGroupChat;
import com.upnest.edu.modules.roadmap.service.RoadmapChatService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * RoadmapChatController - REST API và WebSocket cho phòng thảo luận nhóm lộ trình
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class RoadmapChatController {
    
    private final RoadmapChatService chatService;
    
    /**
     * REST: Tạo hoặc lấy phòng chat cho lộ trình
     */
    @GetMapping("/api/v1/roadmap/{roadmapId}/chat")
    @ResponseBody
    public ResponseEntity<?> getChatRoom(
            @PathVariable Long roadmapId,
            @RequestParam String roadmapName) {
        try {
            RoadmapGroupChat chatRoom = chatService.getOrCreateChatRoom(roadmapId, roadmapName);
            return ResponseEntity.ok(Map.of("success", true, "data", chatRoom));
        } catch (Exception e) {
            log.error("Error getting chat room", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * REST: Lấy tin nhắn trong phòng chat
     */
    @GetMapping("/api/v1/roadmap/chat/{chatRoomId}/messages")
    @ResponseBody
    public ResponseEntity<?> getMessages(
            @PathVariable String chatRoomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        try {
            List<RoadmapChatMessage> messages = chatService.getRecentMessages(chatRoomId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", messages,
                    "total", messages.size()
            ));
        } catch (Exception e) {
            log.error("Error getting messages", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * REST: Lấy tin nhắn được ghim
     */
    @GetMapping("/api/v1/roadmap/chat/{chatRoomId}/pinned")
    @ResponseBody
    public ResponseEntity<?> getPinnedMessages(@PathVariable String chatRoomId) {
        try {
            List<RoadmapChatMessage> messages = chatService.getPinnedMessages(chatRoomId);
            return ResponseEntity.ok(Map.of("success", true, "data", messages));
        } catch (Exception e) {
            log.error("Error getting pinned messages", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * REST: Ghim tin nhắn
     */
    @PostMapping("/api/v1/roadmap/chat/messages/{messageId}/pin")
    @ResponseBody
    public ResponseEntity<?> pinMessage(@PathVariable Long messageId) {
        try {
            RoadmapChatMessage message = chatService.pinMessage(messageId);
            return ResponseEntity.ok(Map.of("success", true, "data", message));
        } catch (Exception e) {
            log.error("Error pinning message", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * REST: Xóa tin nhắn
     */
    @DeleteMapping("/api/v1/roadmap/chat/messages/{messageId}")
    @ResponseBody
    public ResponseEntity<?> deleteMessage(
            @PathVariable Long messageId,
            Authentication auth) {
        try {
            Long userId = Long.parseLong(auth.getName());
            chatService.deleteMessage(messageId, userId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Message deleted"));
        } catch (Exception e) {
            log.error("Error deleting message", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * WebSocket: Gửi tin nhắn
     * Endpoint: /app/roadmap-chat/{chatRoomId}/send
     * Subscribe: /topic/roadmap-chat/{chatRoomId}
     */
    @MessageMapping("/roadmap-chat/{chatRoomId}/send")
    @SendTo("/topic/roadmap-chat/{chatRoomId}")
    public RoadmapChatMessage sendMessage(
            @DestinationVariable String chatRoomId,
            @Payload ChatMessageRequest request) {
        try {
            return chatService.sendMessage(
                    chatRoomId,
                    request.getUserId(),
                    request.getUserName(),
                    request.getUserAvatar(),
                    request.getContent(),
                    request.getMessageType(),
                    request.getAttachmentUrl(),
                    request.getReplyToMessageId()
            );
        } catch (Exception e) {
            log.error("Error sending message via WebSocket", e);
            throw new RuntimeException("Failed to send message: " + e.getMessage());
        }
    }
    
    /**
     * WebSocket: User join phòng chat
     */
    @MessageMapping("/roadmap-chat/{chatRoomId}/join")
    @SendTo("/topic/roadmap-chat/{chatRoomId}/users")
    public Map<String, Object> userJoin(
            @DestinationVariable String chatRoomId,
            @Payload Map<String, Object> userInfo) {
        try {
            chatService.incrementMemberCount(chatRoomId);
            return Map.of(
                    "type", "USER_JOINED",
                    "userId", userInfo.get("userId"),
                    "userName", userInfo.get("userName")
            );
        } catch (Exception e) {
            log.error("Error user join", e);
            return Map.of("error", e.getMessage());
        }
    }
    
    /**
     * WebSocket: User leave phòng chat
     */
    @MessageMapping("/roadmap-chat/{chatRoomId}/leave")
    @SendTo("/topic/roadmap-chat/{chatRoomId}/users")
    public Map<String, Object> userLeave(
            @DestinationVariable String chatRoomId,
            @Payload Map<String, Object> userInfo) {
        try {
            chatService.decrementMemberCount(chatRoomId);
            return Map.of(
                    "type", "USER_LEFT",
                    "userId", userInfo.get("userId"),
                    "userName", userInfo.get("userName")
            );
        } catch (Exception e) {
            log.error("Error user leave", e);
            return Map.of("error", e.getMessage());
        }
    }
}

/**
 * DTO cho tin nhắn chat
 */
@Data
class ChatMessageRequest {
    private Long userId;
    private String userName;
    private String userAvatar;
    private String content;
    private RoadmapChatMessage.MessageType messageType = RoadmapChatMessage.MessageType.TEXT;
    private String attachmentUrl;
    private Long replyToMessageId;
}

