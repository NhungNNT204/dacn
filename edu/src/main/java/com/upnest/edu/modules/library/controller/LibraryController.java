package com.upnest.edu.modules.library.controller;

import com.upnest.edu.modules.library.entity.Document;
import com.upnest.edu.modules.library.service.LibraryService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

/**
 * LibraryController - REST API cho quản lý thư viện tài liệu số
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/library")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class LibraryController {
    
    private final LibraryService libraryService;
    
    // Helper để lấy userId từ authentication
    private Long getUserId(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return 1L; // Mock for development
        }
        try {
            // Extract from JWT or UserDetails
            return Long.parseLong(authentication.getName());
        } catch (Exception e) {
            return 1L; // Mock for development
        }
    }
    
    /**
     * POST /api/v1/library/upload
     * Upload tài liệu mới
     */
    @PostMapping("/upload")
    public ResponseEntity<DocumentDTO> uploadDocument(
            Authentication authentication,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false) Document.DocumentCategory category,
            @RequestParam(value = "isPublic", defaultValue = "false") Boolean isPublic) {
        
        Long userId = getUserId(authentication);
        log.info("Uploading document by user: {}", userId);
        
        try {
            // Get user name (mock for now)
            String userName = "User " + userId;
            
            Document document = libraryService.uploadDocument(
                userId, userName, title, description, category, isPublic, file
            );
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(toDTO(document));
        } catch (IOException e) {
            log.error("Error uploading document", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * GET /api/v1/library/my-documents
     * Lấy danh sách tài liệu của user
     */
    @GetMapping("/my-documents")
    public ResponseEntity<PaginatedDocumentResponse> getMyDocuments(
            Authentication authentication,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Long userId = getUserId(authentication);
        Page<Document> page = libraryService.getUserDocuments(userId, pageable);
        
        return ResponseEntity.ok(PaginatedDocumentResponse.builder()
            .documents(page.getContent().stream().map(this::toDTO).collect(Collectors.toList()))
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .currentPage(page.getNumber())
            .pageSize(page.getSize())
            .hasNext(page.hasNext())
            .hasPrevious(page.hasPrevious())
            .build());
    }
    
    /**
     * GET /api/v1/library/public
     * Lấy danh sách tài liệu công khai
     */
    @GetMapping("/public")
    public ResponseEntity<PaginatedDocumentResponse> getPublicDocuments(
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<Document> page = libraryService.getPublicDocuments(pageable);
        
        return ResponseEntity.ok(PaginatedDocumentResponse.builder()
            .documents(page.getContent().stream().map(this::toDTO).collect(Collectors.toList()))
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .currentPage(page.getNumber())
            .pageSize(page.getSize())
            .hasNext(page.hasNext())
            .hasPrevious(page.hasPrevious())
            .build());
    }
    
    /**
     * GET /api/v1/library/search
     * Tìm kiếm tài liệu
     */
    @GetMapping("/search")
    public ResponseEntity<PaginatedDocumentResponse> searchDocuments(
            Authentication authentication,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "category", required = false) Document.DocumentCategory category,
            @RequestParam(value = "isPublic", required = false) Boolean isPublic,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Long userId = authentication != null ? getUserId(authentication) : null;
        Page<Document> page = libraryService.searchDocuments(
            userId, category, isPublic, keyword != null ? keyword : "", pageable
        );
        
        return ResponseEntity.ok(PaginatedDocumentResponse.builder()
            .documents(page.getContent().stream().map(this::toDTO).collect(Collectors.toList()))
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .currentPage(page.getNumber())
            .pageSize(page.getSize())
            .hasNext(page.hasNext())
            .hasPrevious(page.hasPrevious())
            .build());
    }
    
    /**
     * GET /api/v1/library/popular
     * Lấy tài liệu phổ biến
     */
    @GetMapping("/popular")
    public ResponseEntity<List<DocumentDTO>> getPopularDocuments() {
        List<Document> documents = libraryService.getPopularDocuments();
        return ResponseEntity.ok(
            documents.stream().map(this::toDTO).collect(Collectors.toList())
        );
    }
    
    /**
     * GET /api/v1/library/{id}/download
     * Download tài liệu
     */
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
        try {
            Document document = libraryService.incrementDownloadCount(id);
            Path filePath = Paths.get(document.getFilePath());
            
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            
            byte[] fileContent = Files.readAllBytes(filePath);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(document.getMimeType()));
            headers.setContentDispositionFormData("attachment", document.getFileName());
            headers.setContentLength(fileContent.length);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(fileContent);
        } catch (IOException e) {
            log.error("Error downloading document", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * DELETE /api/v1/library/{id}
     * Xóa tài liệu
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(
            Authentication authentication,
            @PathVariable Long id) {
        
        Long userId = getUserId(authentication);
        try {
            libraryService.deleteDocument(id, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * GET /api/v1/library/stats
     * Thống kê tài liệu của user
     */
    @GetMapping("/stats")
    public ResponseEntity<LibraryStatsResponse> getStats(Authentication authentication) {
        Long userId = getUserId(authentication);
        Long count = libraryService.getUserDocumentCount(userId);
        
        return ResponseEntity.ok(LibraryStatsResponse.builder()
            .totalDocuments(count)
            .build());
    }
    
    // DTOs
    @Data
    @lombok.Builder
    public static class DocumentDTO {
        private Long id;
        private Long userId;
        private String userName;
        private String title;
        private String description;
        private String fileName;
        private Long fileSize;
        private String mimeType;
        private Document.DocumentCategory category;
        private Document.DocumentType documentType;
        private Boolean isPublic;
        private Long downloadCount;
        private Long viewCount;
        private String createdAt;
    }
    
    @Data
    @lombok.Builder
    public static class PaginatedDocumentResponse {
        private List<DocumentDTO> documents;
        private Long totalElements;
        private Integer totalPages;
        private Integer currentPage;
        private Integer pageSize;
        private Boolean hasNext;
        private Boolean hasPrevious;
    }
    
    @Data
    @lombok.Builder
    public static class LibraryStatsResponse {
        private Long totalDocuments;
    }
    
    private DocumentDTO toDTO(Document document) {
        return DocumentDTO.builder()
            .id(document.getId())
            .userId(document.getUserId())
            .userName(document.getUserName())
            .title(document.getTitle())
            .description(document.getDescription())
            .fileName(document.getFileName())
            .fileSize(document.getFileSize())
            .mimeType(document.getMimeType())
            .category(document.getCategory())
            .documentType(document.getDocumentType())
            .isPublic(document.getIsPublic())
            .downloadCount(document.getDownloadCount())
            .viewCount(document.getViewCount())
            .createdAt(document.getCreatedAt().toString())
            .build();
    }
}

