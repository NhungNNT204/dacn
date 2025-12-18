package com.upnest.edu.modules.group.repository;

import com.upnest.edu.modules.group.entity.Group;
import com.upnest.edu.modules.group.entity.GroupType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository cho Group Entity
 * Quản lý database queries cho nhóm
 */
@Repository
public interface GroupRepository extends JpaRepository<Group, String> {

    /**
     * Tìm nhóm theo tên (like search)
     */
    Page<Group> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);

    /**
     * Tìm tất cả nhóm PUBLIC active
     */
    Page<Group> findByGroupTypeAndIsActiveTrueOrderByCreatedAtDesc(GroupType groupType, Pageable pageable);

    /**
     * Tìm nhóm theo category
     */
    Page<Group> findByCategoryAndIsActiveTrueOrderByMemberCountDesc(String category, Pageable pageable);

    /**
     * Tìm nhóm mà user là owner
     */
    Page<Group> findByOwnerIdAndIsActiveTrueOrderByCreatedAtDesc(String ownerId, Pageable pageable);

    /**
     * Tìm nhóm mà user đã tham gia
     */
    @Query("SELECT g FROM Group g INNER JOIN g.members m WHERE m.user.id = :userId AND g.isActive = true ORDER BY m.joinedAt DESC")
    Page<Group> findGroupsByMemberId(@Param("userId") String userId, Pageable pageable);

    /**
     * Kiểm tra user đã tham gia nhóm chưa
     */
    @Query("SELECT COUNT(m) > 0 FROM GroupMember m WHERE m.group.id = :groupId AND m.user.id = :userId AND m.isActive = true")
    Boolean isMemberOfGroup(@Param("groupId") String groupId, @Param("userId") String userId);

    /**
     * Tìm nhóm theo owner và id
     */
    Optional<Group> findByIdAndOwnerId(String id, String ownerId);

    /**
     * Tìm nhóm trending (dựa vào member count)
     */
    @Query("SELECT g FROM Group g WHERE g.isActive = true ORDER BY g.memberCount DESC")
    Page<Group> findTrendingGroups(Pageable pageable);

    /**
     * Tìm nhóm gợi ý cho user (những nhóm mà user chưa tham gia)
     */
    @Query("SELECT g FROM Group g WHERE g.isActive = true AND g.groupType = 'PUBLIC' " +
           "AND g.id NOT IN (SELECT m.group.id FROM GroupMember m WHERE m.user.id = :userId) " +
           "ORDER BY g.memberCount DESC")
    Page<Group> findSuggestedGroups(@Param("userId") String userId, Pageable pageable);

    /**
     * Đếm số nhóm của user
     */
    @Query("SELECT COUNT(DISTINCT m.group.id) FROM GroupMember m WHERE m.user.id = :userId AND m.isActive = true")
    Long countUserGroups(@Param("userId") String userId);
}
