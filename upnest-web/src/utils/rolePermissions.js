/**
 * Role-Based Access Control System
 * Quản lý quyền tương tác dựa trên role của user
 */

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  GUEST: 'GUEST'
};

export const INTERACTION_PERMISSIONS = {
  CREATE_POST: 'create_post',
  EDIT_POST: 'edit_post',
  DELETE_POST: 'delete_post',
  LIKE_POST: 'like_post',
  COMMENT_POST: 'comment_post',
  EDIT_COMMENT: 'edit_comment',
  DELETE_COMMENT: 'delete_comment',
  SHARE_POST: 'share_post',
  UPLOAD_MEDIA: 'upload_media',
  PIN_POST: 'pin_post',
  LOCK_COMMENTS: 'lock_comments',
  MODERATE_COMMENTS: 'moderate_comments'
};

/**
 * Role Permissions Matrix
 */
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: {
    [INTERACTION_PERMISSIONS.CREATE_POST]: true,
    [INTERACTION_PERMISSIONS.EDIT_POST]: true,
    [INTERACTION_PERMISSIONS.DELETE_POST]: true,
    [INTERACTION_PERMISSIONS.LIKE_POST]: true,
    [INTERACTION_PERMISSIONS.COMMENT_POST]: true,
    [INTERACTION_PERMISSIONS.EDIT_COMMENT]: true,
    [INTERACTION_PERMISSIONS.DELETE_COMMENT]: true,
    [INTERACTION_PERMISSIONS.SHARE_POST]: true,
    [INTERACTION_PERMISSIONS.UPLOAD_MEDIA]: true,
    [INTERACTION_PERMISSIONS.PIN_POST]: true,
    [INTERACTION_PERMISSIONS.LOCK_COMMENTS]: true,
    [INTERACTION_PERMISSIONS.MODERATE_COMMENTS]: true
  },

  [USER_ROLES.TEACHER]: {
    [INTERACTION_PERMISSIONS.CREATE_POST]: true,
    [INTERACTION_PERMISSIONS.EDIT_POST]: true,
    [INTERACTION_PERMISSIONS.DELETE_POST]: true,
    [INTERACTION_PERMISSIONS.LIKE_POST]: true,
    [INTERACTION_PERMISSIONS.COMMENT_POST]: true,
    [INTERACTION_PERMISSIONS.EDIT_COMMENT]: true, // Có thể sửa bình luận của mình
    [INTERACTION_PERMISSIONS.DELETE_COMMENT]: true, // Có thể xóa bình luận bất kỳ
    [INTERACTION_PERMISSIONS.SHARE_POST]: true,
    [INTERACTION_PERMISSIONS.UPLOAD_MEDIA]: true,
    [INTERACTION_PERMISSIONS.PIN_POST]: true,
    [INTERACTION_PERMISSIONS.LOCK_COMMENTS]: true,
    [INTERACTION_PERMISSIONS.MODERATE_COMMENTS]: true
  },

  [USER_ROLES.STUDENT]: {
    [INTERACTION_PERMISSIONS.CREATE_POST]: true,
    [INTERACTION_PERMISSIONS.EDIT_POST]: false, // Chỉ có thể sửa bài của mình (checked separately)
    [INTERACTION_PERMISSIONS.DELETE_POST]: false, // Chỉ có thể xóa bài của mình (checked separately)
    [INTERACTION_PERMISSIONS.LIKE_POST]: true,
    [INTERACTION_PERMISSIONS.COMMENT_POST]: true,
    [INTERACTION_PERMISSIONS.EDIT_COMMENT]: false, // Chỉ có thể sửa bình luận của mình (checked separately)
    [INTERACTION_PERMISSIONS.DELETE_COMMENT]: false, // Chỉ có thể xóa bình luận của mình (checked separately)
    [INTERACTION_PERMISSIONS.SHARE_POST]: true,
    [INTERACTION_PERMISSIONS.UPLOAD_MEDIA]: true,
    [INTERACTION_PERMISSIONS.PIN_POST]: false,
    [INTERACTION_PERMISSIONS.LOCK_COMMENTS]: false,
    [INTERACTION_PERMISSIONS.MODERATE_COMMENTS]: false
  },

  [USER_ROLES.GUEST]: {
    [INTERACTION_PERMISSIONS.CREATE_POST]: false,
    [INTERACTION_PERMISSIONS.EDIT_POST]: false,
    [INTERACTION_PERMISSIONS.DELETE_POST]: false,
    [INTERACTION_PERMISSIONS.LIKE_POST]: false,
    [INTERACTION_PERMISSIONS.COMMENT_POST]: false,
    [INTERACTION_PERMISSIONS.EDIT_COMMENT]: false,
    [INTERACTION_PERMISSIONS.DELETE_COMMENT]: false,
    [INTERACTION_PERMISSIONS.SHARE_POST]: false,
    [INTERACTION_PERMISSIONS.UPLOAD_MEDIA]: false,
    [INTERACTION_PERMISSIONS.PIN_POST]: false,
    [INTERACTION_PERMISSIONS.LOCK_COMMENTS]: false,
    [INTERACTION_PERMISSIONS.MODERATE_COMMENTS]: false
  }
};

