package com.upnest.edu.modules.user.entity;

/**
 * Enum: PrivacyLevel
 * Các mức độ quyền riêng tư
 */
public enum PrivacyLevel {
    /**
     * Công khai - Ai cũng có thể xem
     */
    PUBLIC("Công khai"),
    
    /**
     * Ai cũng có thể
     */
    ANYONE("Ai cũng được"),
    
    /**
     * Chỉ bạn bè
     */
    FRIENDS_ONLY("Chỉ bạn bè"),
    
    /**
     * Riêng tư - Chỉ mình
     */
    PRIVATE("Riêng tư");
    
    private final String description;
    
    PrivacyLevel(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
