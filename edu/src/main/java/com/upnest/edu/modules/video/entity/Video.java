package com.upnest.edu.modules.video.entity;

import com.upnest.edu.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Video Entity - Đại diện cho một video trong hệ thống
 * Hỗ trợ xem, like, comment video
 */
@Entity
@Table(name = "videos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * Tên video (150 ký tự)
     */
    @Column(nullable = false, length = 200)
    private String title;

    /**
     * Mô tả video (2000 ký tự)
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * URL video (từ YouTube, Vimeo, hoặc server)
     */
    @Column(nullable = false)
    private String videoUrl;

    /**
     * Thumbnail/Cover image
     */
    @Column
    private String thumbnail;

    /**
     * Tác giả/Creator video
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creator_id")
    private User creator;

    /**
     * Thời lượng video (in seconds)
     */
    @Column
    private Long duration;

    /**
     * Danh mục: EDUCATION, TUTORIAL, ENTERTAINMENT, MUSIC, SPORTS, etc
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VideoCategory category;

    /**
     * Cấp độ: BEGINNER, INTERMEDIATE, ADVANCED
     */
    @Enumerated(EnumType.STRING)
    private VideoLevel level;

    /**
     * Danh sách comments
     */
    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<VideoComment> comments = new HashSet<>();

    /**
     * Số lượng comment
     */
    @Column(nullable = false)
    @Builder.Default
    private Long commentCount = 0L;

    /**
     * Số lượt xem
     */
    @Column(nullable = false)
    @Builder.Default
    private Long viewCount = 0L;

    /**
     * Số lượt like
     */
    @Column(nullable = false)
    @Builder.Default
    private Long likeCount = 0L;

    /**
     * Số lượt chia sẻ
     */
    @Column(nullable = false)
    @Builder.Default
    private Long shareCount = 0L;

    /**
     * User IDs đã like (JSON array)
     */
    @Column(columnDefinition = "TEXT")
    @Builder.Default
    private String likedByUsers = "[]";

    /**
     * Thẻ/Tags (JSON array)
     */
    @Column(columnDefinition = "TEXT")
    private String tags;

    /**
     * Trạng thái: DRAFT, PUBLISHED, ARCHIVED
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VideoStatus status = VideoStatus.PUBLISHED;

    /**
     * Video có bị xóa không
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    /**
     * Ngôn ngữ video
     */
    @Column(length = 20)
    @Builder.Default
    private String language = "vi";

    /**
     * Rating trung bình (0.0 - 5.0)
     */
    @Column
    @Builder.Default
    private Double rating = 0.0;

    /**
     * Ngày tạo
     */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Ngày cập nhật
     */
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Increment view count
     */
    public void incrementViews() {
        viewCount++;
    }

    /**
     * Increment like count
     */
    public void incrementLikes() {
        likeCount++;
    }

    /**
     * Decrement like count
     */
    public void decrementLikes() {
        if (likeCount > 0) {
            likeCount--;
        }
    }

    /**
     * Add comment
     */
    public void addComment(VideoComment comment) {
        comments.add(comment);
        commentCount++;
    }

    /**
     * Remove comment
     */
    public void removeComment(VideoComment comment) {
        comments.remove(comment);
        commentCount--;
    }

    /**
     * Increment comment count (used by services that don't manage comment collection)
     */
    public void incrementCommentCount() {
        commentCount++;
    }

    /**
     * Decrement comment count (used by services that don't manage comment collection)
     */
    public void decrementCommentCount() {
        if (commentCount > 0) {
            commentCount--;
        }
    }
}
