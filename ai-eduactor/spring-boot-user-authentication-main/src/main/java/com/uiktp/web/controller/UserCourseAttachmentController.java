package com.uiktp.web.controller;

import com.uiktp.model.Attachment;
import com.uiktp.model.Course;
import com.uiktp.model.User;
import com.uiktp.model.UserCourseAttachment;
import com.uiktp.model.dtos.AskQuestionRequestDTO;
import com.uiktp.model.dtos.AskQuestionResponseDTO;
import com.uiktp.model.dtos.UserCourseAttachmentRequestDTO;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.UserCourseAttachmentService;
import com.uiktp.service.Interface.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class UserCourseAttachmentController {

    private final UserCourseAttachmentService userCourseAttachmentService;

    @GetMapping("/all")
    public ResponseEntity<List<UserCourseAttachment>> getAllAttachments(){
        return ResponseEntity.ok(userCourseAttachmentService.getAllAttachments());
    }

    @PostMapping("/upload")
    public ResponseEntity<UserCourseAttachment> uploadAttachments(
            @ModelAttribute UserCourseAttachmentRequestDTO request) {
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

    @GetMapping
    public ResponseEntity<List<UserCourseAttachment>> getByCourseAndUser(@RequestParam Long courseId) {
        return ResponseEntity.ok(userCourseAttachmentService.getAttachmentsByCourseAndUser(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserCourseAttachment> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(userCourseAttachmentService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAttachment(@PathVariable UUID id) throws FileNotFoundException {
        userCourseAttachmentService.deleteAttachment(id);
        return ResponseEntity.ok("File deleted successfully!");
    }

    @PostMapping("/ask")
    public ResponseEntity<AskQuestionResponseDTO> postMethodName(@RequestBody AskQuestionRequestDTO dto) {
        return ResponseEntity.ok(userCourseAttachmentService.askQuestion(dto));
    }
}
