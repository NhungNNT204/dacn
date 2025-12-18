package com.upnest.edu.modules.group.entity;

/**
 * Enum đối với vai trò member trong nhóm
 * ADMIN: Quản trị viên nhóm - phê duyệt posts, xóa comments
 * MODERATOR: Kiểm duyệt viên - giúp admin quản lý
 * MEMBER: Thành viên bình thường
 */
public enum GroupMemberRole {
    ADMIN,      // Quản trị viên
    MODERATOR,  // Kiểm duyệt viên
    MEMBER      // Thành viên bình thường
}
