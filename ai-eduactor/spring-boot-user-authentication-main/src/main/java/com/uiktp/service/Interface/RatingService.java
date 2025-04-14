package com.uiktp.service.Interface;

import com.uiktp.model.Rating;
import com.uiktp.model.dtos.RatingDTO;
import org.springframework.stereotype.Service;

@Service
public interface RatingService {
    Rating addRating(RatingDTO dto);

    double getAverageRating(Long subjectId);
}

