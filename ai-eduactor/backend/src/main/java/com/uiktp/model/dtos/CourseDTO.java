package com.uiktp.model.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private double avgRating;

    public CourseDTO(Long id, String title, String description, double avgRating) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.avgRating = avgRating;
    }

    public CourseDTO(Long id, String title, String description) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.avgRating = 0;
    }
}

