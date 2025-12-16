package com.upnest.edu.modules.user.entity;

/**
 * Enum: UserStatus
 * Các trạng thái của tài khoản người dùng
 */
public enum UserStatus {
    /**
     * Hoạt động
     */
    ACTIVE("Hoạt động"),
    
    /**
     * Không hoạt động
     */
    INACTIVE("Không hoạt động"),
    
    /**
     * Bị cấm
     */
    BANNED("Bị cấm");
    
    private final String description;
    
    UserStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
