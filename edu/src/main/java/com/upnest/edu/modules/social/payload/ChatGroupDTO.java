package com.upnest.edu.modules.social.payload;

import lombok.*;
import java.time.LocalDateTime;

/**
 * ChatGroupDTO - Response DTO cho nhóm chat
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatGroupDTO {
  private Long id;
  private Boolean isGroup;
  private String groupName;
  private Long groupOwnerId;
  private Integer memberCount;
  private LocalDateTime lastMessageAt;
  private LocalDateTime createdAt;
}
