package com.upnest.edu.modules.group.payload;

import com.upnest.edu.modules.group.entity.GroupMemberRole;
import com.upnest.edu.modules.group.entity.GroupType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * GroupPayload - This file serves as a package marker.
 * All Group-related DTOs have been moved to individual files.
 */

/**
 * Cập nhật vai trò member
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupMemberRoleUpdateRequest {
    private GroupMemberRole role;
}

// ==================== RESPONSE DTOs ====================

/**
 * Group DTO - Thông tin cơ bản nhóm
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupDTO {
    private String id;
    private String name;
    private String description;
    private String coverImage;
    private GroupType groupType;
    private String category;
    private Long memberCount;
    private Long postCount;
    private Boolean isOwner;
    private Boolean isMember;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

/**
 * Group Detail DTO - Chi tiết nhóm kèm owner info
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupDetailDTO {
    private String id;
    private String name;
    private String description;
    private String coverImage;
    private String rules;
    private GroupType groupType;
    private String category;
    private String language;
    private Long memberCount;
    private Long postCount;
    private UserMinimalDTO owner;
    private Boolean isOwner;
    private Boolean isMember;
    private Boolean isMuted;
    private GroupMemberRole userRole;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

/**
 * Group Member DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupMemberDTO {
    private String id;
    private UserMinimalDTO user;
    private GroupMemberRole role;
    private LocalDateTime joinedAt;
    private Boolean isActive;
}

/**
 * Group Post DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupPostDTO {
    private String id;
    private String groupId;
    private String groupName;
    private UserMinimalDTO author;
    private String content;
    private String mediaIds;
    private Long likeCount;
    private Long commentCount;
    private Boolean userLiked;
    private Boolean isApproved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

/**
 * Group Comment DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupCommentDTO {
    private String id;
    private UserMinimalDTO author;
    private String content;
    private Long likeCount;
    private Boolean userLiked;
    private Boolean isEdited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

/**
 * User Minimal DTO - Thông tin user cơ bản
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class UserMinimalDTO {
    private String id;
    private String name;
    private String avatar;
    private String role;
}

/**
 * Phản hồi tạo nhóm
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupCreateResponse {
    private String message;
    private String groupId;
    private GroupDTO group;
}

/**
 * Phản hồi danh sách nhóm
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupListResponse {
    private List<GroupDTO> content;
    private Long totalElements;
    private Integer totalPages;
    private Integer currentPage;
}

/**
 * Phản hồi danh sách member
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupMembersResponse {
    private List<GroupMemberDTO> members;
    private Long totalElements;
    private Integer totalPages;
}

/**
 * Phản hồi danh sách bài viết
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupPostsResponse {
    private List<GroupPostDTO> posts;
    private Long totalElements;
    private Integer totalPages;
}

/**
 * Phản hồi danh sách comment
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupCommentsResponse {
    private List<GroupCommentDTO> comments;
    private Long totalElements;
    private Integer totalPages;
}

/**
 * Thống kê nhóm
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupStatsDTO {
    private String groupId;
    private Long memberCount;
    private Long postCount;
    private Long commentCount;
    private Long totalLikes;
    private Double activeRatio;
}

/**
 * Gợi ý nhóm
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class GroupSuggestionDTO {
    private String id;
    private String name;
    private String description;
    private String coverImage;
    private String category;
    private Long memberCount;
    private String reason;
}
