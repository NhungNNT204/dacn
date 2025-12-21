package com.upnest.edu.modules.library.service;

import com.upnest.edu.modules.library.entity.LibraryItem;
import com.upnest.edu.modules.library.entity.LibraryNote;
import com.upnest.edu.modules.library.payload.LibraryItemDTO;
import com.upnest.edu.modules.library.repository.LibraryItemRepository;
import com.upnest.edu.modules.library.repository.LibraryNoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * LibraryService - Service xử lý logic cho thư viện số
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class LibraryService {

    private final LibraryItemRepository libraryItemRepository;
    private final LibraryNoteRepository libraryNoteRepository;

    /**
     * Lấy danh sách tài liệu theo filter
     */
    public List<LibraryItemDTO> getLibraryItems(String category, String sortBy) {
        log.info("Getting library items - category: {}, sortBy: {}", category, sortBy);

        List<LibraryItem> items;

        // Filter by category
        if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("all")) {
            if (category.equalsIgnoreCase("ebooks")) {
                // E-books: PDF, EPUB
                items = libraryItemRepository.findByFileTypeOrderByCreatedAtDesc("PDF");
                items.addAll(libraryItemRepository.findByFileTypeOrderByCreatedAtDesc("EPUB"));
            } else if (category.equalsIgnoreCase("videos")) {
                // Videos: MP4
                items = libraryItemRepository.findByFileTypeOrderByCreatedAtDesc("MP4");
            } else if (category.equalsIgnoreCase("documents")) {
                // Documents: PPTX, DOCX
                items = libraryItemRepository.findByFileTypeOrderByCreatedAtDesc("PPTX");
                items.addAll(libraryItemRepository.findByFileTypeOrderByCreatedAtDesc("DOCX"));
            } else {
                items = libraryItemRepository.findByCategory(category);
            }
        } else {
            // All items
            items = libraryItemRepository.findByStatus(LibraryItem.ItemStatus.PUBLISHED);
        }

        // Sort
        if (sortBy != null && sortBy.equalsIgnoreCase("popular")) {
            items = items.stream()
                    .sorted((a, b) -> b.getDownloadCount().compareTo(a.getDownloadCount()))
                    .collect(Collectors.toList());
        }

        return items.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết một library item
     */
    @Transactional(readOnly = true)
    public LibraryItemDTO getLibraryItem(Long itemId) {
        log.info("Getting library item: {}", itemId);
        LibraryItem item = libraryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Library item not found: " + itemId));
        return mapToDTO(item);
    }

    /**
     * Lưu ghi chú của user cho library item
     */
    public void saveNote(Long itemId, Long userId, String content) {
        log.info("Saving note for item {} by user {}", itemId, userId);
        
        LibraryItem item = libraryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Library item not found: " + itemId));
        
        LibraryNote note = libraryNoteRepository.findByUserIdAndLibraryItemId(userId, itemId)
                .map(existingNote -> {
                    existingNote.setContent(content);
                    return existingNote;
                })
                .orElse(LibraryNote.builder()
                        .userId(userId)
                        .libraryItem(item)
                        .content(content)
                        .build());
        
        libraryNoteRepository.save(note);
        log.info("Note saved successfully");
    }


    /**
     * Tăng lượt tải xuống
     */
    public void incrementDownloadCount(Long itemId) {
        LibraryItem item = libraryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Library item not found"));
        item.setDownloadCount(item.getDownloadCount() + 1);
        libraryItemRepository.save(item);
        log.info("Download count incremented for item: {}", itemId);
    }

    /**
     * Tăng lượt xem
     */
    public void incrementViewCount(Long itemId) {
        LibraryItem item = libraryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Library item not found"));
        item.setViewCount(item.getViewCount() + 1);
        libraryItemRepository.save(item);
        log.info("View count incremented for item: {}", itemId);
    }

    /**
     * Map LibraryItem to LibraryItemDTO
     */
    private LibraryItemDTO mapToDTO(LibraryItem item) {
        return LibraryItemDTO.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .fileType(item.getFileType())
                .category(item.getCategory())
                .fileUrl(item.getFileUrl())
                .thumbnailUrl(item.getThumbnailUrl())
                .author(item.getAuthor())
                .rating(item.getRating())
                .ratingCount(item.getRatingCount())
                .downloadCount(item.getDownloadCount())
                .viewCount(item.getViewCount())
                .fileSize(item.getFileSize())
                .fileSizeFormatted(formatFileSize(item.getFileSize()))
                .status(item.getStatus().name())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    /**
     * Format file size: bytes -> "2.5 MB", "150 KB"
     */
    private String formatFileSize(Long bytes) {
        if (bytes == null || bytes == 0) return "0 B";
        
        double kb = bytes / 1024.0;
        if (kb < 1024) {
            return String.format("%.1f KB", kb);
        }
        
        double mb = kb / 1024.0;
        return String.format("%.1f MB", mb);
    }
}
