package com.upnest.edu.modules.social.payload;

import lombok.*;
import java.util.List;

/**
 * PaginatedConversationResponse - Response DTO cho trang cuộc trò cnhungện
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedConversationResponse {
  private List<ChatGroupDTO> conversations;
  private Integer page;
  private Integer pageSize;
  private Long totalElements;
  private Integer totalPages;
}
