package com.upnest.edu.modules.qa.util;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Utility: SecurityUtil
 * Các hàm tiện ích liên quan đến security và user info
 */
@Component

public class SecurityUtil {
    
    /**
     * Lấy ID của user hiện tại từ SecurityContext
     * @return Long - User ID hoặc null nếu không authenticated
     */
    public static Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        
        try {
            // Giả sử user ID được lưu trong authentication name hoặc principal
            // Điều này cần điều chỉnh tùy theo cách lưu user info trong JWT
            return Long.valueOf(auth.getName());
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    /**
     * Kiểm tra user hiện tại có được xác thực không
     * @return boolean
     */
    public static boolean isAuthenticated() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated();
    }
    
    /**
     * Lấy username của user hiện tại
     * @return String - Username hoặc null
     */
    public static String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        
        return auth.getName();
    }
    
    /**
     * Kiểm tra user có role nào đó không
     * @param role Tên role
     * @return boolean
     */
    public static boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }
        
        return auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role));
    }
}
