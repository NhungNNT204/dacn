package com.upnest.edu.modules.user.entity;

/**
 * Enum: UserRole
 * Các vai trò trong hệ thống
 */
public enum UserRole {
    /**
     * Sinh viên
     */
    STUDENT("Sinh viên"),
    
    /**
     * Giáo viên
     */
    TEACHER("Giáo viên"),
    
    /**
     * Quản trị viên
     */
    ADMIN("Quản trị viên");
    
    private final String description;
    
    UserRole(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
