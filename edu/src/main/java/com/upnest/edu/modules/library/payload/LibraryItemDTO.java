package com.upnest.edu.modules.library.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LibraryItemDTO {
    private Long id;
    private String title;
    private String description;
    private String fileType;
    private String category;
    private String fileUrl;
    private String thumbnailUrl;
    private String author;
    private Double rating;
    private Integer ratingCount;
    private Integer downloadCount;
    private Integer viewCount;
    private Long fileSize;
    private String fileSizeFormatted; // "2.5 MB", "150 KB"
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

