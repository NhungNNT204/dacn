package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * EditMessageRequest - Request DTO để chỉnh sửa tin nhắn
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditMessageRequest {
  private String newContent;
}
