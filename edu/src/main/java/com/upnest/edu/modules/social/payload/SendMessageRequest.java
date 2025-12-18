package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * SendMessageRequest - Request DTO để gửi tin nhắn
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
  private Long chatGroupId;
  private Long senderId;
  private String content;
  private String senderName;
  private String senderAvatar;
}
