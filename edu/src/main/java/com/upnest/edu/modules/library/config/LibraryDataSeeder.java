package com.upnest.edu.modules.library.config;

import com.upnest.edu.modules.library.entity.LibraryItem;
import com.upnest.edu.modules.library.repository.LibraryItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * LibraryDataSeeder - Seed dữ liệu mẫu cho thư viện số
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LibraryDataSeeder implements CommandLineRunner {

    private final LibraryItemRepository libraryItemRepository;

    @Override
    public void run(String... args) {
        if (libraryItemRepository.count() > 0) {
            log.info("Library items already exist, skipping seed");
            return;
        }

        log.info("Seeding library data...");

        // PDF E-book
        LibraryItem item1 = LibraryItem.builder()
                .title("Cấu trúc dữ liệu và Giải thuật cho người mới")
                .description("Tài liệu học tập về cấu trúc dữ liệu và giải thuật từ cơ bản đến nâng cao")
                .fileType("PDF")
                .category("LAP_TRINH")
                .fileUrl("/library/files/ds-algo-beginner.pdf")
                .thumbnailUrl("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800")
                .author("THS. NGUYỄN VĂN A")
                .rating(4.8)
                .ratingCount(320)
                .downloadCount(1240)
                .viewCount(3500)
                .fileSize(5242880L) // 5 MB
                .status(LibraryItem.ItemStatus.PUBLISHED)
                .build();

        // MP4 Video
        LibraryItem item2 = LibraryItem.builder()
                .title("VIDEO SERIES: LÀM CHỦ SPRING BOOT TRONG 30 NGÀY")
                .description("Series video học Spring Boot từ cơ bản đến nâng cao trong 30 ngày")
                .fileType("MP4")
                .category("BACKEND")
                .fileUrl("/library/files/spring-boot-series.mp4")
                .thumbnailUrl("https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800")
                .author("CÔ MINH THƯ")
                .rating(5.0)
                .ratingCount(450)
                .downloadCount(3500)
                .viewCount(8900)
                .fileSize(104857600L) // 100 MB
                .status(LibraryItem.ItemStatus.PUBLISHED)
                .build();

        // PPTX Presentation
        LibraryItem item3 = LibraryItem.builder()
                .title("UI/UX Design Principles - Slide Deck")
                .description("Slide trình bày về các nguyên tắc thiết kế UI/UX hiện đại")
                .fileType("PPTX")
                .category("DESIGN")
                .fileUrl("/library/files/ui-ux-design.pptx")
                .thumbnailUrl("https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800")
                .author("THS. TRẦN THỊ B")
                .rating(4.7)
                .ratingCount(180)
                .downloadCount(890)
                .viewCount(2100)
                .fileSize(8388608L) // 8 MB
                .status(LibraryItem.ItemStatus.PUBLISHED)
                .build();

        // EPUB E-book
        LibraryItem item4 = LibraryItem.builder()
                .title("Clean Code - Mã sạch trong lập trình hướng đối tượng")
                .description("E-book về kỹ thuật viết mã sạch và dễ đọc trong lập trình hướng đối tượng")
                .fileType("EPUB")
                .category("LAP_TRINH")
                .fileUrl("/library/files/clean-code.epub")
                .thumbnailUrl("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800")
                .author("ROBERT C. MARTIN")
                .rating(4.9)
                .ratingCount(520)
                .downloadCount(2100)
                .viewCount(5600)
                .fileSize(3145728L) // 3 MB
                .status(LibraryItem.ItemStatus.PUBLISHED)
                .build();

        libraryItemRepository.save(item1);
        libraryItemRepository.save(item2);
        libraryItemRepository.save(item3);
        libraryItemRepository.save(item4);

        log.info("Seeded {} library items", libraryItemRepository.count());
    }
}

