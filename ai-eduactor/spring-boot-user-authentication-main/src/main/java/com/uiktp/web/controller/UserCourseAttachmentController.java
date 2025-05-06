package com.uiktp.web.controller;

import com.uiktp.model.Attachment;
import com.uiktp.model.Course;
import com.uiktp.model.User;
import com.uiktp.model.UserCourseAttachment;
import com.uiktp.model.dtos.UserCourseAttachmentRequestDTO;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.UserCourseAttachmentService;
import com.uiktp.service.Interface.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class UserCourseAttachmentController {

    private final UserCourseAttachmentService userCourseAttachmentService;
    private final UserRepository userRepository;
    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<UserCourseAttachment> uploadAttachments(@RequestBody UserCourseAttachmentRequestDTO request) {
        return ResponseEntity.ok(userCourseAttachmentService.uploadAttachment(request));
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserCourseAttachment>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userCourseAttachmentService.getAttachmentsByUser(userId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<UserCourseAttachment>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(userCourseAttachmentService.getAttachmentsByCourse(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserCourseAttachment> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(userCourseAttachmentService.getById(id));
    }
}


