package com.upnest.edu.modules.qa.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

/**
 * WebSocket Configuration cho Q&A Realtime
 * 
 * Endpoint: /ws-qa
 * Destinations:
 * - /topic/questions/{questionId} - Nhận updates cho câu hỏi cụ thể
 * - /topic/answers/{answerId} - Nhận updates cho câu trả lời cụ thể
 * - /topic/qa/new - Nhận thông báo câu hỏi mới
 * - /user/queue/notifications - Nhận thông báo cá nhân
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Định nghĩa prefix cho các message từ server → client
        config.enableSimpleBroker("/topic", "/queue");
        
        // Định nghĩa prefix cho các message từ client → server
        config.setApplicationDestinationPrefixes("/app");
        
        // Prefix cho user-specific messages
        config.setUserDestinationPrefix("/user");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Đăng ký WebSocket endpoint
        registry.addEndpoint("/ws-qa")
                .setAllowedOriginPatterns(
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://localhost:5175"
                )
                .withSockJS(); // Fallback cho browsers không hỗ trợ WebSocket
    }
}
