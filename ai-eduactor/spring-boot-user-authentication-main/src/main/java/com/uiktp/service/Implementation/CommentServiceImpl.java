package com.uiktp.service.Implementation;

import com.uiktp.model.Comment;
import com.uiktp.model.Course;
import com.uiktp.model.User;
import com.uiktp.model.dtos.CommentDTO;
import com.uiktp.repository.CommentRepository;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.CommentService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

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

    public Comment addComment(CommentDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Comment comment = new Comment();
        comment.setCommentBody(dto.getCommentBody());
        comment.setStudent(user);
        comment.setCourse(course);
        comment.setDate(LocalDate.now());

        return commentRepository.save(comment);
    }


//    public Comment approveComment(Long id) {
//        Comment comment = commentRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Comment not found"));
//        comment.setApproved(true);
//        return commentRepository.save(comment);
//    }
}
