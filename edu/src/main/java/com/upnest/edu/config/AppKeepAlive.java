package com.upnest.edu.config;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

/**
 * Component để giữ ứng dụng chạy liên tục (không tự exit sau một thời gian).
 * Sử dụng một thread block vô hạn để đảm bảo app server không bị dừng.
 */
@Component
public class AppKeepAlive {

    @PostConstruct
    public void init() {
        System.out.println(">>> AppKeepAlive: Bắt đầu giữ ứng dụng chạy...");
        
        // Khởi tạo thread daemon để giữ JVM sống
        Thread keepAliveThread = new Thread(() -> {
            try {
                // Giữ thread này chạy vô hạn → app server sẽ tiếp tục chạy
                Thread.sleep(Long.MAX_VALUE);
            } catch (InterruptedException e) {
                System.out.println(">>> AppKeepAlive bị interrupt");
            }
        });
        
        // Đặt thread này làm daemon (sẽ exit khi main thread thoát)
        keepAliveThread.setDaemon(false); // Non-daemon để giữ JVM sống
        keepAliveThread.setName("AppKeepAlive-Thread");
        keepAliveThread.start();
        
        System.out.println(">>> AppKeepAlive: Ứng dụng sẽ giữ chạy liên tục");
    }
}
