package com.uiktp.service.Implementation;

import com.uiktp.model.Comment;
import com.uiktp.model.Course;
import com.uiktp.model.User;
import com.uiktp.model.dtos.CommentDTO;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import com.uiktp.repository.CommentRepository;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.CommentService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public CommentServiceImpl(CommentRepository commentRepository, UserRepository userRepository,
                          CourseRepository courseRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public List<Comment> getAllCommentsForCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId));

        return commentRepository.findByCourseId(courseId);
    }

    public Comment addCommentToCourse(Long courseId, CommentDTO dto) {
        User user = userRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException(User.class, dto.getStudentId()));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId));

        Comment comment = new Comment();
        comment.setCommentBody(dto.getCommentBody());
        comment.setStudent(user);
        comment.setCourse(course);
        comment.setDate(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    @Override
    public Comment editComment(Long commentId, CommentDTO dto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException(Comment.class, commentId));
        comment.setCommentBody(dto.getCommentBody());
        comment.setDate(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException(Comment.class, commentId));
        commentRepository.delete(comment);
    }
}
