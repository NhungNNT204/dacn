package com.upnest.edu.modules.learning.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request để cập nhật Career Track của user
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCareerTrackRequest {
    private String trackCode;
}

