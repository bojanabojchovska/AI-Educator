package com.uiktp.model.dtos;

import java.util.List;

import com.uiktp.model.Course;

import lombok.Data;

@Data
public class CourseRecommendationResponseDTO {
    private List<CourseDTO> recommended_courses;

    public List<CourseDTO> getRecommended_courses() {
        return recommended_courses;
    }

    public void setRecommended_courses(List<CourseDTO> recommended_courses) {
        this.recommended_courses = recommended_courses;
    }
}
