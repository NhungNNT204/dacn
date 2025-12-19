package com.upnest.edu.modules.messaging.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private String senderAvatarInitial; // "H", "MT"
    private String content;
    private String messageType;
    private String status;
    private String timeFormatted; // "09:05 AM"
    private LocalDateTime createdAt;
    private List<AttachmentDTO> attachments;
    private Boolean isFromMe;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class AttachmentDTO {
    private Long id;
    private String fileName;
    private String fileUrl;
    private String fileType;
    private Long fileSize;
    private String fileSizeFormatted; // "2.5 MB"
}

