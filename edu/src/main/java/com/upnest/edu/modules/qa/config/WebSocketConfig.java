package com.upnest.edu.modules.qa.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.lang.NonNull;

/**
 * Configuration: WebSocketConfig
 * Cấu hình WebSocket với STOMP protocol cho realtime Q&A
 * 
 * Cấu hình:
 * - Message broker: /topic, /queue
 * - STOMP endpoint: /ws-qa
 * - Application destination prefix: /app
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    /**
     * Cấu hình Message Broker
     * - /topic: Dùng cho broadcast (1 to many)
     * - /queue: Dùng cho unicast (1 to 1)
     * - /user: Dùng cho peering (user-specific)
     */
    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry config) {
        // Bật simple message broker cho /topic và /queue
        config.enableSimpleBroker("/topic", "/queue", "/user");
        
        // Prefix cho các message gửi đến controller
        config.setApplicationDestinationPrefixes("/app");
        
        // Prefix cho user-specific messages
        config.setUserDestinationPrefix("/user");
    }
    
    /**
     * Đăng ký STOMP endpoint
     * Client sẽ connect tới http://localhost:8080/ws-qa
     */
    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        // Endpoint cho WebSocket
        registry.addEndpoint("/ws-qa")
                .setAllowedOrigins("*")  // CORS: cho phép tất cả origin (để production thay đổi)
                .withSockJS();           // Fallback cho các browser không support WebSocket
    }
}
