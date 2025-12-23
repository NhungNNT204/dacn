package com.upnest.edu.modules.social.service;

import com.upnest.edu.modules.social.entity.SocialCommentLite;
import com.upnest.edu.modules.social.entity.SocialPostLite;
import com.upnest.edu.modules.social.repository.SocialCommentLiteRepository;
import com.upnest.edu.modules.social.repository.SocialPostLiteRepository;
import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * PostCommentService - Quản lý bình luận đa cấp trên bài viết
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PostCommentService {

    private final SocialCommentLiteRepository commentRepository;
    private final SocialPostLiteRepository postRepository;
    private final UserRepository userRepository;

    /**
     * Tạo bình luận mới
     */
    public SocialCommentLite createComment(Long postId, Long userId, String content) {
        SocialPostLite post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SocialCommentLite comment = SocialCommentLite.builder()
                .postId(postId)
                .post(post)
                .userId(userId)
                .userName(user.getFullName())
                .userAvatar("")
                .content(content)
                .parentId(null)
                .createdAt(LocalDateTime.now())
                .build();

        log.info("Comment created by user {} on post {}", userId, postId);
        return commentRepository.save(comment);
    }

    /**
     * Trả lời một bình luận (Reply to comment)
     */
    public SocialCommentLite createReply(Long parentCommentId, Long userId, String content) {
        SocialCommentLite parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SocialCommentLite reply = SocialCommentLite.builder()
                .postId(parentComment.getPostId())
                .post(parentComment.getPost())
                .userId(userId)
                .userName(user.getFullName())
                .userAvatar("")
                .content(content)
                .parentId(parentCommentId)
                .createdAt(LocalDateTime.now())
                .build();

        log.info("Reply created by user {} to comment {}", userId, parentCommentId);
        return commentRepository.save(reply);
    }

    /**
     * Lấy tất cả bình luận của bài viết
     */
    public List<SocialCommentLite> getCommentsByPost(Long postId, Pageable pageable) {
        return commentRepository.findByPostId(postId);
    }

    /**
     * Lấy tất cả replies của một bình luận
     */
    public List<SocialCommentLite> getReplies(Long parentCommentId) {
        return commentRepository.findByParentId(parentCommentId);
    }

    /**
     * Xóa bình luận
     */
    public void deleteComment(Long commentId) {
        SocialCommentLite comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Delete all replies first
        List<SocialCommentLite> replies = commentRepository.findByParentId(commentId);
        commentRepository.deleteAll(replies);
        
        // Delete the comment
        commentRepository.delete(comment);
        log.info("Comment {} and its replies deleted", commentId);
    }

    /**
     * Cập nhật bình luận
     */
    public SocialCommentLite updateComment(Long commentId, String content) {
        SocialCommentLite comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setContent(content);
        log.info("Comment {} updated", commentId);
        return commentRepository.save(comment);
    }
}
