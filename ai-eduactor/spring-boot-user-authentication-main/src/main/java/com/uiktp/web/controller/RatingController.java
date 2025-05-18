package com.uiktp.web.controller;

import com.uiktp.model.Rating;
import com.uiktp.service.Interface.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses/{courseId}/ratings")
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<Rating> addRating(@PathVariable Long courseId, @RequestParam int ratingValue) {
        return ResponseEntity.ok(ratingService.addRating(courseId, ratingValue));
    }

    @GetMapping("/average")
    public ResponseEntity<Double> getAverage(@PathVariable Long courseId) {
        return ResponseEntity.ok(ratingService.getAverageRating(courseId));
    }
}

