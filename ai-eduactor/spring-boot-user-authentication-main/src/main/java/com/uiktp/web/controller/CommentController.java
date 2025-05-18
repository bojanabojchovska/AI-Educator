package com.uiktp.web.controller;

import com.uiktp.model.Comment;
import com.uiktp.model.CommentAttachment;
import com.uiktp.model.User;
import com.uiktp.model.dtos.CommentDTO;
import com.uiktp.service.Interface.CommentAttachmentService;
import com.uiktp.service.Interface.CommentService;
import com.uiktp.service.Interface.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses/{courseId}/comments")
public class CommentController {
    private final CommentService commentService;
    private final CommentAttachmentService commentAttachmentService;
    private  final CourseService courseService;

    public CommentController(CommentService commentService, CommentAttachmentService commentAttachmentService, CourseService courseService) {
        this.commentService = commentService;
        this.commentAttachmentService = commentAttachmentService;
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long courseId, @RequestParam boolean forReviews) {
        return ResponseEntity.ok(commentService.getAllCommentsForCourse(courseId, forReviews));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Comment> addComment(@PathVariable Long courseId,
                                              @RequestParam("commentBody") String commentBody,
                                              @RequestParam(value = "attachments", required = false) MultipartFile[] attachments) {
        CommentDTO dto = new CommentDTO();
        dto.setCommentBody(commentBody);
        dto.setReview(false);
        if (attachments == null || attachments.length == 0) {
            dto.setFiles(Collections.emptyList());
        } else {
            dto.setFiles(Arrays.stream(Objects.requireNonNull(attachments)).toList());
        }

        return ResponseEntity.ok(commentService.addCommentToCourse(courseId, dto));
    }

    @PostMapping("/reviews")
    public ResponseEntity<Comment> addReview(@PathVariable Long courseId, @RequestParam String commentBody) {
        CommentDTO dto = new CommentDTO();
        dto.setCommentBody(commentBody);
        dto.setReview(true);
        dto.setFiles(null);
        return ResponseEntity.ok(commentService.addCommentToCourse(courseId, dto));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> editComment(@PathVariable Long courseId, @PathVariable Long commentId, @RequestBody CommentDTO dto){
        courseService.getCourseById(courseId);
        return ResponseEntity.ok(commentService.editComment(commentId, dto));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long courseId, @PathVariable Long commentId, @RequestParam String email){
        commentService.deleteComment(courseId, commentId, email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{commentId}/attachments")
    public ResponseEntity<List<CommentAttachment>> getCommentAttachments(@PathVariable Long courseId, @PathVariable Long commentId){
        return ResponseEntity.ok(commentAttachmentService.getCommentAttachments(courseId,commentId));
    }
}

