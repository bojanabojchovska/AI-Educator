package com.uiktp.service.Implementation;

import com.uiktp.model.Course;
import com.uiktp.model.Rating;
import com.uiktp.model.User;
import com.uiktp.model.dtos.RatingDTO;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.RatingRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.RatingService;
import org.springframework.stereotype.Service;

import javax.security.auth.Subject;
import java.time.LocalDate;
import java.util.List;

@Service
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public RatingServiceImpl(RatingRepository ratingRepository, UserRepository userRepository,
                         CourseRepository courseRepository) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        }
    public Rating addRating(RatingDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Rating rating = new Rating();
        rating.setRatingValue(dto.getRatingValue());
        rating.setUser(user);
        rating.setCourse(course);
        rating.setDate(LocalDate.now());

        return ratingRepository.save(rating);
    }

    public double getAverageRating(Long courseId) {
        List<Rating> ratings = ratingRepository.findByCourseId(courseId);
        return ratings.stream().mapToInt(Rating::getRatingValue).average().orElse(0.0);
    }

}
