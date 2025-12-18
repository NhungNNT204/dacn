package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * AnswerCallRequest - Request DTO để trả lời gọi
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerCallRequest {
  private Long callId;
}
