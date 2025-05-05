package com.uiktp.service.Interface;

import com.uiktp.model.CommentAttachment;
import com.uiktp.model.exceptions.custom.FileDownloadException;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CommentAttachmentService {
    List<CommentAttachment> getAttachmentsByCommentId(Long commentId);
    List<CommentAttachment> uploadCommentAttachments(Long commentId, List<MultipartFile> files);
    Resource downloadAttachment(Long attachmentId);
}
