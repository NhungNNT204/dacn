package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * RejectCallRequest - Request DTO để từ chối gọi
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RejectCallRequest {
  private Long callId;
}
