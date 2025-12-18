package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * CreatePrivateChatRequest - Request DTO để tạo chat 1-1
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePrivateChatRequest {
  private Long userId1;              // ID người dùng thứ nhất
  private Long userId2;              // ID người dùng thứ hai
}
