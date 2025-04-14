package com.uiktp.model.dtos;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RatingDTO {
    private int ratingValue;
    private Long userId;
    private Long courseId;
    public RatingDTO() {}

}
