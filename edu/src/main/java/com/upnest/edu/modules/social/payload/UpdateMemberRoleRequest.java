package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * UpdateMemberRoleRequest - Request DTO để cập nhật role của thành viên
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMemberRoleRequest {
  private Long userId;
  private String newRole;           // ADMIN, MEMBER
}
