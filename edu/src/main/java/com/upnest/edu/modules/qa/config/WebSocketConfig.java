package com.upnest.edu.modules.qa.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

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
    
    private final ThreadPoolTaskScheduler taskScheduler;
    
    public WebSocketConfig(ThreadPoolTaskScheduler taskScheduler) {
        this.taskScheduler = taskScheduler;
    }
    
    /**
     * Cấu hình Message Broker
     * - /topic: Dùng cho broadcast (1 to many)
     * - /queue: Dùng cho unicast (1 to 1)
     * - /user: Dùng cho peering (user-specific)
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Bật simple message broker cho /topic và /queue
        config.enableSimpleBroker("/topic", "/queue", "/user")
                .setTaskScheduler(taskScheduler)
                // Heartbeat: client gửi heartbeat mỗi 10s, server reply mỗi 10s
                .setHeartbeatValue(new long[]{10000, 10000});
        
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
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint cho WebSocket
        registry.addEndpoint("/ws-qa")
                .setAllowedOrigins("*")  // CORS: cho phép tất cả origin (để production thay đổi)
                .withSockJS();           // Fallback cho các browser không support WebSocket
    }
}
