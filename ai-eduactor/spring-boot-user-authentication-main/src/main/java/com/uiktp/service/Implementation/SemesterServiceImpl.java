package com.uiktp.service.Implementation;

import com.uiktp.model.Course;
import com.uiktp.model.Semester;
import com.uiktp.model.User;
import com.uiktp.model.dtos.SemesterCreateUpdateDTO;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import com.uiktp.repository.SemesterRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.SemesterService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class SemesterServiceImpl implements SemesterService {

    private final SemesterRepository semesterRepository;
    private final CourseServiceImpl courseService;

    private final UserRepository userRepository;

    public SemesterServiceImpl(SemesterRepository semesterRepository, CourseServiceImpl courseService, UserRepository userRepository) {
        this.semesterRepository = semesterRepository;
        this.courseService = courseService;
        this.userRepository = userRepository;
    }

    @Override
    public List<SemesterCreateUpdateDTO> getAllSemesters(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(User.class, email));
        return semesterRepository.findSemestersByStudent(student).stream().map(semester -> {
            SemesterCreateUpdateDTO dto = new SemesterCreateUpdateDTO();
            dto.setId(semester.getId());
            dto.setName(semester.getName());
            dto.setCourses(semester.getCourses().stream().map(Course::getTitle).toList());
            return dto;
        }).toList();
    }

    @Override
    public Optional<Semester> getSemesterById(Long id) {
        return semesterRepository.findById(id);
    }

    @Override
    public Semester addSemester(Semester semester) {
        return semesterRepository.save(semester);
    }

    @Override
    public Semester updateSemester(Long id, Semester semester) {
        Optional<Semester> existingSemester = semesterRepository.findById(id);
        if (existingSemester.isPresent()) {
            Semester semesterToUpdate = existingSemester.get();
            semesterToUpdate.setName(semester.getName());
            return semesterRepository.save(semesterToUpdate);
        }
        return null;
    }

    @Override
    public Semester addCourseToSemester(Long id, Long courseId) {

        Semester semester = semesterRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(Semester.class, id.toString()));
        List<Course> courses = semester.getCourses();
        if (courses.size() >= 5) {
            throw new IllegalStateException("A semester can have a maximum of 5 courses.");
        }
        Course course = courseService.getCourseById(courseId);
        courses.add(course);
        semester.setCourses(courses);
        return semesterRepository.save(semester);
    }

    @Override
    public void deleteSemester(Long id) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Semester not found with id: " + id));
        semesterRepository.delete(semester);
    }

    @Override
    public Semester createOrUpdateSemester(SemesterCreateUpdateDTO dto, String email) {
        if (email == null || email.equals("null")) {
            throw new IllegalArgumentException("Email cannot be null.");
        }
        Semester semester;

        if (dto.getId() != null) {
            semester = semesterRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Semester not found with ID: " + dto.getId()));
        } else {
            semester = new Semester();
        }

        semester.setName(dto.getName());
        List<Course> courses = courseService.getCoursesByTitleIn(dto.getCourses());
        semester.setCourses(courses);
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(User.class, email));
        semester.setStudent(student);
        return semesterRepository.save(semester);
    }
}
