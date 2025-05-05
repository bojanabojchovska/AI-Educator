package com.uiktp.web.controller;

import com.uiktp.model.Course;
import com.uiktp.model.dtos.CourseDTO;
import com.uiktp.model.dtos.CourseRecommendationResponseDTO;
import com.uiktp.model.dtos.CreateCourseDto;
import com.uiktp.model.exceptions.custom.CourseRecommendationException;
import com.uiktp.model.exceptions.custom.NoTakenCoursesException;
import com.uiktp.service.Interface.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<CourseDTO> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @PostMapping
    public Course createCourse(@RequestBody CreateCourseDto dto) {
        return courseService.addCourse(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        return ResponseEntity.ok(courseService.updateCourse(id, course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/recommend")
    public ResponseEntity<?> recommendCourses(@RequestBody List<String> takenCourses) {
        try {
            List<CourseDTO> courses = courseService.getRecommendations(takenCourses);
            CourseRecommendationResponseDTO response = new CourseRecommendationResponseDTO();
            response.setRecommended_courses(courses);
            return ResponseEntity.ok(response);
        } catch (CourseRecommendationException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        } catch (NoTakenCoursesException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }


    @PutMapping("{id}/favorite/add")
    public ResponseEntity<Course> markAsFavorite(@PathVariable Long id, @RequestParam String email){
        return  ResponseEntity.ok(courseService.markAsFavorite(id, email));
    }

    @PutMapping("{id}/favorite/remove")
    public ResponseEntity<Void> removeFromFavorites(@PathVariable Long id, @RequestParam String email){
        courseService.removeCourseFromFavorites(id, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<Course>> getStudentFavorites(@RequestParam String email){
        return ResponseEntity.ok(courseService.getStudentFavorites(email));
    }
}