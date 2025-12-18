package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * AddMemberRequest - Request DTO để thêm thành viên
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddMemberRequest {
  private Long userId;
  private String role;              // MEMBER (default), ADMIN, OWNER
}
