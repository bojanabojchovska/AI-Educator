package com.uiktp.service.Implementation;

import com.uiktp.model.Course;
import com.uiktp.model.Rating;
import com.uiktp.model.User;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.RatingRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.AuthenticationService;
import com.uiktp.service.Interface.RatingService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final AuthenticationService authenticationService;

    public RatingServiceImpl(RatingRepository ratingRepository, UserRepository userRepository,
                             CourseRepository courseRepository, AuthenticationService authenticationService) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.authenticationService = authenticationService;
    }

    @Override
    public Rating addRating(Long courseId, int ratingValue) {
        User user = authenticationService.getCurrentlyLoggedInUser();
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId.toString()));

        Rating existingRating = ratingRepository.findRatingByStudentAndCourse(user, course);

        if(existingRating != null){
            existingRating.setRatingValue(ratingValue);
            existingRating.setDate(LocalDateTime.now());
            return ratingRepository.save(existingRating);
        }

        Rating rating = new Rating();
        rating.setRatingValue(ratingValue);
        rating.setStudent(user);
        rating.setCourse(course);
        rating.setDate(LocalDateTime.now());

        return ratingRepository.save(rating);
    }

    @Override
    public double getAverageRating(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId.toString()));
        List<Rating> ratings = ratingRepository.findByCourseId(course.getId());

        return ratings.stream().mapToInt(Rating::getRatingValue).average().orElse(0.0);
    }

}
