package com.uiktp.service.Interface;

import com.uiktp.model.Semester;
import com.uiktp.model.dtos.SemesterCreateUpdateDTO;

import java.util.List;
import java.util.Optional;

public interface SemesterService {

    //CRUD
    List<SemesterCreateUpdateDTO> getAllSemesters(String email);
    Optional<Semester> getSemesterById(Long id);
    Semester addSemester(Semester semester);
    Semester updateSemester(Long id, Semester semester);
    Semester addCourseToSemester(Long id, Long courseId);
    void deleteSemester(Long id);

    public Semester createOrUpdateSemester(SemesterCreateUpdateDTO dto, String email);

}
