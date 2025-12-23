package com.upnest.edu.modules.social.service;

import com.upnest.edu.modules.social.entity.*;
import com.upnest.edu.modules.social.repository.*;
import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * PostService - Quản lý tất cả hoạt động bài viết trong cộng đồng
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final SocialPostLiteRepository postRepository;
    private final UserRepository userRepository;

    // --- CREATE POST ---
    public SocialPostLite createPost(Long userId, String content, String imageUrl, String location, String music, List<String> tags) {
        log.info("Creating post for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SocialPostLite post = SocialPostLite.builder()
                .author(user)
                .userId(userId)
                .authorName(user.getFullName())
                .authorAvatar("")
                .content(content)
                .imageUrl(imageUrl)
                .musicTitle(music)
                .likes(new HashSet<>())
                .createdAt(LocalDateTime.now())
                .build();

        return postRepository.save(post);
    }

    // --- GET POSTS ---
    public Page<SocialPostLite> getFeed(Pageable pageable) {
        log.info("Fetching feed with pagination");
        return postRepository.findByDeletedFalseAndHiddenFalse(pageable);
    }

    public Page<SocialPostLite> searchPosts(String keyword, Pageable pageable) {
        log.info("Searching posts with keyword: {}", keyword);
        return postRepository.findByContentContainingIgnoreCaseOrAuthorNameContainingIgnoreCase(keyword, pageable);
    }

    public SocialPostLite getPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found: " + postId));
    }

    // --- LIKE POST ---
    public void toggleLike(Long postId, Long userId) {
        SocialPostLite post = getPostById(postId);
        if (post.getLikes().contains(userId)) {
            post.getLikes().remove(userId);
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
        } else {
            post.getLikes().add(userId);
            post.setLikeCount(post.getLikeCount() + 1);
        }
        postRepository.save(post);
        log.info("User {} toggled like on post {}", userId, postId);
    }

    public void likePost(Long postId, Long userId) {
        SocialPostLite post = getPostById(postId);
        if (!post.getLikes().contains(userId)) {
            post.getLikes().add(userId);
            post.setLikeCount(post.getLikeCount() + 1);
            postRepository.save(post);
            log.info("User {} liked post {}, total likes: {}", userId, postId, post.getLikeCount());
        }
    }

    public void unlikePost(Long postId, Long userId) {
        SocialPostLite post = getPostById(postId);
        if (post.getLikes().remove(userId)) {
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
            postRepository.save(post);
            log.info("User {} unliked post {}, total likes: {}", userId, postId, post.getLikeCount());
        }
    }

    // --- HIDE POST ---
    public void hidePost(Long postId, Long userId) {
        SocialPostLite post = getPostById(postId);
        post.setHidden(true);
        postRepository.save(post);
        log.info("Post {} hidden by user {}", postId, userId);
    }

    // --- SHARE POST ---
    public SocialPostLite sharePost(Long postId, Long userId, String customMessage) {
        SocialPostLite original = getPostById(postId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String sharedContent = customMessage != null ? customMessage : "";
        sharedContent += "\n\n[Chia sẻ từ " + original.getAuthorName() + "]: " + original.getContent();

        SocialPostLite shared = SocialPostLite.builder()
                .author(user)
                .userId(userId)
                .authorName(user.getFullName())
                .authorAvatar("")
                .content(sharedContent)
                .imageUrl(original.getImageUrl())
                .originalPostId(original.getId())
                .likes(new HashSet<>())
                .createdAt(LocalDateTime.now())
                .build();

        log.info("Post {} shared by user {}", postId, userId);
        return postRepository.save(shared);
    }

    // --- DELETE POST ---
    public void deletePost(Long postId) {
        SocialPostLite post = getPostById(postId);
        post.setDeleted(true);
        postRepository.save(post);
        log.info("Post {} deleted", postId);
    }

    // --- UPDATE POST ---
    public SocialPostLite updatePost(Long postId, String content, String imageUrl) {
        SocialPostLite post = getPostById(postId);
        post.setContent(content);
        post.setImageUrl(imageUrl);
        log.info("Post {} updated", postId);
        return postRepository.save(post);
    }
}
