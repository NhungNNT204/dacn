package com.upnest.edu.modules.social.payload;

import lombok.*;
import java.util.List;

/**
 * PaginatedMessageResponse - Response DTO cho trang tin nhắn
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedMessageResponse {
  private List<MessageDTO> messages;
  private Integer page;
  private Integer pageSize;
  private Long totalElements;
  private Integer totalPages;
}
