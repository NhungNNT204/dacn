package com.upnest.edu.modules.social.payload;

import lombok.*;

/**
 * SearchMessageRequest - Request DTO để tìm kiếm tin nhắn
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchMessageRequest {
  private Long chatGroupId;
  private String keyword;
  private String messageType;       // Optional filter
  private Integer page;
  private Integer limit;
}
