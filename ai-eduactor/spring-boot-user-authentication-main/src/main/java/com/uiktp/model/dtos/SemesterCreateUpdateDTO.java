package com.uiktp.model.dtos;

import lombok.Data;

import java.util.List;

@Data
public class SemesterCreateUpdateDTO {
    private Long id;
    private String name;
    private List<String> courses;

}
