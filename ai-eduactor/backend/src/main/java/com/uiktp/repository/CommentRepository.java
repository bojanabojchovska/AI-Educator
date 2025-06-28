package com.uiktp.repository;

import com.uiktp.model.Comment;
import com.uiktp.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByCourse(Course course);
}

