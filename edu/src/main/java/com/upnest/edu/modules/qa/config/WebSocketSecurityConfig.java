package com.upnest.edu.modules.qa.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Configuration: WebSocketSecurityConfig
 * Cấu hình bảo mật cho WebSocket
 * 
 * Note: Có thể thêm authentication interceptor ở đây nếu cần kiểm tra JWT token
 */

@Slf4j
@Configuration
public class WebSocketSecurityConfig implements WebSocketMessageBrokerConfigurer {
    
    /**
     * Cấu hình input channel interceptor
     * Có thể kiểm tra JWT token từ handshake headers ở đây
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        log.info("Configuring WebSocket security");
        // Có thể thêm interceptor: registration.interceptors(new WebSocketAuthInterceptor());
    }
}
