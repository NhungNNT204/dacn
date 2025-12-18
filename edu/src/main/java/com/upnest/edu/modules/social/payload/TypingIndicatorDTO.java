package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * TypingIndicatorDTO - DTO cho chỉ báo gõ
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingIndicatorDTO {
  private Long chatGroupId;
  private Long userId;
  private String userName;
  private Boolean isTyping;
}
