package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * EndCallRequest - Request DTO để kết thúc gọi
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EndCallRequest {
  private Long callId;
}
