package com.upnest.edu.modules.group.entity;

import com.upnest.edu.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Group Entity - Đại diện cho một nhóm cộng đồng
 * Hỗ trợ tạo, quản lý nhóm và member
 */
@Entity
@Table(name = "groups")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * Tên nhóm (50 ký tự)
     */
    @Column(nullable = false, length = 100)
    private String name;

    /**
     * Mô tả nhóm (500 ký tự)
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Hình ảnh bìa nhóm
     */
    @Column
    private String coverImage;

    /**
     * Loại nhóm: PUBLIC, PRIVATE, CLOSED
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GroupType groupType;

    /**
     * Chủ nhóm (Owner)
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id")
    private User owner;

    /**
     * Danh sách member
     */
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<GroupMember> members = new HashSet<>();

    /**
     * Danh sách bài viết trong nhóm
     */
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<GroupPost> posts = new HashSet<>();

    /**
     * Số lượng member
     */
    @Column(nullable = false)
    @Builder.Default
    private Long memberCount = 1L;

    /**
     * Số lượng bài viết
     */
    @Column(nullable = false)
    @Builder.Default
    private Long postCount = 0L;

    /**
     * Đã bị khóa/xóa
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    /**
     * Quy tắc nhóm
     */
    @Column(columnDefinition = "TEXT")
    private String rules;

    /**
     * Chủ đề/Danh mục
     */
    @Column(length = 100)
    private String category;

    /**
     * Ngôn ngữ nhóm
     */
    @Column(length = 20)
    @Builder.Default
    private String language = "vi";

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
     * Thêm member vào nhóm
     */
    public void addMember(GroupMember member) {
        members.add(member);
        memberCount++;
    }

    /**
     * Xóa member khỏi nhóm
     */
    public void removeMember(GroupMember member) {
        members.remove(member);
        memberCount--;
    }

    /**
     * Thêm bài viết
     */
    public void addPost(GroupPost post) {
        posts.add(post);
        postCount++;
    }

    /**
     * Xóa bài viết
     */
    public void removePost(GroupPost post) {
        posts.remove(post);
        postCount--;
    }

    /**
     * Kiểm tra user có phải owner không
     */
    public Boolean isOwner(User user) {
        return owner != null && owner.getId().equals(user.getId());
    }
}
