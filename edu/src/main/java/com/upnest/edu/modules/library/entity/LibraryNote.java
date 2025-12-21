package com.upnest.edu.modules.library.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * LibraryNote - Ghi chú của user cho library item
 */
@Entity
@Table(name = "library_notes", indexes = {
    @Index(name = "idx_user_item", columnList = "user_id, library_item_id", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryNote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "library_item_id", nullable = false)
    private LibraryItem libraryItem;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

