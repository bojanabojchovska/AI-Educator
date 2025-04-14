package com.uiktp.web.controller;

import com.uiktp.model.Comment;
import com.uiktp.model.dtos.CommentDTO;
import com.uiktp.service.Interface.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody CommentDTO dto) {
        return ResponseEntity.ok(commentService.addComment(dto));
    }

//    @GetMapping("/subject/{subjectId}")
//    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable Long subjectId) {
//    }
}

