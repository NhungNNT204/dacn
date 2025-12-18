package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * RemoveMemberRequest - Request DTO để xóa thành viên
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RemoveMemberRequest {
  private Long userId;
}
