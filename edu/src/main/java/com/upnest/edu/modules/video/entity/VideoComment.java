package com.upnest.edu.modules.video.entity;

import com.upnest.edu.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * VideoComment Entity - Comment cho video
 */
@Entity
@Table(name = "video_comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoComment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * Video được comment
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "video_id")
    private Video video;

    /**
     * Tác giả comment
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id")
    private User author;

    /**
     * Nội dung comment
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /**
     * Comment cha (nếu là reply)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private VideoComment parentComment;

    /**
     * Số lượt like
     */
    @Column(nullable = false)
    @Builder.Default
    private Long likeCount = 0L;

    /**
     * User IDs đã like (JSON array)
     */
    @Column(columnDefinition = "TEXT")
    @Builder.Default
    private String likedByUsers = "[]";

    /**
     * Đã bị xóa
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    /**
     * Đã chỉnh sửa
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isEdited = false;

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
     * Increment likes
     */
    public void incrementLikes() {
        likeCount++;
    }

    /**
     * Decrement likes
     */
    public void decrementLikes() {
        if (likeCount > 0) {
            likeCount--;
        }
    }
}
