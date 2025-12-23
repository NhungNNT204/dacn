package com.upnest.edu.modules.group.entity;

import com.upnest.edu.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * GroupComment Entity - Comment cho các bài viết trong nhóm
 * Cho phép member comment, reply, like comment
 */
@Entity
@Table(name = "group_comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupComment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * Bài viết chứa comment
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id")
    private GroupPost post;

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
     * Cộng like
     */
    public void incrementLikes() {
        likeCount++;
    }

    /**
     * Trừ like
     */
    public void decrementLikes() {
        if (likeCount > 0) {
            likeCount--;
        }
    }
}
