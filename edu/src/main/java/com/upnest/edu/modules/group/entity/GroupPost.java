package com.upnest.edu.modules.group.entity;

import com.upnest.edu.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * GroupPost Entity - Bài viết trong nhóm
 * Cho phép member đăng bài, comment, like trong nhóm
 */
@Entity
@Table(name = "group_posts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupPost {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * Group chứa bài viết
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id")
    private Group group;

    /**
     * Tác giả bài viết
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id")
    private User author;

    /**
     * Nội dung bài viết
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /**
     * Hình ảnh/Video URLs (JSON array)
     */
    @Column(columnDefinition = "TEXT")
    private String mediaIds;

    /**
     * Danh sách comment
     */
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<GroupComment> comments = new ArrayList<>();

    /**
     * Số lượng comment
     */
    @Column(nullable = false)
    @Builder.Default
    private Long commentCount = 0L;

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
     * Có cần phê duyệt (tùy theo cài đặt nhóm)
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean needsApproval = false;

    /**
     * Đã phê duyệt
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isApproved = true;

    /**
     * Đã bị xóa
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

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
     * Thêm comment
     */
    public void addComment(GroupComment comment) {
        comments.add(comment);
        commentCount++;
    }

    /**
     * Xóa comment
     */
    public void removeComment(GroupComment comment) {
        comments.remove(comment);
        commentCount--;
    }

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
