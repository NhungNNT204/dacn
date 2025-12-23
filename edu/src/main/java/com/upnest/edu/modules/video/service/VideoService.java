package com.upnest.edu.modules.video.service;

import com.upnest.edu.modules.video.entity.*;
import com.upnest.edu.modules.video.repository.*;
import com.upnest.edu.modules.video.payload.*;
import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoService {

    private final VideoRepository videoRepository;
    private final VideoCommentRepository videoCommentRepository;
    private final UserRepository userRepository;

    // ==================== VIDEO CRUD ====================

    private static List<String> parseArrayString(String raw) {
        if (raw == null) return new ArrayList<>();
        String trimmed = raw.trim();
        if (trimmed.isEmpty() || "[]".equals(trimmed)) return new ArrayList<>();
        String content = trimmed.replaceAll("^[\\[]|[\\]]$", "");
        if (content.trim().isEmpty()) return new ArrayList<>();
        return new ArrayList<>(Arrays.asList(content.split(",\\s*")));
    }

    private static String toArrayString(List<String> list) {
        if (list == null) return "[]";
        return list.toString();
    }

    @Transactional
    public VideoDTO createVideo(CreateVideoRequest request, String userId) {
        Long uid = Long.valueOf(userId);
        User user = userRepository.findById(uid)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Video video = Video.builder()
            .id(UUID.randomUUID().toString())
            .title(request.getTitle())
            .description(request.getDescription())
            .videoUrl(request.getVideoUrl())
            .thumbnail(request.getThumbnail())
            .creator(user)
            .duration(request.getDuration())
            .category(request.getCategory())
            .level(request.getLevel())
            .language(request.getLanguage())
            .tags(toArrayString(request.getTags()))
            .status(VideoStatus.DRAFT)
            .viewCount(0L)
            .likeCount(0L)
            .shareCount(0L)
            .commentCount(0L)
            .rating(0.0)
            .isDeleted(false)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        video = videoRepository.save(video);
        log.info("Created video: {}", video.getId());
        return mapToDTO(video);
    }

    @Transactional
    public VideoDTO updateVideo(String videoId, UpdateVideoRequest request, String userId) {
        Video video = getVideoById(videoId);
        
        if (!String.valueOf(video.getCreator().getId()).equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setCategory(request.getCategory());
        video.setLevel(request.getLevel());
        video.setLanguage(request.getLanguage());
        video.setTags(toArrayString(request.getTags()));
        video.setUpdatedAt(LocalDateTime.now());

        video = videoRepository.save(video);
        log.info("Updated video: {}", videoId);
        return mapToDTO(video);
    }

    @Transactional
    public void deleteVideo(String videoId, String userId) {
        Video video = getVideoById(videoId);
        
        if (!String.valueOf(video.getCreator().getId()).equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        video.setIsDeleted(true);
        video.setUpdatedAt(LocalDateTime.now());
        videoRepository.save(video);
        log.info("Deleted video: {}", videoId);
    }

    @Transactional(readOnly = true)
    public VideoDetailDTO getVideoDetail(String videoId, String userId) {
        Video video = getVideoById(videoId);
        
        // Increment view count
        video.incrementViews();
        videoRepository.save(video);

        return mapToDetailDTO(video, userId);
    }

    @Transactional(readOnly = true)
    public Page<VideoDTO> getAllVideos(Pageable pageable) {
        return videoRepository
            .findAll(pageable)
            .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<VideoDTO> getVideosByCategory(VideoCategory category, Pageable pageable) {
        return videoRepository
            .findByCategoryAndStatusAndIsDeletedFalseOrderByViewCountDesc(category, VideoStatus.PUBLISHED, pageable)
            .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<VideoDTO> getVideosByLevel(VideoLevel level, Pageable pageable) {
        return videoRepository
            .findByLevelAndStatusAndIsDeletedFalseOrderByCreatedAtDesc(level, VideoStatus.PUBLISHED, pageable)
            .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<VideoDTO> getVideosByCreator(String creatorId, Pageable pageable) {
        return videoRepository
            .findByCreatorIdAndIsDeletedFalseOrderByCreatedAtDesc(creatorId, pageable)
            .map(this::mapToDTO);
    }

    // ==================== VIDEO DISCOVERY ====================

    @Transactional(readOnly = true)
    public Page<VideoDTO> getTrendingVideos(Pageable pageable) {
        return videoRepository
            .findTrendingVideos(pageable)
            .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<VideoDTO> getPopularVideos(Pageable pageable) {
        return videoRepository
            .findPopularVideos(pageable)
            .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<VideoDTO> getRecentVideos(Pageable pageable) {
        return videoRepository
            .findRecentVideos(pageable)
            .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<VideoDTO> getTrendingByCategory(VideoCategory category, Pageable pageable) {
        return videoRepository
            .findByCategoryTrending(category, pageable)
            .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<VideoDTO> searchVideos(String keyword, Pageable pageable) {
        return videoRepository
            .findByTitleContainingIgnoreCaseAndStatusAndIsDeletedFalse(
                keyword, VideoStatus.PUBLISHED, pageable)
            .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<VideoDTO> getRecommendations(String videoId, Pageable pageable) {
        return videoRepository
            .findRecommendations(videoId, pageable)
            .map(this::mapToDTO);
    }

    // ==================== VIDEO PUBLISH ====================

    @Transactional
    public VideoDTO publishVideo(String videoId, String userId) {
        Video video = getVideoById(videoId);

        if (!String.valueOf(video.getCreator().getId()).equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        video.setStatus(VideoStatus.PUBLISHED);
        video.setUpdatedAt(LocalDateTime.now());
        video = videoRepository.save(video);
        log.info("Published video: {}", videoId);
        return mapToDTO(video);
    }

    @Transactional
    public VideoDTO archiveVideo(String videoId, String userId) {
        Video video = getVideoById(videoId);

        if (!String.valueOf(video.getCreator().getId()).equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        video.setStatus(VideoStatus.ARCHIVED);
        video.setUpdatedAt(LocalDateTime.now());
        video = videoRepository.save(video);
        log.info("Archived video: {}", videoId);
        return mapToDTO(video);
    }

    // ==================== LIKE FUNCTIONALITY ====================

    @Transactional
    public VideoDTO likeVideo(String videoId, String userId) {
        Video video = getVideoById(videoId);
        Long uid = Long.valueOf(userId);
        userRepository.findById(uid).orElseThrow(() -> new RuntimeException("User not found"));
        List<String> likedUsers = parseArrayString(video.getLikedByUsers());
        if (!likedUsers.contains(userId)) {
            likedUsers.add(userId);
            video.setLikedByUsers(toArrayString(likedUsers));
            video.incrementLikes();
            video.setUpdatedAt(LocalDateTime.now());
            video = videoRepository.save(video);
            log.info("User {} liked video {}", userId, videoId);
        }

        return mapToDTO(video);
    }

    @Transactional
    public VideoDTO unlikeVideo(String videoId, String userId) {
        Video video = getVideoById(videoId);

        List<String> likedUsers = parseArrayString(video.getLikedByUsers());
        if (likedUsers.remove(userId)) {
            video.setLikedByUsers(toArrayString(likedUsers));
            video.decrementLikes();
            video.setUpdatedAt(LocalDateTime.now());
            video = videoRepository.save(video);
            log.info("User {} unliked video {}", userId, videoId);
        }

        return mapToDTO(video);
    }

    @Transactional(readOnly = true)
    public boolean isVideoLikedByUser(String videoId, String userId) {
        Video video = getVideoById(videoId);
        return parseArrayString(video.getLikedByUsers()).contains(userId);
    }

    // ==================== COMMENT FUNCTIONALITY ====================

    @Transactional
    public VideoCommentDTO addComment(String videoId, CreateCommentRequest request, String userId) {
        Video video = getVideoById(videoId);
        Long uid = Long.valueOf(userId);
        User user = userRepository.findById(uid)
            .orElseThrow(() -> new RuntimeException("User not found"));

        VideoComment comment = VideoComment.builder()
            .id(UUID.randomUUID().toString())
            .video(video)
            .author(user)
            .content(request.getContent())
            .likeCount(0L)
            .isEdited(false)
            .isDeleted(false)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        comment = videoCommentRepository.save(comment);
        video.incrementCommentCount();
        videoRepository.save(video);
        
        log.info("Added comment to video {}", videoId);
        return mapCommentToDTO(comment);
    }

    @Transactional
    public VideoCommentDTO replyToComment(String videoId, String parentCommentId, 
                                          CreateCommentRequest request, String userId) {
        Video video = getVideoById(videoId);
        VideoComment parentComment = getCommentById(parentCommentId);
        Long uid = Long.valueOf(userId);
        User user = userRepository.findById(uid)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!parentComment.getVideo().getId().equals(videoId)) {
            throw new RuntimeException("Comment doesn't belong to this video");
        }

        VideoComment reply = VideoComment.builder()
            .id(UUID.randomUUID().toString())
            .video(video)
            .author(user)
            .parentComment(parentComment)
            .content(request.getContent())
            .likeCount(0L)
            .isEdited(false)
            .isDeleted(false)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        reply = videoCommentRepository.save(reply);
        video.incrementCommentCount();
        videoRepository.save(video);

        log.info("Added reply to comment {}", parentCommentId);
        return mapCommentToDTO(reply);
    }

    @Transactional
    public VideoCommentDTO updateComment(String commentId, UpdateCommentRequest request, String userId) {
        VideoComment comment = getCommentById(commentId);

        if (!String.valueOf(comment.getAuthor().getId()).equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        comment.setContent(request.getContent());
        comment.setIsEdited(true);
        comment.setUpdatedAt(LocalDateTime.now());
        comment = videoCommentRepository.save(comment);

        log.info("Updated comment: {}", commentId);
        return mapCommentToDTO(comment);
    }

    @Transactional
    public void deleteComment(String commentId, String userId) {
        VideoComment comment = getCommentById(commentId);

        if (!String.valueOf(comment.getAuthor().getId()).equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        comment.setIsDeleted(true);
        comment.setUpdatedAt(LocalDateTime.now());
        videoCommentRepository.save(comment);

        Video video = comment.getVideo();
        video.decrementCommentCount();
        videoRepository.save(video);

        log.info("Deleted comment: {}", commentId);
    }

    @Transactional(readOnly = true)
    public Page<VideoCommentDTO> getVideoComments(String videoId, Pageable pageable) {
        // Get top-level comments
        return videoCommentRepository
            .findByVideoIdAndIsDeletedFalseOrderByCreatedAtDesc(videoId, pageable)
            .map(this::mapCommentToDTO);
    }

    @Transactional(readOnly = true)
    public List<VideoCommentDTO> getCommentReplies(String parentCommentId) {
        return videoCommentRepository
            .findByParentCommentIdAndIsDeletedFalseOrderByCreatedAtAsc(
                parentCommentId, Pageable.unpaged())
            .getContent()
            .stream()
            .map(this::mapCommentToDTO)
            .collect(Collectors.toList());
    }

    // ==================== COMMENT LIKES ====================

    @Transactional
    public VideoCommentDTO likeComment(String commentId, String userId) {
        VideoComment comment = getCommentById(commentId);

        List<String> likedUsers = parseArrayString(comment.getLikedByUsers());
        if (!likedUsers.contains(userId)) {
            likedUsers.add(userId);
            comment.setLikedByUsers(toArrayString(likedUsers));
            comment.incrementLikes();
            comment.setUpdatedAt(LocalDateTime.now());
            comment = videoCommentRepository.save(comment);
            log.info("User {} liked comment {}", userId, commentId);
        }

        return mapCommentToDTO(comment);
    }

    @Transactional
    public VideoCommentDTO unlikeComment(String commentId, String userId) {
        VideoComment comment = getCommentById(commentId);

        List<String> likedUsers = parseArrayString(comment.getLikedByUsers());
        if (likedUsers.remove(userId)) {
            comment.setLikedByUsers(toArrayString(likedUsers));
            comment.decrementLikes();
            comment.setUpdatedAt(LocalDateTime.now());
            comment = videoCommentRepository.save(comment);
            log.info("User {} unliked comment {}", userId, commentId);
        }

        return mapCommentToDTO(comment);
    }

    // ==================== HELPER METHODS ====================

    private Video getVideoById(String videoId) {
        return videoRepository.findById(videoId)
            .filter(v -> !v.getIsDeleted())
            .orElseThrow(() -> new RuntimeException("Video not found"));
    }

    private VideoComment getCommentById(String commentId) {
        return videoCommentRepository.findById(commentId)
            .filter(c -> !c.getIsDeleted())
            .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    // ==================== MAPPING ====================

    private VideoDTO mapToDTO(Video video) {
        return VideoDTO.builder()
            .id(video.getId())
            .title(video.getTitle())
            .thumbnail(video.getThumbnail())
            .duration(video.getDuration())
            .category(video.getCategory())
            .level(video.getLevel())
            .creatorId(String.valueOf(video.getCreator().getId()))
            .creatorName(video.getCreator().getFullName())
            .creatorAvatar(video.getCreator().getAvatarUrl())
            .viewCount(video.getViewCount())
            .likeCount(video.getLikeCount())
            .commentCount(video.getCommentCount())
            .rating(video.getRating())
            .createdAt(video.getCreatedAt())
            .status(video.getStatus())
            .build();
    }

    private VideoDetailDTO mapToDetailDTO(Video video, String userId) {
        User creator = video.getCreator();
        boolean isLiked = parseArrayString(video.getLikedByUsers()).contains(userId);

        return VideoDetailDTO.builder()
            .id(video.getId())
            .title(video.getTitle())
            .description(video.getDescription())
            .videoUrl(video.getVideoUrl())
            .thumbnail(video.getThumbnail())
            .duration(video.getDuration())
            .category(video.getCategory())
            .level(video.getLevel())
            .language(video.getLanguage())
            .tags(parseArrayString(video.getTags()))
            .creatorId(String.valueOf(creator.getId()))
            .creatorName(creator.getFullName())
            .creatorAvatar(creator.getAvatarUrl())
            .creatorBio(creator.getUserProfile() != null ? creator.getUserProfile().getBio() : null)
            .viewCount(video.getViewCount())
            .likeCount(video.getLikeCount())
            .shareCount(video.getShareCount())
            .commentCount(video.getCommentCount())
            .rating(video.getRating())
            .isLiked(isLiked)
            .createdAt(video.getCreatedAt())
            .updatedAt(video.getUpdatedAt())
            .status(video.getStatus())
            .build();
    }

    private VideoCommentDTO mapCommentToDTO(VideoComment comment) {
        return VideoCommentDTO.builder()
            .id(comment.getId())
            .videoId(comment.getVideo().getId())
            .authorId(String.valueOf(comment.getAuthor().getId()))
            .authorName(comment.getAuthor().getFullName())
            .authorAvatar(comment.getAuthor().getAvatarUrl())
            .content(comment.getContent())
            .likeCount(comment.getLikeCount())
            .isEdited(comment.getIsEdited())
            .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
            .createdAt(comment.getCreatedAt())
            .updatedAt(comment.getUpdatedAt())
            .build();
    }
}
