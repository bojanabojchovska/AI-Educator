package com.uiktp.web.controller;

import com.uiktp.model.CommentAttachment;
import com.uiktp.service.Interface.CommentAttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/comments/{commentId}/attachments")
public class CommentAttachmentController {
    private final CommentAttachmentService commentAttachmentService;

    public CommentAttachmentController(CommentAttachmentService commentAttachmentService){

        this.commentAttachmentService = commentAttachmentService;
    }

    @GetMapping
    public ResponseEntity<List<CommentAttachment>> getAttachmentsByComment(@PathVariable Long commentId) {
        return ResponseEntity.ok(commentAttachmentService.getAttachmentsByCommentId(commentId));
    }

    @PostMapping("/upload")
    public ResponseEntity<List<CommentAttachment>> uploadAttachmentsToComment(@PathVariable Long commentId, @RequestParam("files") List<MultipartFile> files){
        return ResponseEntity.ok().body(commentAttachmentService.uploadCommentAttachments(commentId, files));
    }

    @GetMapping("/download/{attachmentId}")
    public ResponseEntity<Resource> downloadCommentAttachment(@PathVariable String commentId, @PathVariable Long attachmentId){
        int i = 0;
        return ResponseEntity.ok().body(commentAttachmentService.downloadAttachment(attachmentId));
    }
}
