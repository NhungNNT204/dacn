package com.upnest.edu.modules.messaging.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private Long id;
    private String conversationType;
    private String name;
    private String avatarUrl;
    private String avatarColor;
    private String avatar; // Initials like "MT"
    private String lastMessage;
    private String lastMessageSenderName;
    private LocalDateTime lastMessageTime;
    private String lastMessageTimeFormatted; // "2 phút trước"
    private Integer unreadCount;
    private Boolean isOnline;
    private String role; // "Giảng viên", "Học viên", etc.
}

