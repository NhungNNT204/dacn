package com.upnest.edu.modules.social.payload;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * MessageDTO - Response DTO cho tin nhắn
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
  private Long id;
  private Long chatGroupId;
  private Long senderId;
  private String senderName;
  private String senderAvatar;
  private String content;
  private String messageType;        // TEXT, IMAGE, VIDEO, EMOJI, FILE
  private String mediaUrl;
  private String mediaType;
  private Boolean isPinned;
  private Boolean isEdited;
  private Map<String, Integer> reactions;
  private LocalDateTime createdAt;
  private LocalDateTime editedAt;
}
