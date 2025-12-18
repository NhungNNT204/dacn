package com.upnest.edu.modules.social.payload;

import lombok.*;
import java.time.LocalDateTime;

/**
 * WebSocketMessageDTO - DTO cho WebSocket messages
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessageDTO {
  private String type;              // message, typing, call, reaction, etc.
  private Object payload;           // Dynamic payload dựa vào type
  private LocalDateTime timestamp;
}
