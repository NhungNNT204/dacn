package com.upnest.edu.modules.roadmap.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * RoadmapGroupChat - Phòng thảo luận nhóm cho từng lộ trình học tập
 * Cho phép học viên trong cùng lộ trình trao đổi, hỗ trợ nhau
 */
@Entity
@Table(name = "roadmap_group_chats", indexes = {
    @Index(name = "idx_roadmap_id", columnList = "roadmap_id"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapGroupChat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "roadmap_id", nullable = false)
    private Long roadmapId; // ID của lộ trình
    
    @Column(name = "roadmap_name", nullable = false)
    private String roadmapName; // Tên lộ trình (Java Full-stack, UI/UX Design, ...)
    
    @Column(name = "chat_room_id", nullable = false, unique = true)
    private String chatRoomId; // UUID cho phòng chat (dùng cho WebSocket)
    
    @Column(name = "member_count", nullable = false)
    private Integer memberCount = 0;
    
    @Column(name = "message_count", nullable = false)
    private Integer messageCount = 0;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;
}

