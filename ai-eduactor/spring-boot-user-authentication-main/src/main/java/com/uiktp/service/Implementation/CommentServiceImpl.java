package com.uiktp.service.Implementation;

import com.uiktp.model.Comment;
import com.uiktp.model.CommentAttachment;
import com.uiktp.model.Course;
import com.uiktp.model.User;
import com.uiktp.model.dtos.CommentDTO;
import com.uiktp.model.exceptions.custom.FileUploadFailureException;
import com.uiktp.model.exceptions.custom.PDFLoadingException;
import com.uiktp.model.exceptions.custom.UserCannotDeleteCommentException;
import com.uiktp.model.exceptions.general.InvalidArgumentsException;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import com.uiktp.repository.CommentAttachmentRepository;
import com.uiktp.repository.CommentRepository;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.AuthenticationService;
import com.uiktp.service.Interface.CommentAttachmentService;
import com.uiktp.service.Interface.CommentService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final CourseRepository courseRepository;
    private final CommentAttachmentService commentAttachmentService;
    private final AuthenticationService authenticationService;

    private static final String UPLOAD_DIR_PATH = "uploads/comments/";
    private static final String UPLOAD_URL = "http://localhost:8080/comments/files/";


    public CommentServiceImpl(CommentRepository commentRepository,
                              CourseRepository courseRepository, CommentAttachmentService commentAttachmentService, AuthenticationService authenticationService) {
        this.commentRepository = commentRepository;
        this.courseRepository = courseRepository;
        this.commentAttachmentService = commentAttachmentService;
        this.authenticationService = authenticationService;
    }

    @Override
    public List<Comment> getAllCommentsForCourse(Long courseId, boolean forReviews) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId.toString()));

        return commentRepository.findAllByCourse(course)
                .stream()
                .filter(com -> com.isReview() == forReviews)
                .sorted(Comparator.comparing(Comment::getDate).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public Comment getComment(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException(Comment.class, commentId.toString()));
    }

    public Comment addCommentToCourse(Long courseId, CommentDTO dto) {
        User user = authenticationService.getCurrentlyLoggedInUser();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId.toString()));

        Comment comment = new Comment();
        comment.setCommentBody(dto.getCommentBody());
        comment.setStudent(user);
        comment.setCourse(course);
        comment.setDate(LocalDateTime.now());
        comment.setReview(dto.isReview());

        Comment savedComment = commentRepository.save(comment);
        List<MultipartFile> files = dto.getFiles();

        if (files != null && !files.isEmpty() && !dto.isReview()) {
            commentAttachmentService.uploadFiles(files, savedComment);
        }

        return savedComment;
    }

    @Override
    public Comment editComment(Long commentId, CommentDTO dto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException(Comment.class, commentId.toString()));
        comment.setCommentBody(dto.getCommentBody());
        comment.setDate(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(Long courseId, Long commentId, String email) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId.toString()));

        Comment comment = commentRepository.findAllByCourse(course)
                .stream().filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(Comment.class, commentId.toString()));

        if(!comment.getStudent().getEmail().equals(email)){
            throw new UserCannotDeleteCommentException(email, commentId);
        }

        commentRepository.delete(comment);
    }
}
