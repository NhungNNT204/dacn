package com.upnest.edu.modules.library.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/**
 * Document Entity - Quản lý tài liệu số trong thư viện
 */
@Entity
@Table(name = "documents", indexes = {
    @Index(name = "idx_document_user_id", columnList = "user_id"),
    @Index(name = "idx_document_category", columnList = "category"),
    @Index(name = "idx_document_created_at", columnList = "created_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "user_name", length = 255)
    private String userName;
    
    @Column(name = "title", nullable = false, length = 500)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "file_name", nullable = false, length = 500)
    private String fileName;
    
    @Column(name = "file_path", nullable = false, length = 1000)
    private String filePath;
    
    @Column(name = "file_size")
    private Long fileSize; // bytes
    
    @Column(name = "mime_type", length = 100)
    private String mimeType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category", length = 50)
    private DocumentCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", length = 50)
    private DocumentType documentType;
    
    @Column(name = "is_public", nullable = false)
    @Builder.Default
    private Boolean isPublic = false;
    
    @Column(name = "download_count")
    @Builder.Default
    private Long downloadCount = 0L;
    
    @Column(name = "view_count")
    @Builder.Default
    private Long viewCount = 0L;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum DocumentCategory {
        TEXTBOOK,           // Sách giáo khoa
        LECTURE_NOTES,      // Bài giảng
        ASSIGNMENT,         // Bài tập
        EXAM,              // Đề thi
        REFERENCE,         // Tài liệu tham khảo
        PRESENTATION,      // Slide tnhungết trình
        VIDEO,             // Video bài giảng
        AUDIO,             // Audio
        OTHER              // Khác
    }
    
    public enum DocumentType {
        PDF,
        DOC,
        DOCX,
        PPT,
        PPTX,
        XLS,
        XLSX,
        TXT,
        IMAGE,
        VIDEO,
        AUDIO,
        ZIP,
        OTHER
    }
}

