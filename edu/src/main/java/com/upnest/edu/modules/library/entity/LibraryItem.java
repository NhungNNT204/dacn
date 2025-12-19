package com.upnest.edu.modules.library.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * LibraryItem - Tài liệu trong thư viện số
 */
@Entity
@Table(name = "library_items", indexes = {
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_file_type", columnList = "file_type"),
    @Index(name = "idx_created_at", columnList = "created_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long id;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Loại file: PDF, EPUB, MP4, PPTX, DOCX, etc.
     */
    @Column(name = "file_type", nullable = false, length = 20)
    private String fileType;

    /**
     * Category: LAP_TRINH, BACKEND, FRONTEND, DESIGN, etc.
     */
    @Column(name = "category", nullable = false, length = 50)
    private String category;

    /**
     * URL file
     */
    @Column(name = "file_url", nullable = false, length = 1000)
    private String fileUrl;

    /**
     * URL thumbnail
     */
    @Column(name = "thumbnail_url", length = 1000)
    private String thumbnailUrl;

    /**
     * Tác giả
     */
    @Column(name = "author", length = 200)
    private String author;

    /**
     * Đánh giá trung bình (0-5)
     */
    @Column(name = "rating", columnDefinition = "DECIMAL(3,2) DEFAULT 0.00")
    @Builder.Default
    private Double rating = 0.0;

    /**
     * Số lượt đánh giá
     */
    @Column(name = "rating_count", nullable = false)
    @Builder.Default
    private Integer ratingCount = 0;

    /**
     * Số lượt tải xuống
     */
    @Column(name = "download_count", nullable = false)
    @Builder.Default
    private Integer downloadCount = 0;

    /**
     * Số lượt xem
     */
    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    /**
     * Kích thước file (bytes)
     */
    @Column(name = "file_size")
    private Long fileSize;

    /**
     * Trạng thái: DRAFT, PUBLISHED, ARCHIVED
     */
    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ItemStatus status = ItemStatus.PUBLISHED;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ItemStatus {
        DRAFT,
        PUBLISHED,
        ARCHIVED
    }
}

