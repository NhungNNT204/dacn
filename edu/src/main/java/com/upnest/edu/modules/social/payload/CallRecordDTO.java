package com.upnest.edu.modules.social.payload;

import lombok.*;
import java.time.LocalDateTime;

/**
 * CallRecordDTO - Response DTO cho lịch sử gọi
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CallRecordDTO {
  private Long id;
  private Long callerId;
  private Long receiverId;
  private String callType;          // VOICE, VIDEO, GROUP
  private String callStatus;        // INITIATED, RINGING, ACCEPTED, REJECTED, ENDED, MISSED
  private Long durationSeconds;
  private Boolean isMissed;
  private LocalDateTime createdAt;
}
