package com.uiktp.model.dtos;

import java.util.List;

import com.uiktp.model.Course;

import lombok.Data;

@Data
public class CourseRecommendationResponseDTO {
    private List<Course> recommended_courses;
}
