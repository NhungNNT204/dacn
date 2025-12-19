package com.upnest.edu.modules.library.controller;

import com.upnest.edu.modules.library.payload.LibraryItemDTO;
import com.upnest.edu.modules.library.service.LibraryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
     * POST /api/v1/library/{itemId}/download
     */
    @PostMapping("/{itemId}/download")
    public ResponseEntity<?> incrementDownload(@PathVariable Long itemId) {
        libraryService.incrementDownloadCount(itemId);
        return ResponseEntity.ok().build();
    }

    /**
     * POST /api/v1/library/{itemId}/view
     */
    @PostMapping("/{itemId}/view")
    public ResponseEntity<?> incrementView(@PathVariable Long itemId) {
        libraryService.incrementViewCount(itemId);
        return ResponseEntity.ok().build();
    }
}
