package com.uiktp.repository;

import com.uiktp.model.Course;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@EnableJpaRepositories
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByTitle(String title);

    @Query("""
            select c
            from Course c
            where lower(c.title) in :titles
            """)
    List<Course> findByTitleInIgnoreCase(@Param("titles") List<String> titles);

    @Query("SELECT c FROM Course c JOIN c.likedBy u WHERE u.id = :userId")
    List<Course> findFavoritesByUserId(@Param("userId") Long userId);
}