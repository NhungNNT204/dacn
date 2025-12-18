package com.upnest.edu.modules.group.controller;

import com.upnest.edu.modules.auth.entity.User;
import com.upnest.edu.modules.group.entity.*;
import com.upnest.edu.modules.group.payload.*;
import com.upnest.edu.modules.group.service.GroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * GroupController - REST API endpoints cho nhóm
 * Quản lý: Groups, Members, Posts, Comments
 */
@RestController
@RequestMapping("/api/v1/groups")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class GroupController {

    private final GroupService groupService;

    // ==================== GROUP ENDPOINTS ====================

    /**
     * [GET] /api/v1/groups - Lấy danh sách nhóm công khai
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllGroups(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Group> groups = groupService.getPublicGroups(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", groups.getContent());
        response.put("totalElements", groups.getTotalElements());
        response.put("totalPages", groups.getTotalPages());
        response.put("currentPage", page);

        return ResponseEntity.ok(response);
    }

    /**
     * [GET] /api/v1/groups/trending - Lấy nhóm trending
     */
    @GetMapping("/trending")
    public ResponseEntity<Page<Group>> getTrendingGroups(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Group> trending = groupService.getTrendingGroups(pageable);
        return ResponseEntity.ok(trending);
    }

    /**
     * [GET] /api/v1/groups/search - Tìm kiếm nhóm theo keyword
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchGroups(
        @RequestParam(required = false) String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Group> results = groupService.searchGroups(keyword, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("keyword", keyword);
        response.put("results", results.getContent());
        response.put("totalElements", results.getTotalElements());
        response.put("totalPages", results.getTotalPages());

        return ResponseEntity.ok(response);
    }

    /**
     * [GET] /api/v1/groups/category/{category} - Lấy nhóm theo category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<Group>> getGroupsByCategory(
        @PathVariable String category,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Group> groups = groupService.getGroupsByCategory(category, pageable);
        return ResponseEntity.ok(groups);
    }

    /**
     * [GET] /api/v1/groups/suggested - Lấy nhóm gợi ý cho user
     */
    @GetMapping("/suggested")
    public ResponseEntity<Page<Group>> getSuggestedGroups(
        Authentication authentication,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        User user = (User) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size);
        Page<Group> suggested = groupService.getSuggestedGroups(String.valueOf(user.getId()), pageable);
        return ResponseEntity.ok(suggested);
    }

    /**
     * [GET] /api/v1/groups/my-groups - Lấy nhóm mà user tham gia
     */
    @GetMapping("/my-groups")
    public ResponseEntity<Page<Group>> getMyGroups(
        Authentication authentication,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        User user = (User) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size);
        Page<Group> myGroups = groupService.getUserGroups(String.valueOf(user.getId()), pageable);
        return ResponseEntity.ok(myGroups);
    }

    /**
     * [GET] /api/v1/groups/owned - Lấy nhóm mà user là owner
     */
    @GetMapping("/owned")
    public ResponseEntity<Page<Group>> getOwnedGroups(
        Authentication authentication,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        User user = (User) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size);
        Page<Group> ownedGroups = groupService.getUserOwnedGroups(String.valueOf(user.getId()), pageable);
        return ResponseEntity.ok(ownedGroups);
    }

    /**
     * [GET] /api/v1/groups/{id} - Lấy chi tiết nhóm
     */
    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupDetail(@PathVariable String id) {
        try {
            Group group = groupService.getGroupById(id);
            return ResponseEntity.ok(group);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * [POST] /api/v1/groups - Tạo nhóm mới
     */
    @PostMapping
    public ResponseEntity<?> createGroup(
        @RequestBody GroupCreateRequest request,
        Authentication authentication
    ) {
        try {
            User owner = (User) authentication.getPrincipal();
            GroupType groupType;
            // Prefer visibility if provided (PUBLIC/PRIVATE/CLOSED)
            if (request.getVisibility() != null && !request.getVisibility().isBlank()) {
                groupType = GroupType.valueOf(request.getVisibility().trim().toUpperCase());
            } else if (request.getGroupType() != null && !request.getGroupType().isBlank()) {
                groupType = GroupType.valueOf(request.getGroupType().trim().toUpperCase());
            } else {
                groupType = GroupType.PUBLIC;
            }
            Group group = groupService.createGroup(
                request.getName(),
                request.getDescription(),
                groupType,
                request.getCategory(),
                request.getRules(),
                owner
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tạo nhóm thành công");
            response.put("groupId", group.getId());
            response.put("group", group);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [PUT] /api/v1/groups/{id} - Cập nhật thông tin nhóm
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroup(
        @PathVariable String id,
        @RequestBody GroupUpdateRequest request,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            Group updated = groupService.updateGroup(id, request.getName(), request.getDescription(),
                request.getCoverImage(), request.getRules(), request.getCategory(), user);

            return ResponseEntity.ok(Map.of(
                "message", "Cập nhật nhóm thành công",
                "group", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [DELETE] /api/v1/groups/{id} - Xóa nhóm
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(
        @PathVariable String id,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            groupService.deleteGroup(id, user);
            return ResponseEntity.ok(Map.of("message", "Xóa nhóm thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== MEMBER ENDPOINTS ====================

    /**
     * [POST] /api/v1/groups/{id}/join - Tham gia nhóm
     */
    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinGroup(
        @PathVariable String id,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            groupService.addMember(id, user);

            return ResponseEntity.ok(Map.of(
                "message", "Tham gia nhóm thành công",
                "groupId", id
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [POST] /api/v1/groups/{id}/leave - Rời nhóm
     */
    @PostMapping("/{id}/leave")
    public ResponseEntity<?> leaveGroup(
        @PathVariable String id,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            groupService.removeMember(id, String.valueOf(user.getId()), user);
            return ResponseEntity.ok(Map.of("message", "Rời nhóm thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [GET] /api/v1/groups/{id}/members - Lấy danh sách member
     */
    @GetMapping("/{id}/members")
    public ResponseEntity<Map<String, Object>> getGroupMembers(
        @PathVariable String id,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<GroupMember> members = groupService.getGroupMembers(id, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("members", members.getContent());
            response.put("totalElements", members.getTotalElements());
            response.put("totalPages", members.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * [GET] /api/v1/groups/{id}/members/search - Tìm member
     */
    @GetMapping("/{id}/members/search")
    public ResponseEntity<Page<GroupMember>> searchMembers(
        @PathVariable String id,
        @RequestParam String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<GroupMember> results = groupService.searchMembers(id, keyword, pageable);
        return ResponseEntity.ok(results);
    }

    /**
     * [PUT] /api/v1/groups/{groupId}/members/{userId}/role - Cập nhật vai trò member
     */
    @PutMapping("/{groupId}/members/{userId}/role")
    public ResponseEntity<?> updateMemberRole(
        @PathVariable String groupId,
        @PathVariable String userId,
        @RequestBody Map<String, String> request,
        Authentication authentication
    ) {
        try {
            User requester = (User) authentication.getPrincipal();
            GroupMemberRole role = GroupMemberRole.valueOf(request.get("role").toUpperCase());
            groupService.updateMemberRole(groupId, userId, role, requester);

            return ResponseEntity.ok(Map.of("message", "Cập nhật vai trò thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [POST] /api/v1/groups/{id}/mute - Mute notification
     */
    @PostMapping("/{id}/mute")
    public ResponseEntity<?> muteGroup(
        @PathVariable String id,
        @RequestParam Boolean isMuted,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            groupService.muteGroup(id, user, isMuted);
            return ResponseEntity.ok(Map.of("message", isMuted ? "Đã tắt thông báo" : "Đã bật thông báo"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [GET] /api/v1/groups/{id}/is-member - Kiểm tra user có phải member không
     */
    @GetMapping("/{id}/is-member")
    public ResponseEntity<Map<String, Object>> isMember(
        @PathVariable String id,
        Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        String userId = String.valueOf(user.getId());
        Boolean isMember = groupService.isMemberOfGroup(id, userId);

        return ResponseEntity.ok(Map.of(
            "groupId", id,
            "userId", userId,
            "isMember", isMember
        ));
    }

    // ==================== POST ENDPOINTS ====================

    /**
     * [GET] /api/v1/groups/{id}/posts - Lấy danh sách bài viết
     */
    @GetMapping("/{id}/posts")
    public ResponseEntity<Map<String, Object>> getGroupPosts(
        @PathVariable String id,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<GroupPost> posts = groupService.getGroupPosts(id, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("posts", posts.getContent());
            response.put("totalElements", posts.getTotalElements());
            response.put("totalPages", posts.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * [GET] /api/v1/groups/{id}/posts/search - Tìm bài viết
     */
    @GetMapping("/{id}/posts/search")
    public ResponseEntity<Page<GroupPost>> searchPosts(
        @PathVariable String id,
        @RequestParam String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<GroupPost> results = groupService.searchPosts(id, keyword, pageable);
        return ResponseEntity.ok(results);
    }

    /**
     * [POST] /api/v1/groups/{id}/posts - Đăng bài viết trong nhóm
     */
    @PostMapping("/{id}/posts")
    public ResponseEntity<?> createPost(
        @PathVariable String id,
        @RequestBody GroupPostCreateRequest request,
        Authentication authentication
    ) {
        try {
            User author = (User) authentication.getPrincipal();
            String mediaIds = request.getMediaIds() != null ? request.getMediaIds().toString() : "[]";
            GroupPost post = groupService.createPost(id, request.getContent(), mediaIds, author);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đăng bài thành công");
            response.put("postId", post.getId());
            response.put("post", post);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [PUT] /api/v1/groups/{groupId}/posts/{postId} - Sửa bài viết
     */
    @PutMapping("/{groupId}/posts/{postId}")
    public ResponseEntity<?> updatePost(
        @PathVariable String groupId,
        @PathVariable String postId,
        @RequestBody GroupPostUpdateRequest request,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            String mediaIds = request.getMediaIds() != null ? request.getMediaIds().toString() : "[]";
            GroupPost updated = groupService.updatePost(postId, request.getContent(), mediaIds, user);

            return ResponseEntity.ok(Map.of(
                "message", "Cập nhật bài viết thành công",
                "post", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [DELETE] /api/v1/groups/{groupId}/posts/{postId} - Xóa bài viết
     */
    @DeleteMapping("/{groupId}/posts/{postId}")
    public ResponseEntity<?> deletePost(
        @PathVariable String groupId,
        @PathVariable String postId,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            groupService.deletePost(postId, user);
            return ResponseEntity.ok(Map.of("message", "Xóa bài viết thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [POST] /api/v1/groups/{groupId}/posts/{postId}/like - Like bài viết
     */
    @PostMapping("/{groupId}/posts/{postId}/like")
    public ResponseEntity<?> likePost(
        @PathVariable String groupId,
        @PathVariable String postId,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            groupService.likePost(postId, String.valueOf(user.getId()));
            return ResponseEntity.ok(Map.of("message", "Like thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [DELETE] /api/v1/groups/{groupId}/posts/{postId}/unlike - Unlike bài viết
     */
    @DeleteMapping("/{groupId}/posts/{postId}/unlike")
    public ResponseEntity<?> unlikePost(
        @PathVariable String groupId,
        @PathVariable String postId,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            groupService.unlikePost(postId, String.valueOf(user.getId()));
            return ResponseEntity.ok(Map.of("message", "Unlike thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== COMMENT ENDPOINTS ====================

    /**
     * [GET] /api/v1/groups/{groupId}/posts/{postId}/comments - Lấy comment của bài viết
     */
    @GetMapping("/{groupId}/posts/{postId}/comments")
    public ResponseEntity<Map<String, Object>> getPostComments(
        @PathVariable String groupId,
        @PathVariable String postId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<GroupComment> comments = groupService.getPostComments(postId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("comments", comments.getContent());
            response.put("totalElements", comments.getTotalElements());
            response.put("totalPages", comments.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * [POST] /api/v1/groups/{groupId}/posts/{postId}/comments - Bình luận
     */
    @PostMapping("/{groupId}/posts/{postId}/comments")
    public ResponseEntity<?> createComment(
        @PathVariable String groupId,
        @PathVariable String postId,
        @RequestBody GroupCommentCreateRequest request,
        Authentication authentication
    ) {
        try {
            User author = (User) authentication.getPrincipal();
            GroupComment comment = groupService.createComment(postId, request.getContent(), author);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bình luận thành công");
            response.put("commentId", comment.getId());
            response.put("comment", comment);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [PUT] /api/v1/groups/{groupId}/posts/{postId}/comments/{commentId} - Sửa comment
     */
    @PutMapping("/{groupId}/posts/{postId}/comments/{commentId}")
    public ResponseEntity<?> updateComment(
        @PathVariable String commentId,
        @RequestBody GroupCommentUpdateRequest request,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            GroupComment updated = groupService.updateComment(commentId, request.getContent(), user);

            return ResponseEntity.ok(Map.of(
                "message", "Cập nhật comment thành công",
                "comment", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [DELETE] /api/v1/groups/{groupId}/posts/{postId}/comments/{commentId} - Xóa comment
     */
    @DeleteMapping("/{groupId}/posts/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
        @PathVariable String commentId,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            groupService.deleteComment(commentId, user);
            return ResponseEntity.ok(Map.of("message", "Xóa comment thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [POST] /api/v1/groups/{groupId}/posts/{postId}/comments/{commentId}/like - Like comment
     */
    @PostMapping("/{groupId}/posts/{postId}/comments/{commentId}/like")
    public ResponseEntity<?> likeComment(
        @PathVariable String commentId,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            groupService.likeComment(commentId, String.valueOf(user.getId()));
            return ResponseEntity.ok(Map.of("message", "Like thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * [DELETE] /api/v1/groups/{groupId}/posts/{postId}/comments/{commentId}/unlike - Unlike comment
     */
    @DeleteMapping("/{groupId}/posts/{postId}/comments/{commentId}/unlike")
    public ResponseEntity<?> unlikeComment(
        @PathVariable String commentId,
        Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            groupService.unlikeComment(commentId, String.valueOf(user.getId()));
            return ResponseEntity.ok(Map.of("message", "Unlike thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
