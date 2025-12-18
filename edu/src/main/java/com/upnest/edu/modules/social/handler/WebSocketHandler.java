package com.upnest.edu.modules.social.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.context.event.EventListener;
import com.upnest.edu.modules.chat.service.ChatService;
import com.upnest.edu.modules.social.payload.*;
import com.upnest.edu.config.WebSocketConfig;
import java.util.Map;

/**
 * WebSocket Handler - Quản lý real-time messaging qua STOMP protocol
 * 
 * Message flows:
 * 1. Client gửi → /app/chat/send → handler xử lý → broadcast qua /topic/chat/
 * 2. Private message → /app/chat/private → handler → gửi qua /user/{userId}/queue/private
 * 3. Typing indicator → /app/chat/typing → broadcast typing status
 * 4. Call events → /app/call/* → handler → broadcast call status
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketHandler {

  private final ChatService chatService;
  private final SimpMessagingTemplate messagingTemplate;

  // ============================================
  // CONNECTION MANAGEMENT
  // ============================================

  /**
   * Xử lý sự kiện kết nối WebSocket
   */
  @EventListener
  public void handleWebSocketConnectListener(SessionConnectedEvent event) {
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    String sessionId = headerAccessor.getSessionId();
    log.info("New WebSocket connection: {}", sessionId);
    
    // Có thể lưu trữ active connections cho tracking
    // activeConnections.put(sessionId, System.currentTimeMillis());
  }

  /**
   * Xử lý sự kiện ngắt kết nối WebSocket
   */
  @EventListener
  public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    String sessionId = headerAccessor.getSessionId();
    log.info("WebSocket disconnection: {}", sessionId);
    
    // Xóa connection từ tracking
    // activeConnections.remove(sessionId);
  }

  // ============================================
  // MESSAGE HANDLING
  // ============================================

  /**
   * /app/chat/send - Gửi tin nhắn tới nhóm chat
   * Broadcast tới /topic/chat/groups/{chatGroupId}
   */
  @MessageMapping("/chat/send/{chatGroupId}")
  @SendTo("/topic/chat/groups/{chatGroupId}")
  public WebSocketMessageDTO handleSendMessage(
      @DestinationVariable Long chatGroupId,
      @Payload SendMessageRequest request) {
    log.info("Handling message send to group {}: {}", chatGroupId, request.getContent());
    
    try {
      // Lưu tin nhắn vào database
      var message = chatService.sendMessage(
          chatGroupId,
          request.getSenderId(),
          request.getSenderName(),
          request.getSenderAvatar(),
          request.getContent(),
          "TEXT"
      );
      
      // Tạo DTO response
      var messageDto = MessageDTO.builder()
          .id(message.getId())
          .chatGroupId(chatGroupId)
          .senderId(request.getSenderId())
          .senderName(request.getSenderName())
          .senderAvatar(request.getSenderAvatar())
          .content(request.getContent())
          .messageType("TEXT")
          .createdAt(message.getCreatedAt())
          .build();
      
      // Broadcast tin nhắn
      return WebSocketMessageDTO.builder()
          .type(WebSocketConfig.MessageTypes.MESSAGE)
          .payload(messageDto)
          .timestamp(java.time.LocalDateTime.now())
          .build();
    } catch (Exception e) {
      log.error("Error handling message send", e);
      return null;
    }
  }

  /**
   * /app/chat/private - Gửi tin nhắn riêng tư cho một user
   * Gửi tới /user/{userId}/queue/private
   */
  @MessageMapping("/chat/private/{receiverId}")
  public void handlePrivateMessage(
      @DestinationVariable Long receiverId,
      @Payload SendMessageRequest request) {
    log.info("Handling private message to user {}", receiverId);
    
    try {
      // Lưu tin nhắn riêng tư
      var message = chatService.sendMessage(
          request.getChatGroupId(),
          request.getSenderId(),
          request.getSenderName(),
          request.getSenderAvatar(),
          request.getContent(),
          "TEXT"
      );
      
      var messageDto = MessageDTO.builder()
          .id(message.getId())
          .chatGroupId(request.getChatGroupId())
          .senderId(request.getSenderId())
          .senderName(request.getSenderName())
          .senderAvatar(request.getSenderAvatar())
          .content(request.getContent())
          .messageType("TEXT")
          .createdAt(message.getCreatedAt())
          .build();
      
      // Gửi tin nhắn riêng tư
      messagingTemplate.convertAndSendToUser(
          receiverId.toString(),
          WebSocketConfig.WebSocketChannels.USER_QUEUE,
          WebSocketMessageDTO.builder()
              .type(WebSocketConfig.MessageTypes.MESSAGE)
              .payload(messageDto)
              .timestamp(java.time.LocalDateTime.now())
              .build()
      );
    } catch (Exception e) {
      log.error("Error handling private message", e);
    }
  }

  /**
   * /app/chat/media - Gửi tin nhắn với media (ảnh/video)
   */
  @MessageMapping("/chat/media/{chatGroupId}")
  @SendTo("/topic/chat/groups/{chatGroupId}")
  public WebSocketMessageDTO handleMediaMessage(
      @DestinationVariable Long chatGroupId,
      @Payload SendMessageRequest request) {
    log.info("Handling media message to group {}", chatGroupId);
    
    try {
      // Lưu tin nhắn media
      var message = chatService.sendMediaMessage(
          chatGroupId,
          request.getSenderId(),
          request.getSenderName(),
          request.getSenderAvatar(),
          request.getContent(),  // mediaUrl
          "IMAGE",               // mediaType
          0L,                    // size
          null,                  // caption
          "MEDIA"                // messageType
      );
      
      var messageDto = MessageDTO.builder()
          .id(message.getId())
          .chatGroupId(chatGroupId)
          .senderId(request.getSenderId())
          .senderName(request.getSenderName())
          .senderAvatar(request.getSenderAvatar())
          .mediaUrl(message.getMediaUrl())
          .messageType("IMAGE")
          .createdAt(message.getCreatedAt())
          .build();
      
      return WebSocketMessageDTO.builder()
          .type(WebSocketConfig.MessageTypes.MESSAGE)
          .payload(messageDto)
          .timestamp(java.time.LocalDateTime.now())
          .build();
    } catch (Exception e) {
      log.error("Error handling media message", e);
      return null;
    }
  }

  /**
   * /app/chat/reaction - Thêm emoji reaction
   */
  @MessageMapping("/chat/reaction/{messageId}")
  public void handleReaction(
      @DestinationVariable Long messageId,
      @Payload AddReactionRequest request) {
    log.info("Handling reaction to message {}: {}", messageId, request.getEmoji());
    
    try {
      chatService.addReaction(messageId, request.getEmoji());
      
      // Broadcast reaction update
      messagingTemplate.convertAndSend(
          "/topic/chat/reactions",
          WebSocketMessageDTO.builder()
              .type(WebSocketConfig.MessageTypes.REACTION)
              .payload(Map.of("messageId", messageId, "emoji", request.getEmoji()))
              .timestamp(java.time.LocalDateTime.now())
              .build()
      );
    } catch (Exception e) {
      log.error("Error handling reaction", e);
    }
  }

  // ============================================
  // TYPING INDICATOR
  // ============================================

  /**
   * /app/chat/typing - Gửi chỉ báo đang gõ
   */
  @MessageMapping("/chat/typing/{chatGroupId}")
  @SendTo("/topic/chat/groups/{chatGroupId}/typing")
  public TypingIndicatorDTO handleTypingIndicator(
      @DestinationVariable Long chatGroupId,
      @Payload TypingIndicatorDTO indicator) {
    log.debug("User {} is typing in chat {}", indicator.getUserId(), chatGroupId);
    return indicator;
  }

  // ============================================
  // CALL HANDLING
  // ============================================

  /**
   * /app/call/initiate - Bắt đầu cuộc gọi
   */
  @MessageMapping("/call/initiate")
  public void handleCallInitiate(
      @Payload InitiateCallRequest request) {
    log.info("Handling call initiate from {} to {}", request.getCallerId(), request.getReceiverId());
    
    try {
      var callRecord = chatService.initiateCall(
          request.getChatGroupId(),
          request.getCallerId(),
          null,
          request.getCallType(),
          request.getReceiverId()
      );
      
      var callDto = CallRecordDTO.builder()
          .id(callRecord.getId())
          .callerId(request.getCallerId())
          .receiverId(request.getReceiverId())
          .callType(request.getCallType())
          .callStatus("RINGING")
          .build();
      
      // Gửi call notification tới receiver
      messagingTemplate.convertAndSendToUser(
          request.getReceiverId().toString(),
          WebSocketConfig.WebSocketChannels.USER_NOTIFICATIONS,
          WebSocketMessageDTO.builder()
              .type(WebSocketConfig.MessageTypes.CALL_INITIATED)
              .payload(callDto)
              .timestamp(java.time.LocalDateTime.now())
              .build()
      );
      
      // Broadcast call status
      messagingTemplate.convertAndSend(
          WebSocketConfig.WebSocketChannels.CALL_CHANNEL,
          WebSocketMessageDTO.builder()
              .type(WebSocketConfig.MessageTypes.CALL_INITIATED)
              .payload(callDto)
              .timestamp(java.time.LocalDateTime.now())
              .build()
      );
    } catch (Exception e) {
      log.error("Error handling call initiate", e);
    }
  }

  /**
   * /app/call/answer - Trả lời cuộc gọi
   */
  @MessageMapping("/call/answer")
  public void handleCallAnswer(@Payload CallRecordDTO callRecord) {
    log.info("Handling call answer for call {}", callRecord.getId());
    
    try {
      chatService.answerCall(callRecord.getId(), null);
      
      // Broadcast call answered
      messagingTemplate.convertAndSend(
          WebSocketConfig.WebSocketChannels.CALL_CHANNEL,
          WebSocketMessageDTO.builder()
              .type(WebSocketConfig.MessageTypes.CALL_ANSWERED)
              .payload(CallRecordDTO.builder()
                  .id(callRecord.getId())
                  .callStatus("ACCEPTED")
                  .build())
              .timestamp(java.time.LocalDateTime.now())
              .build()
      );
    } catch (Exception e) {
      log.error("Error handling call answer", e);
    }
  }

  /**
   * /app/call/reject - Từ chối cuộc gọi
   */
  @MessageMapping("/call/reject")
  public void handleCallReject(@Payload CallRecordDTO callRecord) {
    log.info("Handling call reject for call {}", callRecord.getId());
    
    try {
      chatService.rejectCall(callRecord.getId());
      
      // Broadcast call rejected
      messagingTemplate.convertAndSend(
          WebSocketConfig.WebSocketChannels.CALL_CHANNEL,
          WebSocketMessageDTO.builder()
              .type(WebSocketConfig.MessageTypes.CALL_REJECTED)
              .payload(CallRecordDTO.builder()
                  .id(callRecord.getId())
                  .callStatus("REJECTED")
                  .build())
              .timestamp(java.time.LocalDateTime.now())
              .build()
      );
    } catch (Exception e) {
      log.error("Error handling call reject", e);
    }
  }

  /**
   * /app/call/end - Kết thúc cuộc gọi
   */
  @MessageMapping("/call/end")
  public void handleCallEnd(@Payload CallRecordDTO callRecord) {
    log.info("Handling call end for call {}", callRecord.getId());
    
    try {
      chatService.endCall(callRecord.getId());
      
      // Broadcast call ended
      messagingTemplate.convertAndSend(
          WebSocketConfig.WebSocketChannels.CALL_CHANNEL,
          WebSocketMessageDTO.builder()
              .type(WebSocketConfig.MessageTypes.CALL_ENDED)
              .payload(CallRecordDTO.builder()
                  .id(callRecord.getId())
                  .callStatus("ENDED")
                  .build())
              .timestamp(java.time.LocalDateTime.now())
              .build()
      );
    } catch (Exception e) {
      log.error("Error handling call end", e);
    }
  }

  // ============================================
  // USER STATUS
  // ============================================

  /**
   * Broadcast user presence status
   */
  @MessageMapping("/user/status")
  public void handleUserStatus(
      @Payload Map<String, Object> statusMap) {
    log.debug("User status update: {}", statusMap);
    
    messagingTemplate.convertAndSend(
        "/topic/user/status",
        statusMap
    );
  }
}
