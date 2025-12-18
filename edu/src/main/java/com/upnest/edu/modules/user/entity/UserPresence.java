package com.upnest.edu.modules.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * UserPresence - trạng thái realtime (online, đang học khóa gì)
 * Lưu theo userId để hiển thị trong Friends/Followers list.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_presence")
public class UserPresence {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Builder.Default
    @Column(name = "is_online", nullable = false)
    private Boolean online = false;

    @Column(name = "current_course_title", length = 255)
    private String currentCourseTitle;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}






