package com.upnest.edu.modules.social.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho tín hiệu WebRTC (SDP / ICE) qua kênh STOMP
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebRTCSignalMessage {
  private Long conversationId;
  private Long fromUserId;
  private Long targetUserId; // null nếu broadcast tới cả room
  private String signalType; // offer | answer | candidate
  private String sdp;        // chứa SDP (offer/answer)
  private String candidate;  // ICE candidate (nếu có)
  private Object metadata;   // thông tin phụ (device, quality, etc.)
}

