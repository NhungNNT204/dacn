package com.upnest.edu.modules.messaging.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * FileUploadController - API để upload file cho messaging
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/messaging/upload")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads/messages/";

    /**
     * POST /api/v1/messaging/upload
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "File is empty"));
            }

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
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Construct file URL (in production, use actual file server URL)
            String fileUrl = "/api/v1/messaging/files/" + uniqueFilename;

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("fileUrl", fileUrl);
            response.put("fileName", originalFilename);
            response.put("fileSize", file.getSize());
            response.put("fileType", file.getContentType());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error uploading file", e);
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "Upload failed: " + e.getMessage()));
        }
    }
}

