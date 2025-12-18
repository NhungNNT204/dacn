package com.upnest.edu.modules.social.payload;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportPostRequest {
    private String reportType;   // SPAM, HARASSMENT, HATE_SPEECH, EXPLICIT, OTHER
    private String reason;
    private String description;
}
