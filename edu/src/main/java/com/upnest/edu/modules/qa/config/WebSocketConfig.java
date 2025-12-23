package com.upnest.edu.modules.qa.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket Configuration (shared for QA + Social/Chat/Video)
 *
 * Endpoints (SockJS enabled):
 * - /ws, /ws-qa, /ws-chat, /ws-social, /ws-video, /ws-roadmap
 *
 * Destinations (server → client):
 * - /topic/** (broadcast), /queue/** (point-to-point), /user/queue/** (personal)
 *
 * Destinations (client → server):
 * - /app/** (mapped via @MessageMapping)
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final String[] SOCKET_ENDPOINTS = new String[] {
        "/ws",
        "/ws-qa",
        "/ws-chat",
        "/ws-social",
        "/ws-video",
        "/ws-roadmap"
    };
    
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
        // Đăng ký WebSocket endpoints (dùng chung cho QA + Chat + Video + Roadmap)
        registry
            .addEndpoint(SOCKET_ENDPOINTS)
            .setAllowedOriginPatterns(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "http://192.168.*:*",
                "http://10.*:*",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175"
            )
            .withSockJS(); // Fallback cho browsers không hỗ trợ WebSocket
    }
}
