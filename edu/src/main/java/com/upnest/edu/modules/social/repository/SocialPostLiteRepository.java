package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.SocialPostLite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SocialPostLiteRepository extends JpaRepository<SocialPostLite, Long> {
    @Query("SELECT p FROM SocialPostLite p WHERE LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.authorName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<SocialPostLite> findByContentContainingIgnoreCaseOrAuthorNameContainingIgnoreCase(
            @Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM SocialPostLite p WHERE LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.authorName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<SocialPostLite> findByContentContainingIgnoreCaseOrAuthorFullNameContainingIgnoreCase(
            @Param("keyword") String keyword, Pageable pageable);
    
    Page<SocialPostLite> findByDeletedFalseAndHiddenFalse(Pageable pageable);
}

