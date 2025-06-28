package com.uiktp.repository;

import com.uiktp.model.Semester;
import com.uiktp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@EnableJpaRepositories
@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {
    boolean existsByName(String semester);
    List<Semester> findSemestersByStudent(User student);
}
