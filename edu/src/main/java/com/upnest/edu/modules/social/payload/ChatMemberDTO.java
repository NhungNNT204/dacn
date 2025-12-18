package com.upnest.edu.modules.social.payload;

import lombok.*;
import java.time.LocalDateTime;

/**
 * ChatMemberDTO - Response DTO cho thành viên chat
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMemberDTO {
  private Long id;
  private Long userId;
  private String userName;
  private String userAvatar;
  private String role;              // OWNER, ADMIN, MEMBER
  private Boolean isMuted;
  private LocalDateTime joinedAt;
}
