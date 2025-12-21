package com.upnest.edu.modules.social.service;

import com.upnest.edu.modules.social.entity.*;
import com.upnest.edu.modules.social.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * FeedService - Xử lý dòng thời gian cá nhân hoá
 * Thuật toán: Ưu tiên bài từ bạn bè, pages, groups, courses theo thứ tự thời gian
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FeedService {
    
    private final PostRepository postRepository;
    private final PostReactionRepository reactionRepository;
    private final PostCommentRepository commentRepository;
    private final PostSaveRepository saveRepository;
    private final PostShareRepository shareRepository;
    private final PostReportRepository reportRepository;
    private final ContentModerationService contentModerationService;
    
    /**
     * Lấy dòng thời gian cá nhân hoá cho user
     */
    public Page<Post> getPersonalizedFeed(Long userId, Pageable pageable) {
        log.info("Getting personalized feed for user: {}", userId);
        return postRepository.findPersonalizedFeed(userId, pageable);
    }
    
    /**
     * Lấy dòng thời gian công khai (trending posts)
     */
    public Page<Post> getTrendingFeed(Pageable pageable) {
        log.info("Getting trending feed");
        return postRepository.findLatestPosts(pageable);
    }
    
    /**
     * Lấy bài đăng được lưu của user
     */
    public Page<Post> getSavedPosts(Long userId, Pageable pageable) {
        log.info("Getting saved posts for user: {}", userId);
        return postRepository.findSavedPostsByUser(userId, pageable);
    }
    
    /**
     * Tạo bài đăng mới với kiểm tra nội dung vi phạm
     */
    public Post createPost(Long authorId, String authorName, String authorAvatar, 
                          String content, PostType postType, 
                          String imageUrl, String videoUrl, String videoThumbnail) {
        log.info("Creating new post from user: {}", authorId);
        
        // Kiểm tra nội dung vi phạm
        ContentModerationService.ViolationResult result = contentModerationService.checkPostContent(
            content, imageUrl, videoUrl
        );
        
        if (!result.isSafe()) {
            log.warn("Post creation rejected due to content violation: {}", result.getMessage());
            // Tạo exception với thông tin chi tiết - sử dụng prefix để controller có thể parse
            String errorMessage = result.getMessage();
            if (result.getFoundKeywords() != null || result.getDetails() != null) {
                // Sử dụng format đặc biệt để controller có thể parse
                String violationInfo = String.format("VIOLATION_DETAILS::%s::%s::%s::%s",
                    errorMessage,
                    result.getViolationType() != null ? result.getViolationType().name() : "",
                    result.getFoundKeywords() != null ? result.getFoundKeywords() : "",
                    result.getDetails() != null ? result.getDetails() : ""
                );
                throw new RuntimeException(violationInfo);
            }
            throw new RuntimeException(errorMessage);
        }
        
        Post post = Post.builder()
                .authorId(authorId)
                .authorName(authorName)
                .authorAvatar(authorAvatar)
                .authorType(AuthorType.USER)
                .content(content)
                .postType(postType)
                .imageUrl(imageUrl)
                .videoUrl(videoUrl)
                .videoThumbnail(videoThumbnail)
                .likeCount(0)
                .commentCount(0)
                .shareCount(0)
                .viewCount(0)
                .isDeleted(false)
                .isHidden(false)
                .build();
        
        return postRepository.save(post);
    }
    
    /**
     * Thêm reaction vào bài đăng
     */
    public PostReaction addReaction(Long postId, Long userId, String userName, 
                                    String userAvatar, ReactionType reactionType) {
        log.info("Adding {} reaction from user {} to post {}", reactionType, userId, postId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Kiểm tra xem user đã react rồi
        Optional<PostReaction> existingReaction = reactionRepository.findByPostIdAndUserId(postId, userId);
        
        if (existingReaction.isPresent()) {
            PostReaction reaction = existingReaction.get();
            // Nếu cùng loại reaction, xóa đi (unlike)
            if (reaction.getReactionType() == reactionType) {
                reactionRepository.delete(reaction);
                post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
                postRepository.save(post);
                return null;
            }
            // Nếu khác loại, cập nhật
            reaction.setReactionType(reactionType);
            return reactionRepository.save(reaction);
        }
        
        // Tạo reaction mới
        PostReaction reaction = PostReaction.builder()
                .post(post)
                .userId(userId)
                .userName(userName)
                .userAvatar(userAvatar)
                .reactionType(reactionType)
                .build();
        
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
        
        return reactionRepository.save(reaction);
    }
    
    /**
     * Hủy like (xóa reaction)
     */
    public void unlikePost(Long postId, Long userId) {
        log.info("User {} unliking post {}", userId, postId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Optional<PostReaction> reaction = reactionRepository.findByPostIdAndUserId(postId, userId);
        if (reaction.isPresent()) {
            reactionRepository.delete(reaction.get());
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
            postRepository.save(post);
        }
    }
    
    /**
     * Lấy reactions của một bài đăng
     */
    public List<PostReaction> getPostReactions(Long postId) {
        return reactionRepository.findByPostId(postId);
    }
    
    /**
     * Lấy reactions theo loại
     */
    public Long getReactionCount(Long postId, ReactionType reactionType) {
        return reactionRepository.countByPostIdAndReactionType(postId, reactionType);
    }
    
    /**
     * Bình luận trên bài đăng
     */
    public PostComment addComment(Long postId, Long userId, String userName, 
                                   String userAvatar, String content, String imageUrl) {
        log.info("Adding comment from user {} to post {}", userId, postId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        PostComment comment = PostComment.builder()
                .post(post)
                .userId(userId)
                .userName(userName)
                .userAvatar(userAvatar)
                .content(content)
                .imageUrl(imageUrl)
                .likeCount(0)
                .isDeleted(false)
                .build();
        
        PostComment saved = commentRepository.save(comment);
        
        // Cập nhật comment count
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);
        
        return saved;
    }
    
    /**
     * Reply bình luận
     */
    public PostComment addReply(Long postId, Long parentCommentId, Long userId, 
                                String userName, String userAvatar, String content) {
        log.info("Adding reply from user {} to comment {}", userId, parentCommentId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        PostComment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        PostComment reply = PostComment.builder()
                .post(post)
                .parentComment(parentComment)
                .userId(userId)
                .userName(userName)
                .userAvatar(userAvatar)
                .content(content)
                .likeCount(0)
                .isDeleted(false)
                .build();
        
        return commentRepository.save(reply);
    }
    
    /**
     * Lấy bình luận chính của bài đăng
     */
    public Page<PostComment> getPostComments(Long postId, Pageable pageable) {
        return commentRepository.findMainCommentsByPostId(postId, pageable);
    }
    
    /**
     * Lấy reply của một bình luận
     */
    public List<PostComment> getCommentReplies(Long commentId) {
        return commentRepository.findRepliesByParentCommentId(commentId);
    }
    
    /**
     * Xóa bình luận (chỉ author của comment hoặc author của post mới được xóa)
     */
    public void deleteComment(Long commentId, Long userId) {
        log.info("User {} deleting comment: {}", userId, commentId);
        PostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Kiểm tra quyền: chỉ author của comment hoặc author của post mới được xóa
        Post post = comment.getPost();
        if (!comment.getUserId().equals(userId) && !post.getAuthorId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this comment");
        }
        
        comment.setIsDeleted(true);
        commentRepository.save(comment);
        
        // Cập nhật comment count của post
        post.setCommentCount(Math.max(0, post.getCommentCount() - 1));
        postRepository.save(post);
    }
    
    /**
     * Chia sẻ bài đăng
     */
    public PostShare sharePost(Long postId, Long userId, String userName, 
                               String shareMessage, ShareType shareType) {
        log.info("Sharing post {} by user {}", postId, userId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        PostShare share = PostShare.builder()
                .post(post)
                .userId(userId)
                .userName(userName)
                .shareMessage(shareMessage)
                .shareType(shareType)
                .build();
        
        post.setShareCount(post.getShareCount() + 1);
        postRepository.save(post);
        
        return shareRepository.save(share);
    }
    
    /**
     * Lưu bài đăng
     */
    public PostSave savePost(Long postId, Long userId) {
        log.info("Saving post {} by user {}", postId, userId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Kiểm tra xem đã lưu chưa
        Optional<PostSave> existingSave = saveRepository.findByPostIdAndUserId(postId, userId);
        if (existingSave.isPresent()) {
            log.warn("Post already saved by user {}", userId);
            return existingSave.get();
        }
        
        PostSave save = PostSave.builder()
                .post(post)
                .userId(userId)
                .build();
        
        return saveRepository.save(save);
    }
    
    /**
     * Bỏ lưu bài đăng
     */
    public void unsavePost(Long postId, Long userId) {
        log.info("Unsaving post {} by user {}", postId, userId);
        saveRepository.deleteByPostIdAndUserId(postId, userId);
    }
    
    /**
     * Kiểm tra bài đăng đã được lưu
     */
    public Boolean isPostSaved(Long postId, Long userId) {
        return saveRepository.existsByPostIdAndUserId(postId, userId);
    }
    
    /**
     * Báo cáo bài đăng
     */
    public PostReport reportPost(Long postId, Long reporterId, String reporterName, 
                                 ReportType reportType, String reason) {
        log.info("Reporting post {} by user {}", postId, reporterId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Kiểm tra xem đã báo cáo rồi
        if (reportRepository.hasUserReportedPost(postId, reporterId)) {
            log.warn("User {} already reported post {}", reporterId, postId);
            throw new RuntimeException("You already reported this post");
        }
        
        PostReport report = PostReport.builder()
                .post(post)
                .reporterId(reporterId)
                .reporterName(reporterName)
                .reportType(reportType)
                .reason(reason)
                .status(ReportStatus.PENDING)
                .build();
        
        return reportRepository.save(report);
    }
    
    /**
     * Ẩn bài đăng (cho user cụ thể)
     */
    public void hidePost(Long postId, Long userId) {
        log.info("User {} hiding post {}", userId, postId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Lưu danh sách user đã ẩn bài này (JSON format)
        String hiddenUsers = post.getHiddenByUsers();
        List<Long> hiddenUserList = new ArrayList<>();
        
        // Parse JSON array string thành List
        if (hiddenUsers != null && !hiddenUsers.trim().isEmpty() && !hiddenUsers.equals("[]")) {
            try {
                // Remove brackets and split by comma
                String content = hiddenUsers.replace("[", "").replace("]", "").trim();
                if (!content.isEmpty()) {
                    String[] ids = content.split(",");
                    for (String id : ids) {
                        id = id.trim();
                        if (!id.isEmpty()) {
                            hiddenUserList.add(Long.parseLong(id));
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Error parsing hiddenByUsers JSON: {}", hiddenUsers, e);
                hiddenUserList = new ArrayList<>();
            }
        }
        
        // Thêm userId vào danh sách nếu chưa có
        if (!hiddenUserList.contains(userId)) {
            hiddenUserList.add(userId);
            // Convert List back to JSON array string
            post.setHiddenByUsers("[" + hiddenUserList.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(",")) + "]");
            postRepository.save(post);
        }
    }
    
    /**
     * Xóa bài đăng (soft delete)
     */
    public void deletePost(Long postId, Long userId) {
        log.info("User {} deleting post {}", userId, postId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getAuthorId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this post");
        }
        
        post.setIsDeleted(true);
        postRepository.save(post);
    }
    
    /**
     * Tìm kiếm bài đăng
     */
    public Page<Post> searchPosts(String keyword, Pageable pageable) {
        log.info("Searching posts with keyword: {}", keyword);
        return postRepository.searchPosts(keyword, pageable);
    }
    
    /**
     * Lấy thống kê của bài đăng
     */
    public Map<String, Object> getPostStats(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("postId", postId);
        stats.put("likes", post.getLikeCount());
        stats.put("comments", post.getCommentCount());
        stats.put("shares", post.getShareCount());
        stats.put("views", post.getViewCount());
        
        // Reaction breakdown
        Map<String, Long> reactionCounts = new HashMap<>();
        for (ReactionType type : ReactionType.values()) {
            reactionCounts.put(type.name(), reactionRepository.countByPostIdAndReactionType(postId, type));
        }
        stats.put("reactionBreakdown", reactionCounts);
        
        return stats;
    }
}
