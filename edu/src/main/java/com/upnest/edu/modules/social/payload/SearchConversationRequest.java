package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * SearchConversationRequest - Request DTO để tìm kiếm cuộc trò chuyện
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchConversationRequest {
  private Long userId;
  private String keyword;
  private String type;              // all, group, private
}
