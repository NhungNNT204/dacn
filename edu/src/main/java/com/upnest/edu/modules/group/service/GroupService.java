package com.upnest.edu.modules.group.service;

import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.group.entity.*;
import com.upnest.edu.modules.group.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * GroupService - Xử lý business logic cho nhóm
 * Quản lý: tạo/sửa/xóa nhóm, join/leave, post/comment
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupPostRepository groupPostRepository;
    private final GroupCommentRepository groupCommentRepository;

    // ==================== GROUP CRUD ====================

    /**
     * Tạo nhóm mới
     */
    public Group createGroup(String name, String description, GroupType groupType, 
                            String category, String rules, User owner) {
        log.info("Creating new group: {}", name);
        
        Group group = Group.builder()
            .name(name)
            .description(description)
            .groupType(groupType)
            .category(category)
            .rules(rules)
            .owner(owner)
            .isActive(true)
            .memberCount(1L)
            .postCount(0L)
            .language("vi")
            .build();

        Group saved = groupRepository.save(group);
        
        // Thêm owner vào member
        GroupMember ownerMember = GroupMember.builder()
            .group(saved)
            .user(owner)
            .role(GroupMemberRole.ADMIN)
            .isActive(true)
            .isMuted(false)
            .build();
        
        groupMemberRepository.save(ownerMember);
        saved.addMember(ownerMember);
        
        log.info("Group created successfully: {}", saved.getId());
        return saved;
    }

    /**
     * Cập nhật thông tin nhóm
     */
    public Group updateGroup(String groupId, String name, String description, 
                            String coverImage, String rules, String category, User requester) {
        log.info("Updating group: {}", groupId);
        
        Group group = getGroupById(groupId);
        
        if (!group.isOwner(requester)) {
            throw new RuntimeException("Bạn không có quyền sửa nhóm này");
        }

        group.setName(name);
        group.setDescription(description);
        group.setCoverImage(coverImage);
        group.setRules(rules);
        group.setCategory(category);

        return groupRepository.save(group);
    }

    /**
     * Xóa nhóm (soft delete)
     */
    public void deleteGroup(String groupId, User requester) {
        log.info("Deleting group: {}", groupId);
        
        Group group = getGroupById(groupId);
        
        if (!group.isOwner(requester)) {
            throw new RuntimeException("Bạn không có quyền xóa nhóm này");
        }

        group.setIsActive(false);
        groupRepository.save(group);
    }

    /**
     * Lấy chi tiết nhóm
     */
    @Transactional(readOnly = true)
    public Group getGroupById(String groupId) {
        return groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Nhóm không tồn tại"));
    }

    /**
     * Tìm nhóm theo tên
     */
    @Transactional(readOnly = true)
    public Page<Group> searchGroups(String keyword, Pageable pageable) {
        log.info("Searching groups with keyword: {}", keyword);
        return groupRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(keyword, pageable);
    }

    /**
     * Lấy nhóm công khai
     */
    @Transactional(readOnly = true)
    public Page<Group> getPublicGroups(Pageable pageable) {
        return groupRepository.findByGroupTypeAndIsActiveTrueOrderByCreatedAtDesc(GroupType.PUBLIC, pageable);
    }

    /**
     * Lấy nhóm trending
     */
    @Transactional(readOnly = true)
    public Page<Group> getTrendingGroups(Pageable pageable) {
        return groupRepository.findTrendingGroups(pageable);
    }

    /**
     * Lấy nhóm gợi ý cho user
     */
    @Transactional(readOnly = true)
    public Page<Group> getSuggestedGroups(Long userId, Pageable pageable) {
        return groupRepository.findSuggestedGroups(userId, pageable);
    }

    /**
     * Lấy nhóm mà user đã tham gia
     */
    @Transactional(readOnly = true)
    public Page<Group> getUserGroups(Long userId, Pageable pageable) {
        return groupRepository.findGroupsByMemberId(userId, pageable);
    }

    /**
     * Lấy nhóm mà user là owner
     */
    @Transactional(readOnly = true)
    public Page<Group> getUserOwnedGroups(Long userId, Pageable pageable) {
        return groupRepository.findByOwnerIdAndIsActiveTrueOrderByCreatedAtDesc(userId, pageable);
    }

    /**
     * Lấy nhóm theo category
     */
    @Transactional(readOnly = true)
    public Page<Group> getGroupsByCategory(String category, Pageable pageable) {
        return groupRepository.findByCategoryAndIsActiveTrueOrderByMemberCountDesc(category, pageable);
    }

    // ==================== MEMBER MANAGEMENT ====================

    /**
     * Thêm user vào nhóm (join)
     */
    public void addMember(String groupId, User user) {
        log.info("Adding user {} to group {}", user.getId(), groupId);
        
        Group group = getGroupById(groupId);
        
        // Kiểm tra user đã là member chưa
        if (groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId()).isPresent()) {
            throw new RuntimeException("User đã là member của nhóm này");
        }

        GroupMember member = GroupMember.builder()
            .group(group)
            .user(user)
            .role(GroupMemberRole.MEMBER)
            .isActive(true)
            .isMuted(false)
            .build();

        groupMemberRepository.save(member);
        group.addMember(member);
        groupRepository.save(group);
    }

    /**
     * Xóa user khỏi nhóm (leave)
     */
    public void removeMember(String groupId, String userId, User requester) {
        log.info("Removing user {} from group {}", userId, groupId);
        
        Group group = getGroupById(groupId);
        Long userIdLong = Long.parseLong(userId);
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, userIdLong)
            .orElseThrow(() -> new RuntimeException("User không là member của nhóm này"));

        // Kiểm tra quyền: chỉ user tự hoặc admin mới xóa được
        if (!requester.getId().equals(userIdLong) && !groupMemberRepository.isAdminOfGroup(groupId, requester.getId())) {
            throw new RuntimeException("Bạn không có quyền xóa member này");
        }

        member.setIsActive(false);
        groupMemberRepository.save(member);
        group.removeMember(member);
        groupRepository.save(group);
    }

    /**
     * Lấy danh sách member của nhóm
     */
    @Transactional(readOnly = true)
    public Page<GroupMember> getGroupMembers(String groupId, Pageable pageable) {
        return groupMemberRepository.findByGroupIdAndIsActiveTrueOrderByJoinedAtDesc(groupId, pageable);
    }

    /**
     * Tìm member theo keyword
     */
    @Transactional(readOnly = true)
    public Page<GroupMember> searchMembers(String groupId, String keyword, Pageable pageable) {
        return groupMemberRepository.searchMembers(groupId, keyword, pageable);
    }

    /**
     * Cập nhật vai trò member (promote/demote)
     */
    public void updateMemberRole(String groupId, String userId, GroupMemberRole role, User requester) {
        log.info("Updating member {} role to {} in group {}", userId, role, groupId);
        
        if (!groupMemberRepository.isAdminOfGroup(groupId, requester.getId())) {
            throw new RuntimeException("Bạn không có quyền thay đổi vai trò member");
        }

        Long userIdLong = Long.parseLong(userId);
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, userIdLong)
            .orElseThrow(() -> new RuntimeException("User không là member của nhóm này"));

        member.setRole(role);
        groupMemberRepository.save(member);
    }

    /**
     * Mute notification từ nhóm
     */
    public void muteGroup(String groupId, User user, Boolean isMuted) {
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
            .orElseThrow(() -> new RuntimeException("User không là member của nhóm này"));

        member.setIsMuted(isMuted);
        groupMemberRepository.save(member);
    }

    /**
     * Kiểm tra user có phải member của nhóm không
     */
    @Transactional(readOnly = true)
    public Boolean isMemberOfGroup(String groupId, String userId) {
        Long userIdLong = Long.parseLong(userId);
        return groupMemberRepository.findByGroupIdAndUserId(groupId, userIdLong)
            .map(GroupMember::getIsActive)
            .orElse(false);
    }

    /**
     * Kiểm tra user có phải admin của nhóm không
     */
    @Transactional(readOnly = true)
    public Boolean isAdminOfGroup(String groupId, String userId) {
        Long userIdLong = Long.parseLong(userId);
        return groupMemberRepository.isAdminOfGroup(groupId, userIdLong);
    }

    // ==================== POST MANAGEMENT ====================

    /**
     * Tạo bài viết trong nhóm
     */
    public GroupPost createPost(String groupId, String content, String mediaIds, User author) {
        log.info("Creating post in group {}", groupId);
        
        Group group = getGroupById(groupId);
        
        if (!isMemberOfGroup(groupId, String.valueOf(author.getId()))) {
            throw new RuntimeException("Bạn không phải member của nhóm này");
        }

        GroupPost post = GroupPost.builder()
            .group(group)
            .author(author)
            .content(content)
            .mediaIds(mediaIds)
            .isApproved(true)
            .needsApproval(false)
            .isDeleted(false)
            .commentCount(0L)
            .likeCount(0L)
            .build();

        GroupPost saved = groupPostRepository.save(post);
        group.addPost(saved);
        groupRepository.save(group);

        log.info("Post created successfully: {}", saved.getId());
        return saved;
    }

    /**
     * Cập nhật bài viết
     */
    public GroupPost updatePost(String postId, String content, String mediaIds, User requester) {
        log.info("Updating post: {}", postId);
        
        GroupPost post = groupPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Bài viết không tồn tại"));

        if (!String.valueOf(post.getAuthor().getId()).equals(String.valueOf(requester.getId()))) {
            throw new RuntimeException("Bạn không có quyền sửa bài viết này");
        }

        post.setContent(content);
        post.setMediaIds(mediaIds);

        return groupPostRepository.save(post);
    }

    /**
     * Xóa bài viết
     */
    public void deletePost(String postId, User requester) {
        log.info("Deleting post: {}", postId);
        
        GroupPost post = groupPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Bài viết không tồn tại"));

        // Chỉ author hoặc admin mới xóa được
        if (!post.getAuthor().getId().equals(requester.getId()) && 
            !groupMemberRepository.isAdminOfGroup(post.getGroup().getId(), requester.getId())) {
            throw new RuntimeException("Bạn không có quyền xóa bài viết này");
        }

        post.setIsDeleted(true);
        groupPostRepository.save(post);
    }

    /**
     * Lấy posts của nhóm
     */
    @Transactional(readOnly = true)
    public Page<GroupPost> getGroupPosts(String groupId, Pageable pageable) {
        return groupPostRepository.findByGroupIdAndIsApprovedTrueAndIsDeletedFalseOrderByCreatedAtDesc(groupId, pageable);
    }

    /**
     * Tìm posts theo keyword
     */
    @Transactional(readOnly = true)
    public Page<GroupPost> searchPosts(String groupId, String keyword, Pageable pageable) {
        return groupPostRepository.searchPosts(groupId, keyword, pageable);
    }

    /**
     * Like bài viết
     */
    public void likePost(String postId, String userId) {
        GroupPost post = groupPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Bài viết không tồn tại"));

        List<String> likedUsers = new ArrayList<>(Arrays.asList(
            post.getLikedByUsers().replaceAll("[\\[\\]]", "").split(", ")
        ));

        if (!likedUsers.contains(userId)) {
            likedUsers.add(userId);
            post.setLikedByUsers(likedUsers.toString());
            post.incrementLikes();
            groupPostRepository.save(post);
        }
    }

    /**
     * Unlike bài viết
     */
    public void unlikePost(String postId, String userId) {
        GroupPost post = groupPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Bài viết không tồn tại"));

        List<String> likedUsers = new ArrayList<>(Arrays.asList(
            post.getLikedByUsers().replaceAll("[\\[\\]]", "").split(", ")
        ));

        if (likedUsers.remove(userId)) {
            post.setLikedByUsers(likedUsers.toString());
            post.decrementLikes();
            groupPostRepository.save(post);
        }
    }

    // ==================== COMMENT MANAGEMENT ====================

    /**
     * Tạo comment
     */
    public GroupComment createComment(String postId, String content, User author) {
        log.info("Creating comment on post {}", postId);
        
        GroupPost post = groupPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Bài viết không tồn tại"));

        GroupComment comment = GroupComment.builder()
            .post(post)
            .author(author)
            .content(content)
            .isDeleted(false)
            .isEdited(false)
            .likeCount(0L)
            .build();

        GroupComment saved = groupCommentRepository.save(comment);
        post.addComment(saved);
        groupPostRepository.save(post);

        return saved;
    }

    /**
     * Cập nhật comment
     */
    public GroupComment updateComment(String commentId, String content, User requester) {
        log.info("Updating comment: {}", commentId);
        
        GroupComment comment = groupCommentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment không tồn tại"));

        if (!String.valueOf(comment.getAuthor().getId()).equals(String.valueOf(requester.getId()))) {
            throw new RuntimeException("Bạn không có quyền sửa comment này");
        }

        comment.setContent(content);
        comment.setIsEdited(true);

        return groupCommentRepository.save(comment);
    }

    /**
     * Xóa comment
     */
    public void deleteComment(String commentId, User requester) {
        log.info("Deleting comment: {}", commentId);
        
        GroupComment comment = groupCommentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment không tồn tại"));

        if (!comment.getAuthor().getId().equals(requester.getId()) && 
            !groupMemberRepository.isModeratorOfGroup(comment.getPost().getGroup().getId(), requester.getId())) {
            throw new RuntimeException("Bạn không có quyền xóa comment này");
        }

        comment.setIsDeleted(true);
        groupCommentRepository.save(comment);
    }

    /**
     * Lấy comments của post
     */
    @Transactional(readOnly = true)
    public Page<GroupComment> getPostComments(String postId, Pageable pageable) {
        return groupCommentRepository.findByPostIdAndIsDeletedFalseOrderByCreatedAtAsc(postId, pageable);
    }

    /**
     * Like comment
     */
    public void likeComment(String commentId, String userId) {
        GroupComment comment = groupCommentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment không tồn tại"));

        List<String> likedUsers = new ArrayList<>(Arrays.asList(
            comment.getLikedByUsers().replaceAll("[\\[\\]]", "").split(", ")
        ));

        if (!likedUsers.contains(userId)) {
            likedUsers.add(userId);
            comment.setLikedByUsers(likedUsers.toString());
            comment.incrementLikes();
            groupCommentRepository.save(comment);
        }
    }

    /**
     * Unlike comment
     */
    public void unlikeComment(String commentId, String userId) {
        GroupComment comment = groupCommentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment không tồn tại"));

        List<String> likedUsers = new ArrayList<>(Arrays.asList(
            comment.getLikedByUsers().replaceAll("[\\[\\]]", "").split(", ")
        ));

        if (likedUsers.remove(userId)) {
            comment.setLikedByUsers(likedUsers.toString());
            comment.decrementLikes();
            groupCommentRepository.save(comment);
        }
    }

    // ==================== MOCK DATA ====================

    /**
     * Generate mock groups for testing
     */
    public List<Group> generateMockGroups(User owner, int count) {
        List<Group> groups = new ArrayList<>();
        String[] categories = {"Education", "Technology", "Business", "Health", "Sports", "Travel", "Food", "Art"};
        String[] descriptions = {
            "Nhóm học tập",
            "Thảo luận công nghệ",
            "Chia sẻ kinh doanh",
            "Sức khỏe tổng hợp",
            "Thể thao và fitness",
            "Du lịch bụi",
            "Nấu ăn và công thức",
            "Nghệ thuật sáng tạo"
        };

        for (int i = 0; i < count; i++) {
            Group group = Group.builder()
                .name("Nhóm " + categories[i % categories.length] + " " + (i + 1))
                .description(descriptions[i % descriptions.length])
                .groupType(GroupType.values()[i % GroupType.values().length])
                .category(categories[i % categories.length])
                .owner(owner)
                .isActive(true)
                .memberCount((long) (Math.random() * 100) + 10)
                .postCount((long) (Math.random() * 50) + 5)
                .language("vi")
                .build();

            groups.add(group);
        }

        return groupRepository.saveAll(groups);
    }
}
