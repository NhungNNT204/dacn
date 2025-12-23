package com.upnest.edu.modules.group.repository;

import com.upnest.edu.modules.group.entity.GroupMember;
import com.upnest.edu.modules.group.entity.GroupMemberRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository cho GroupMember Entity
 * Quản lý database queries cho member của nhóm
 */
@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, String> {

    /**
     * Tìm member bằng group id và user id
     */
    Optional<GroupMember> findByGroupIdAndUserId(String groupId, Long userId);

    /**
     * Tìm tất cả active member của nhóm
     */
    Page<GroupMember> findByGroupIdAndIsActiveTrueOrderByJoinedAtDesc(String groupId, Pageable pageable);

    /**
     * Tìm admin/moderator của nhóm
     */
    List<GroupMember> findByGroupIdAndRoleAndIsActiveTrueOrderByJoinedAtAsc(String groupId, GroupMemberRole role);

    /**
     * Đếm member active của nhóm
     */
    Long countByGroupIdAndIsActiveTrue(String groupId);

    /**
     * Kiểm tra user có phải admin của nhóm không
     */
    @Query("SELECT COUNT(m) > 0 FROM GroupMember m WHERE m.group.id = :groupId AND m.user.id = :userId " +
           "AND m.role IN ('ADMIN') AND m.isActive = true")
    Boolean isAdminOfGroup(@Param("groupId") String groupId, @Param("userId") Long userId);

    /**
     * Kiểm tra user có phải moderator của nhóm không
     */
    @Query("SELECT COUNT(m) > 0 FROM GroupMember m WHERE m.group.id = :groupId AND m.user.id = :userId " +
           "AND m.role IN ('ADMIN', 'MODERATOR') AND m.isActive = true")
    Boolean isModeratorOfGroup(@Param("groupId") String groupId, @Param("userId") Long userId);

    /**
     * Xóa tất cả member của nhóm
     */
    void deleteByGroupId(String groupId);

    /**
     * Tìm member theo keyword search
     */
    @Query("SELECT m FROM GroupMember m WHERE m.group.id = :groupId AND m.isActive = true " +
           "AND (LOWER(m.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(m.user.username) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(m.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<GroupMember> searchMembers(@Param("groupId") String groupId, @Param("keyword") String keyword, Pageable pageable);
}
