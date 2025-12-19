package com.upnest.edu.modules.learning.payload;

import com.upnest.edu.modules.learning.entity.CareerTrack;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO cho CareerTrack
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerTrackDTO {
    private Long id;
    private String code;
    private String name;
    private String description;
    private String icon;
    private String color;
    private List<RoadmapStepDTO> steps;

    public static CareerTrackDTO fromEntity(CareerTrack track, List<RoadmapStepDTO> steps) {
        return CareerTrackDTO.builder()
                .id(track.getId())
                .code(track.getCode())
                .name(track.getName())
                .description(track.getDescription())
                .icon(track.getIcon())
                .color(track.getColor())
                .steps(steps)
                .build();
    }
    
    public static CareerTrackDTO simple(CareerTrack track) {
        return CareerTrackDTO.builder()
                .id(track.getId())
                .code(track.getCode())
                .name(track.getName())
                .description(track.getDescription())
                .icon(track.getIcon())
                .color(track.getColor())
                .build();
    }
}

