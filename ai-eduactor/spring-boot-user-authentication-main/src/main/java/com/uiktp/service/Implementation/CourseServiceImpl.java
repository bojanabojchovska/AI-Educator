package com.uiktp.service.Implementation;

import com.uiktp.model.Course;
import com.uiktp.model.dtos.CourseRecommendationRequestDTO;
import com.uiktp.model.dtos.CourseRecommendationResponseDTO;
import com.uiktp.model.dtos.CourseTitlesResponseDTO;
import com.uiktp.model.dtos.CreateCourseDto;
import com.uiktp.model.exceptions.CourseRecommendationException;
import com.uiktp.model.exceptions.NoTakenCoursesException;
import com.uiktp.repository.CourseRepository;
import com.uiktp.service.Interface.CourseService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Service;
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

    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
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
    public Course updateCourse(Long id, Course course) {
        Optional<Course> existingCourse = courseRepository.findById(id);
        if (existingCourse.isPresent()) {
            Course courseToUpdate = existingCourse.get();
            courseToUpdate.setTitle(course.getTitle());
            courseToUpdate.setDescription(course.getDescription());
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
    public List<Course> getRecommendations() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            CourseRecommendationRequestDTO request = new CourseRecommendationRequestDTO();
            headers.setContentType(MediaType.APPLICATION_JSON);

            List<String> allCourseNames = courseRepository.findAll().stream().map(c -> c.getTitle())
                    .collect(Collectors.toList());
            Collections.shuffle(allCourseNames);
            List<String> random10Courses = allCourseNames.stream().limit(10).collect(Collectors.toList());
            request.setRemaining_courses(random10Courses);
            request.setTaken_courses(
                    List.of("Business and Managment", "Structural Programming", "Discrete Mathematics",
                            "Object oriented programming", "Introduction to computer science")); // getCoursesByUser

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
            return recommendedCourses;

        } catch (NoTakenCoursesException e) {
            throw e;
        } catch (Exception e) {
            throw new CourseRecommendationException("There was an error while generating the courses!");
        }

    }
}