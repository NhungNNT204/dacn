package com.upnest.edu.modules.library.repository;

import com.upnest.edu.modules.library.entity.LibraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LibraryItemRepository extends JpaRepository<LibraryItem, Long> {
    List<LibraryItem> findByStatus(LibraryItem.ItemStatus status);
    List<LibraryItem> findByCategory(String category);
    List<LibraryItem> findByFileType(String fileType);
    
    @Query("SELECT l FROM LibraryItem l WHERE l.status = 'PUBLISHED' ORDER BY l.downloadCount DESC")
    List<LibraryItem> findPopularItems();
    
    @Query("SELECT l FROM LibraryItem l WHERE l.status = 'PUBLISHED' AND l.fileType = ?1 ORDER BY l.createdAt DESC")
    List<LibraryItem> findByFileTypeOrderByCreatedAtDesc(String fileType);
}

