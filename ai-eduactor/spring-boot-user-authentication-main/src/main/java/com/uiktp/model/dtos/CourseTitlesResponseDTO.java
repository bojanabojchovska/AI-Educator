package com.uiktp.model.dtos;

import java.util.List;

import lombok.Data;

@Data
public class CourseTitlesResponseDTO {
    private List<String> recommended_courses;
}
