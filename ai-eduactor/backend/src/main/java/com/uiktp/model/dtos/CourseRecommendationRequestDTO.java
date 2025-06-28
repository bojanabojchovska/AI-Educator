package com.uiktp.model.dtos;

import java.util.List;

import lombok.Data;

@Data
public class CourseRecommendationRequestDTO {
    private List<String> taken_courses;
    private List<String> remaining_courses;
}
