package com.upnest.edu.modules.social.service;

import com.upnest.edu.modules.social.entity.SocialPostLite;
import com.upnest.edu.modules.social.repository.SocialPostLiteRepository;
import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * SavePostService - Quản lý lưu và bookmark bài viết
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SavePostService {

    private final SocialPostLiteRepository postRepository;
    private final UserRepository userRepository;

    // In-memory storage for saved posts (should use database in production)
    private final Set<String> savedPosts = new HashSet<>();

    /**
     * Lưu bài viết
     */
    public void savePost(Long postId, Long userId) {
        String key = userId + ":" + postId;
        SocialPostLite post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        savedPosts.add(key);
        log.info("User {} saved post {}", userId, postId);
    }

    /**
     * Gỡ bỏ bài viết từ kho lưu
     */
    public void unsavePost(Long postId, Long userId) {
        String key = userId + ":" + postId;
        savedPosts.remove(key);
        log.info("User {} unsaved post {}", userId, postId);
    }

    /**
     * Kiểm tra bài viết có được lưu không
     */
    public boolean isPostSaved(Long postId, Long userId) {
        return savedPosts.contains(userId + ":" + postId);
    }

    /**
     * Toggle save status
     */
    public boolean toggleSave(Long postId, Long userId) {
        if (isPostSaved(postId, userId)) {
            unsavePost(postId, userId);
            log.info("Post {} unsaved by user {}", postId, userId);
            return false;
        } else {
            savePost(postId, userId);
            log.info("Post {} saved by user {}", postId, userId);
            return true;
        }
    }
}
