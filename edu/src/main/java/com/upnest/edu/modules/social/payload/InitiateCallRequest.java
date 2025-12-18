package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * InitiateCallRequest - Request DTO để bắt đầu gọi
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InitiateCallRequest {
  private Long chatGroupId;
  private Long callerId;
  private Long receiverId;
  private String callType;          // VOICE, VIDEO
}
