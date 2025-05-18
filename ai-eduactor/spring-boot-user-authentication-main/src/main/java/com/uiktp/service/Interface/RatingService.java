package com.uiktp.service.Interface;

import com.uiktp.model.Rating;
import org.springframework.stereotype.Service;

@Service
public interface RatingService {
    public Rating addRating(Long courseId, int ratingValue);
    double getAverageRating(Long courseId);
}

