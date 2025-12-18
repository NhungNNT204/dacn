package com.upnest.edu.modules.library.repository;

import com.upnest.edu.modules.library.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    Page<Document> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    Page<Document> findByIsPublicTrueOrderByCreatedAtDesc(Pageable pageable);
    
    Page<Document> findByCategoryOrderByCreatedAtDesc(Document.DocumentCategory category, Pageable pageable);
    
    @Query("SELECT d FROM Document d WHERE " +
           "(:userId IS NULL OR d.userId = :userId) AND " +
           "(:category IS NULL OR d.category = :category) AND " +
           "(:isPublic IS NULL OR d.isPublic = :isPublic) AND " +
           "(LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY d.createdAt DESC")
    Page<Document> searchDocuments(
        @Param("userId") Long userId,
        @Param("category") Document.DocumentCategory category,
        @Param("isPublic") Boolean isPublic,
        @Param("keyword") String keyword,
        Pageable pageable
    );
    
    List<Document> findTop10ByIsPublicTrueOrderByDownloadCountDesc();
    
    Long countByUserId(Long userId);
}

