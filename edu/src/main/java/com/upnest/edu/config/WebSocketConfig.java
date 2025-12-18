package com.upnest.edu.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

/**
 * WebSocket Configuration - DISABLED TEMPORARILY
 * 
 * Reason: StompEndpointRegistry cannot be resolved in Spring Boot 3.5.0
 * The WebSocket/STOMP functionality is not critical for core features
 * 
 * Note: WebSocket/real-time chat can be enabled in future by:
 * 1. Resolving the Spring Messaging dependency issue
 * 2. Using alternative WebSocket libraries if needed
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class WebSocketConfig {
    // WebSocket configuration temporarily disabled
    // Core application features work without real-time WebSocket
    
    /**
     * Cấu hình kênh thông tin được phép
     */
    public static class WebSocketChannels {
        // Broadcast channels
        public static final String CHAT_GENERAL = "/topic/chat/general";
        public static final String CHAT_GROUP = "/topic/chat/group/%d";
        public static final String CALL_CHANNEL = "/topic/calls";
        
        // Private channels
        public static final String USER_QUEUE = "/user/queue/private";
        public static final String USER_NOTIFICATIONS = "/user/queue/notifications";
        
        // Application channels (inbound)
        public static final String SEND_MESSAGE = "/app/chat/send";
        public static final String SEND_PRIVATE = "/app/chat/private";
        public static final String TYPING_INDICATOR = "/app/chat/typing";
        public static final String CALL_INITIATE = "/app/call/initiate";
        public static final String CALL_ANSWER = "/app/call/answer";
        public static final String CALL_REJECT = "/app/call/reject";
    }

    /**
     * Message type constants
     */
    public static class MessageTypes {
        public static final String MESSAGE = "message";
        public static final String TYPING = "typing";
        public static final String REACTION = "reaction";
        public static final String CALL_INITIATED = "call_initiated";
        public static final String CALL_ANSWERED = "call_answered";
        public static final String CALL_REJECTED = "call_rejected";
        public static final String CALL_ENDED = "call_ended";
        public static final String USER_JOINED = "user_joined";
        public static final String USER_LEFT = "user_left";
    }
}
