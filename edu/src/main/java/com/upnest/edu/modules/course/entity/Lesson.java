package com.upnest.edu.modules.course.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String videoUrl;
    
    @Column(columnDefinition = "TEXT") // Để lưu nội dung dài
    private String content;
    
    private Integer orderIndex;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnore // Tránh vòng lặp khi chuyển sang JSON
    private Course course;
}