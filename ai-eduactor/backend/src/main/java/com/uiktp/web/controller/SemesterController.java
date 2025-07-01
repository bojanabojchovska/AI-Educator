package com.uiktp.web.controller;

import com.uiktp.model.Semester;
import com.uiktp.model.User;
import com.uiktp.model.dtos.SemesterCreateUpdateDTO;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.SemesterService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/semesters")
@CrossOrigin(origins = "http://aieducator.local", allowCredentials = "true")
public class SemesterController {

    private final SemesterService semesterService;

    private final UserRepository userRepository;

    public SemesterController(SemesterService semesterService, UserRepository userRepository) {
        this.semesterService = semesterService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<SemesterCreateUpdateDTO> getAllSemesters(@RequestParam String email) {
        return semesterService.getAllSemesters(email);
    }

    @GetMapping("/{id}")
    public Optional<Semester> getSemesterById(@PathVariable Long id) {
        return semesterService.getSemesterById(id);
    }

    @PostMapping("/createOrUpdate")
    public ResponseEntity<String> createSemester(@RequestBody SemesterCreateUpdateDTO dto, @RequestParam String email) {
        semesterService.createOrUpdateSemester(dto,email);
        return ResponseEntity.ok("Semester created successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Semester> updateSemester(@PathVariable Long id, @RequestBody Semester semester) {
        return ResponseEntity.ok(semesterService.updateSemester(id, semester));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSemester(@PathVariable Long id) {
        try {
            semesterService.deleteSemester(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public Semester enrollStudentInSemester(Long studentId, Long semesterId) {
        User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        Semester semester = semesterService.getSemesterById(semesterId).orElseThrow(() -> new RuntimeException("Semester not found"));
        semester.setStudent(student);
        return semesterService.addSemester(semester);
    }

    @PostMapping("/addCourse/{semesterId}")
    public Semester addCourseToSemester(@PathVariable Long semesterId, @RequestParam Long courseId){
        return semesterService.addCourseToSemester(semesterId,courseId);
    }

}