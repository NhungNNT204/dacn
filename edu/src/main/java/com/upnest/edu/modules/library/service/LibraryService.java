package com.upnest.edu.modules.library.service;

import com.upnest.edu.modules.library.entity.Document;
import com.upnest.edu.modules.library.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LibraryService {
    
    private final DocumentRepository documentRepository;
    private static final String UPLOAD_DIR = "uploads/documents/";
    
    @Transactional
    public Document uploadDocument(
            Long userId,
            String userName,
            String title,
            String description,
            Document.DocumentCategory category,
            Boolean isPublic,
            MultipartFile file) throws IOException {
        
        // Create upload directory if not exists
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".") 
            ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
            : "";
        String fileName = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(fileName);
        
        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Determine document type
        Document.DocumentType docType = determineDocumentType(file.getContentType(), extension);
        
        // Create document entity
        Document document = Document.builder()
            .userId(userId)
            .userName(userName)
            .title(title)
            .description(description)
            .fileName(originalFilename)
            .filePath(filePath.toString())
            .fileSize(file.getSize())
            .mimeType(file.getContentType())
            .category(category)
            .documentType(docType)
            .isPublic(isPublic != null ? isPublic : false)
            .downloadCount(0L)
            .viewCount(0L)
            .build();
        
        return documentRepository.save(document);
    }
    
    public Page<Document> getUserDocuments(Long userId, Pageable pageable) {
        return documentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }
    
    public Page<Document> getPublicDocuments(Pageable pageable) {
        return documentRepository.findByIsPublicTrueOrderByCreatedAtDesc(pageable);
    }
    
    public Page<Document> searchDocuments(
            Long userId,
            Document.DocumentCategory category,
            Boolean isPublic,
            String keyword,
            Pageable pageable) {
        return documentRepository.searchDocuments(userId, category, isPublic, keyword, pageable);
    }
    
    public List<Document> getPopularDocuments() {
        return documentRepository.findTop10ByIsPublicTrueOrderByDownloadCountDesc();
    }
    
    @Transactional
    public Document incrementDownloadCount(Long documentId) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        document.setDownloadCount(document.getDownloadCount() + 1);
        return documentRepository.save(document);
    }
    
    @Transactional
    public Document incrementViewCount(Long documentId) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        document.setViewCount(document.getViewCount() + 1);
        return documentRepository.save(document);
    }
    
    @Transactional
    public void deleteDocument(Long documentId, Long userId) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        
        if (!document.getUserId().equals(userId)) {
            throw new IllegalStateException("Not authorized to delete this document");
        }
        
        // Delete file
        try {
            Path filePath = Paths.get(document.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("Error deleting file: {}", document.getFilePath(), e);
        }
        
        documentRepository.delete(document);
    }
    
    public Long getUserDocumentCount(Long userId) {
        return documentRepository.countByUserId(userId);
    }
    
    private Document.DocumentType determineDocumentType(String mimeType, String extension) {
        if (mimeType != null) {
            if (mimeType.contains("pdf")) return Document.DocumentType.PDF;
            if (mimeType.contains("word") || mimeType.contains("document")) return Document.DocumentType.DOCX;
            if (mimeType.contains("presentation") || mimeType.contains("powerpoint")) return Document.DocumentType.PPTX;
            if (mimeType.contains("spreadsheet") || mimeType.contains("excel")) return Document.DocumentType.XLSX;
            if (mimeType.startsWith("image/")) return Document.DocumentType.IMAGE;
            if (mimeType.startsWith("video/")) return Document.DocumentType.VIDEO;
            if (mimeType.startsWith("audio/")) return Document.DocumentType.AUDIO;
        }
        
        if (extension != null) {
            String ext = extension.toLowerCase();
            if (ext.equals(".pdf")) return Document.DocumentType.PDF;
            if (ext.equals(".doc")) return Document.DocumentType.DOC;
            if (ext.equals(".docx")) return Document.DocumentType.DOCX;
            if (ext.equals(".ppt")) return Document.DocumentType.PPT;
            if (ext.equals(".pptx")) return Document.DocumentType.PPTX;
            if (ext.equals(".xls")) return Document.DocumentType.XLS;
            if (ext.equals(".xlsx")) return Document.DocumentType.XLSX;
            if (ext.equals(".txt")) return Document.DocumentType.TXT;
            if (ext.equals(".zip") || ext.equals(".rar")) return Document.DocumentType.ZIP;
        }
        
        return Document.DocumentType.OTHER;
    }
}

