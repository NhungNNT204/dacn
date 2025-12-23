package com.upnest.edu.modules.group.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.upnest.edu.modules.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * GroupMember Entity - Đại diện cho member tham gia trong group
 * Theo dõi vai trò, ngày tham gia, permission của member
 */
@Entity
@Table(name = "group_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"group_id", "user_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * Group mà member tham gia
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id")
    private Group group;

    /**
     * User (member)
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * Vai trò trong nhóm
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private GroupMemberRole role = GroupMemberRole.MEMBER;

    /**
     * Ngày tham gia
     */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    /**
     * Đã bị xóa khỏi nhóm hay bỏ nhóm
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    /**
     * Đã mute notification từ nhóm
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isMuted = false;

    /**
     * Kiểm tra member có phải admin không
     */
    public Boolean isAdmin() {
        return GroupMemberRole.ADMIN.equals(role);
    }

    /**
     * Kiểm tra member có phải moderator không
     */
    public Boolean isModerator() {
        return GroupMemberRole.MODERATOR.equals(role) || isAdmin();
    }

    /**
     * Kiểm tra member có thể xóa posts không
     */
    public Boolean canDeletePost() {
        return isModerator();
    }
}