/**
 * Permission Checker Class
 */
export class PermissionChecker {
  constructor(userRole = USER_ROLES.GUEST, userId = null) {
    this.userRole = userRole;
    this.userId = userId;
  }

  /**
   * Kiểm tra xem user có quyền thực hiện action không
   */
  canPerformAction(permission, context = {}) {
    const rolePermission = ROLE_PERMISSIONS[this.userRole]?.[permission];

    if (rolePermission === undefined) {
      return false;
    }

    // Nếu permission là true, cho phép
    if (rolePermission === true) {
      return true;
    }

    // Nếu là false, kiểm tra xem có phải owner không
    if (rolePermission === false) {
      // Cho phép nếu user là owner của post/comment
      return this.isOwner(context);
    }

    return false;
  }

  /**
   * Kiểm tra xem user có quyền like không
   */
  canLike() {
    return this.canPerformAction(INTERACTION_PERMISSIONS.LIKE_POST);
  }

  /**
   * Kiểm tra xem user có quyền comment không
   */
  canComment(isCommentLocked = false) {
    if (isCommentLocked && this.userRole !== USER_ROLES.TEACHER) {
      return false;
    }
    return this.canPerformAction(INTERACTION_PERMISSIONS.COMMENT_POST);
  }

  /**
   * Kiểm tra xem user có quyền edit comment không
   */
  canEditComment(commentAuthorId) {
    if (this.userRole === USER_ROLES.TEACHER) {
      return true; // Giáo viên có thể sửa bất kỳ comment nào
    }
    return commentAuthorId === this.userId;
  }

  /**
   * Kiểm tra xem user có quyền delete comment không
   */
  canDeleteComment(commentAuthorId) {
    if (this.userRole === USER_ROLES.TEACHER) {
      return true;
    }
    return commentAuthorId === this.userId;
  }

  /**
   * Kiểm tra xem user có quyền upload media không
   */
  canUploadMedia() {
    return this.canPerformAction(INTERACTION_PERMISSIONS.UPLOAD_MEDIA);
  }

  /**
   * Kiểm tra xem user có quyền pin post không
   */
  canPinPost() {
    return this.canPerformAction(INTERACTION_PERMISSIONS.PIN_POST);
  }

  /**
   * Kiểm tra xem user có quyền lock comments không
   */
  canLockComments() {
    return this.canPerformAction(INTERACTION_PERMISSIONS.LOCK_COMMENTS);
  }

  /**
   * Kiểm tra xem user có quyền moderate không
   */
  canModerate() {
    return this.canPerformAction(INTERACTION_PERMISSIONS.MODERATE_COMMENTS);
  }

  /**
   * Kiểm tra xem user có phải owner không
   */
  isOwner(context = {}) {
    return context.authorId === this.userId || context.ownerId === this.userId;
  }

  /**
   * Kiểm tra xem user có phải teacher không
   */
  isTeacher() {
    return this.userRole === USER_ROLES.TEACHER;
  }

  /**
   * Kiểm tra xem user có phải admin không
   */
  isAdmin() {
    return this.userRole === USER_ROLES.ADMIN;
  }

  /**
   * Kiểm tra xem user có phải student không
   */
  isStudent() {
    return this.userRole === USER_ROLES.STUDENT;
  }

  /**
   * Lấy tất cả quyền của user
   */
  getAllPermissions() {
    return ROLE_PERMISSIONS[this.userRole] || {};
  }

  /**
   * Kiểm tra xem các tương tác có bị disabled không
   */
  isInteractionDisabled(context = {}) {
    // Nếu giáo viên lock comments, học sinh không thể comment
    if (context.isCommentLocked && this.userRole !== USER_ROLES.TEACHER) {
      return true;
    }

    // Nếu post bị disable interactions
    if (context.disabledInteractions === true) {
      return !this.isTeacher();
    }

    return false;
  }
}

/**
 * Utility function để kiểm tra quyền
 */
export function hasPermission(userRole, permission, context) {
  const checker = new PermissionChecker(userRole, context?.userId);
  return checker.canPerformAction(permission, context);
}

/**
 * Hook React để sử dụng permission checker
 */
export function usePermissions(userRole = USER_ROLES.GUEST, userId = null) {
  const permissionChecker = new PermissionChecker(userRole, userId);

  return {
    canLike: () => permissionChecker.canLike(),
    canComment: (isCommentLocked) => permissionChecker.canComment(isCommentLocked),
    canEditComment: (commentAuthorId) => permissionChecker.canEditComment(commentAuthorId),
    canDeleteComment: (commentAuthorId) => permissionChecker.canDeleteComment(commentAuthorId),
    canUploadMedia: () => permissionChecker.canUploadMedia(),
    canPinPost: () => permissionChecker.canPinPost(),
    canLockComments: () => permissionChecker.canLockComments(),
    canModerate: () => permissionChecker.canModerate(),
    isTeacher: () => permissionChecker.isTeacher(),
    isAdmin: () => permissionChecker.isAdmin(),
    isStudent: () => permissionChecker.isStudent(),
    getAllPermissions: () => permissionChecker.getAllPermissions(),
    isInteractionDisabled: (context) => permissionChecker.isInteractionDisabled(context)
  };
}
