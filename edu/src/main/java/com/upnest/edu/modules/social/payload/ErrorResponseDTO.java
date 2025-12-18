package com.upnest.edu.modules.social.payload;

import lombok.*;
import java.time.LocalDateTime;

/**
 * ErrorResponseDTO - Generic error response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseDTO {
  private String message;
  private String errorCode;
  private LocalDateTime timestamp;
  private String path;
}
