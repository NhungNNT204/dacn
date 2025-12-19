package com.upnest.edu.modules.messaging.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private String content;
    private String messageType; // TEXT, IMAGE, FILE, VIDEO, AUDIO
    private List<String> attachmentUrls; // URLs of uploaded files
}

