package com.uiktp.service.Implementation;

import com.uiktp.model.Course;
import com.uiktp.model.dtos.*;
import com.uiktp.model.exceptions.custom.CourseRecommendationException;
import com.uiktp.model.exceptions.custom.NoTakenCoursesException;
import com.uiktp.model.User;
import com.uiktp.model.dtos.CreateCourseDto;
import com.uiktp.model.exceptions.custom.CourseAlreadyLikedByStudentException;
import com.uiktp.model.exceptions.custom.CourseNotLikedByStudentException;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.AuthenticationService;
import com.uiktp.service.Interface.CourseService;
import com.uiktp.service.Interface.RatingService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final RatingService ratingService;
    private final AuthenticationService authenticationService;

    public CourseServiceImpl(CourseRepository courseRepository, UserRepository userRepository, RatingService ratingService, AuthenticationService authenticationService) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.ratingService = ratingService;
        this.authenticationService = authenticationService;
    }

    @Override
    public List<CourseDTO> getAllCourses() {
        List<CourseDTO> courses = courseRepository.findAll().stream().map(course -> {
            CourseDTO dto = new CourseDTO();
            dto.setId(course.getId());
            dto.setTitle(course.getTitle());
            dto.setDescription(course.getDescription());
            dto.setAvgRating(ratingService.getAverageRating(course.getId()));
            return dto;
        }).toList();
        return courses;
    }

    @Override
    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElseThrow();
    }

    @Override
    public Course addCourse(CreateCourseDto dto) {
        Course course = new Course(dto.getTitle(), dto.getDescription());
        return courseRepository.save(course);
    }

    @Override
    public Course updateCourse(Long id, CourseDTO dto) {
        Optional<Course> existingCourse = courseRepository.findById(id);
        if (existingCourse.isPresent()) {
            Course courseToUpdate = existingCourse.get();
            courseToUpdate.setTitle(dto.getTitle());
            courseToUpdate.setDescription(dto.getDescription());
            // no changes in semestars and courses?
            return courseRepository.save(courseToUpdate);
        }
        return null;
    }

    @Override
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    @Override
    public void importCoursesFromCSV(MultipartFile file) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
        String line;
        List<Course> courses = new ArrayList<>();
        reader.readLine();
        while ((line = reader.readLine()) != null) {
            String[] values = line.split(",");

            if (values.length >= 2) {
                String title = values[0].trim();
                String description = values[1].trim();

                Course course = new Course();
                course.setTitle(title);
                course.setDescription(description);

                courses.add(course);
            }
        }

        courseRepository.saveAll(courses);
    }

    @Override
    public void importCoursesFromExcel(MultipartFile file) throws IOException {
        InputStream inputStream = file.getInputStream();

        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);
        Iterator<Row> rowIterator = sheet.iterator();

        List<Course> courses = new ArrayList<>();

        if (rowIterator.hasNext())
            rowIterator.next();
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();

            String title = row.getCell(0).getStringCellValue().trim();
            String description = row.getCell(1).getStringCellValue().trim();

            Course course = new Course();
            course.setTitle(title);
            course.setDescription(description);

            courses.add(course);
        }
        workbook.close();

        courseRepository.saveAll(courses);
    }

    @Override
    public List<CourseDTO> getRecommendations(List<String> takenCourses) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            CourseRecommendationRequestDTO request = new CourseRecommendationRequestDTO();
            headers.setContentType(MediaType.APPLICATION_JSON);

            List<String> allCourseNames = courseRepository.findAll().stream().map(c -> c.getTitle())
                    .collect(Collectors.toList());
            List<String> remainingCourses = allCourseNames.stream()
                    .filter(title -> !takenCourses.contains(title))
                    .collect(Collectors.toList());
            Collections.shuffle(remainingCourses);
            List<String> random10Courses = remainingCourses.stream().limit(10).collect(Collectors.toList());
            request.setRemaining_courses(random10Courses);
            request.setTaken_courses(takenCourses);

            if (request.getTaken_courses() == null || request.getTaken_courses().isEmpty()) {
                throw new NoTakenCoursesException("You have not taken any courses yet!");
            }
            HttpEntity<CourseRecommendationRequestDTO> entity = new HttpEntity<>(request, headers);
            ResponseEntity<CourseTitlesResponseDTO> response = restTemplate.postForEntity(
                    "http://localhost:8000/recommend_courses", entity, CourseTitlesResponseDTO.class);

            List<String> recommendedTitles = response.getBody().getRecommended_courses();
            List<String> lowercaseTitles = recommendedTitles.stream().map(i -> i.toLowerCase())
                    .collect(Collectors.toList());
            List<Course> recommendedCourses = courseRepository.findByTitleInIgnoreCase(lowercaseTitles);
            List<CourseDTO> recommendedCourseDTOs = recommendedCourses.stream()
                    .map(course -> new CourseDTO(course.getId(), course.getTitle(), course.getDescription(), 0))
                    .collect(Collectors.toList());

            return recommendedCourseDTOs;

        } catch (NoTakenCoursesException e) {
            throw e;
        } catch (Exception e) {
            throw new CourseRecommendationException("There was an error while generating the courses!");
        }
    }

    public Course markAsFavorite(Long courseId, String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(User.class, email));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId.toString()));

        if (course.getLikedBy() == null) {
            course.setLikedBy(new ArrayList<>());
        }

        if (course.getLikedBy().contains(student)) {
            throw new CourseAlreadyLikedByStudentException(courseId, student.getId());
        }

        course.getLikedBy().add(student);

        return courseRepository.save(course);
    }

    @Override
    public void removeCourseFromFavorites(Long courseId, String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(User.class, email));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId.toString()));

        if (course.getLikedBy() == null || course.getLikedBy().isEmpty()) {
            throw new CourseNotLikedByStudentException(courseId, student.getId());
        }

        if (course.getLikedBy().contains(student)) {
            course.getLikedBy().remove(student);
        }

        courseRepository.save(course);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getStudentFavorites() {
        User student = authenticationService.getCurrentlyLoggedInUser();
        List<Course> courses = courseRepository.findFavoritesByUserId(student.getId());

        return courses.stream()
                .map(course -> new CourseDTO(
                        course.getId(),
                        course.getTitle(),
                        course.getDescription()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<Course> getCoursesByTitleIn(List<String> titles) {
        List<String> lowerCaseTitles = titles.stream()
                .map(String::toLowerCase)
                .toList();
        return courseRepository.findByTitleInIgnoreCase(lowerCaseTitles);
    }

    @Override
    public List<Course> getCoursesById(List<Long> ids) {
        return courseRepository.findAllById(ids);
    }
}