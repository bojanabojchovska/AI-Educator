package com.uiktp.service.Interface;

import com.uiktp.model.Comment;
import com.uiktp.model.CommentAttachment;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CommentAttachmentService {
    void uploadFiles(List<MultipartFile> files, Comment savedComment);
    List<CommentAttachment> getCommentAttachments(Long courseId, Long commentId);
}
