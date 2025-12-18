package com.upnest.edu.modules.social.payload;

import lombok.*;
import java.time.LocalDateTime;

/**
 * ConnectionStatusDTO - DTO cho trạng thái kết nối
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionStatusDTO {
  private String status;            // connected, disconnected, error
  private String userId;
  private LocalDateTime connectedAt;
}
