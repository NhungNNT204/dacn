package com.upnest.edu.modules.social.payload;

import lombok.*;
import java.time.LocalDateTime;

/**
 * UnreadCountDTO - Response DTO cho số tin nhắn chưa đọc
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnreadCountDTO {
  private Long chatGroupId;
  private Integer unreadCount;
  private LocalDateTime lastReadAt;
}
