package com.upnest.edu.modules.user.repository;

import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.user.entity.UserRole;
import com.upnest.edu.modules.user.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository: UserRepository
 * Xử lý các truy vấn CRUD cho User
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Tìm user theo username
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Tìm user theo email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Kiểm tra username tồn tại
     */
    boolean existsByUsername(String username);
    
    /**
     * Kiểm tra email tồn tại
     */
    boolean existsByEmail(String email);
    
    /**
     * Tìm user theo role
     */
    Page<User> findByRole(UserRole role, Pageable pageable);
    
    /**
     * Tìm user theo status
     */
    Page<User> findByStatus(UserStatus status, Pageable pageable);
    
    /**
     * Tìm user theo full name (tìm kiếm)
     */
    Page<User> findByFullNameContainingIgnoreCase(String fullName, Pageable pageable);
    
    /**
     * Tìm user theo email verified status
     */
    Page<User> findByIsEmailVerified(Boolean isEmailVerified, Pageable pageable);
    
    /**
     * Tìm user theo full name, email, hoặc phone number
     */
    java.util.List<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(String fullName, String email, String phone);
    
    /**
     * Tìm user và eager load profile
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.userProfile WHERE u.userId = :userId")
    Optional<User> findByIdWithProfile(@Param("userId") Long userId);
}
