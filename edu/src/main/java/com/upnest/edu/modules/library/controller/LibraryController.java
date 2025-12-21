package com.upnest.edu.modules.library.controller;

import com.upnest.edu.modules.library.payload.LibraryItemDTO;
import com.upnest.edu.modules.library.service.LibraryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * LibraryController - API endpoints cho thư viện số
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/library")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LibraryController {

    private final LibraryService libraryService;

    /**
     * GET /api/v1/library?category=all|ebooks|videos|documents&sortBy=popular
     */
    @GetMapping
    public ResponseEntity<List<LibraryItemDTO>> getLibraryItems(
            @RequestParam(required = false, defaultValue = "all") String category,
            @RequestParam(required = false, defaultValue = "latest") String sortBy) {
        List<LibraryItemDTO> items = libraryService.getLibraryItems(category, sortBy);
        return ResponseEntity.ok(items);
    }

    /**
     * GET /api/v1/library/{itemId} - Lấy chi tiết library item
     */
    @GetMapping("/{itemId}")
    public ResponseEntity<LibraryItemDTO> getLibraryItem(@PathVariable Long itemId) {
        LibraryItemDTO item = libraryService.getLibraryItem(itemId);
        return ResponseEntity.ok(item);
    }

    /**
     * GET /api/v1/library/{itemId}/download - Lấy fileUrl để tải xuống
     */
    @GetMapping("/{itemId}/download")
    public ResponseEntity<Map<String, String>> getDownloadUrl(@PathVariable Long itemId) {
        LibraryItemDTO item = libraryService.getLibraryItem(itemId);
        return ResponseEntity.ok(Map.of("fileUrl", item.getFileUrl(), "title", item.getTitle()));
    }

    /**
     * POST /api/v1/library/{itemId}/download - Tăng lượt tải xuống
     */
    @PostMapping("/{itemId}/download")
    public ResponseEntity<?> incrementDownload(@PathVariable Long itemId) {
        libraryService.incrementDownloadCount(itemId);
        return ResponseEntity.ok().build();
    }

    /**
     * POST /api/v1/library/{itemId}/view - Tăng lượt xem
     */
    @PostMapping("/{itemId}/view")
    public ResponseEntity<?> incrementView(@PathVariable Long itemId) {
        libraryService.incrementViewCount(itemId);
        return ResponseEntity.ok().build();
    }

    /**
     * POST /api/v1/library/{itemId}/notes - Lưu ghi chú
     */
    @PostMapping("/{itemId}/notes")
    public ResponseEntity<?> saveNote(
            @PathVariable Long itemId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        String content = request.get("content");
        libraryService.saveNote(itemId, userId, content);
        return ResponseEntity.ok().build();
    }
}
