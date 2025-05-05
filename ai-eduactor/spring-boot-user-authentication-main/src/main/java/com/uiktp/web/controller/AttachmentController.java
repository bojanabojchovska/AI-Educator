package com.uiktp.web.controller;

import com.uiktp.model.Attachment;
import com.uiktp.model.CommentAttachment;
import com.uiktp.model.Course;
import com.uiktp.model.User;
import com.uiktp.model.dtos.AttachmentRequestDTO;
import com.uiktp.repository.CommentAttachmentRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.StudentCourseAttachmentService;
import com.uiktp.service.Interface.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final StudentCourseAttachmentService studentCourseAttachmentService;
    private final UserRepository userRepository;
    private final CourseService courseService;
    private final CommentAttachmentRepository commentAttachmentRepository;

    @PostMapping
    public ResponseEntity<Attachment> createAttachment(@RequestBody AttachmentRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseService.getCourseById(request.getCourseId());

        Attachment attachment = studentCourseAttachmentService.createAttachment(
                request.getFileName(),
                request.getFileType(),
                request.getChatbotConversation(),
                user,
                course
        );

        return ResponseEntity.ok(attachment);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Attachment>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(studentCourseAttachmentService.getAttachmentsByUser(userId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Attachment>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(studentCourseAttachmentService.getAttachmentsByCourse(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attachment> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(studentCourseAttachmentService.getById(id));
    }

    @GetMapping

    public ResponseEntity<List<CommentAttachment>> getAllCommetnAttachments(){
        return ResponseEntity.ok().body(commentAttachmentRepository.findAll());
    }

}


