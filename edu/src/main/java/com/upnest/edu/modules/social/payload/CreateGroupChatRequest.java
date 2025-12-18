package com.upnest.edu.modules.social.payload;

import lombok.*;
import java.util.List;

/**
 * CreateGroupChatRequest - Request DTO để tạo nhóm chat
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateGroupChatRequest {
  private String groupName;          // Tên nhóm chat
  private Long groupOwnerId;         // ID chủ nhóm
  private List<Long> memberIds;      // Danh sách ID thành viên
  private String groupDescription;   // Mô tả nhóm (optional)
  private String groupAvatar;        // Avatar nhóm (optional)
}
