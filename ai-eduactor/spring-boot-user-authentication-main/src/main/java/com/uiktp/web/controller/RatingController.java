package com.uiktp.web.controller;

import com.uiktp.model.Rating;
import com.uiktp.model.dtos.RatingDTO;
import com.uiktp.service.Interface.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<Rating> addRating(@RequestBody RatingDTO dto) {
        return ResponseEntity.ok(ratingService.addRating(dto));
    }

    @GetMapping("/average/{subjectId}")
    public ResponseEntity<Double> getAverage(@PathVariable Long subjectId) {
        return ResponseEntity.ok(ratingService.getAverageRating(subjectId));
    }
}

