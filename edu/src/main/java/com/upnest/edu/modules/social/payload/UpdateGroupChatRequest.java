package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * UpdateGroupChatRequest - Request DTO để cập nhật thông tin nhóm
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateGroupChatRequest {
  private String groupName;
  private String groupDescription;
  private String groupAvatar;
}
