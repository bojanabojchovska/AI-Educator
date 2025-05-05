package com.uiktp.service.Implementation;

import com.uiktp.model.Comment;
import com.uiktp.model.CommentAttachment;
import com.uiktp.model.exceptions.custom.FileDownloadException;
import com.uiktp.model.exceptions.custom.FileUploadException;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import com.uiktp.repository.CommentAttachmentRepository;
import com.uiktp.service.Interface.CommentAttachmentService;
import com.uiktp.service.Interface.CommentService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CommentAttachmentServiceImpl implements CommentAttachmentService {
    private final CommentAttachmentRepository commentAttachmentRepository;
    private final CommentService commentService;
    private static final String UPLOAD_DIR = "spring-boot-user-authentication-main/src/main/resources/uploads";

    public CommentAttachmentServiceImpl(CommentAttachmentRepository commentAttachmentRepository, CommentService commentService) {
        this.commentAttachmentRepository = commentAttachmentRepository;
        this.commentService = commentService;
    }

    private String uploadFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath();

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path targetPath = uploadPath.resolve(filename);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return targetPath.toString();
    }

    @Override
    public List<CommentAttachment> getAttachmentsByCommentId(Long commentId) {
        Comment comment = commentService.getComment(commentId);
        return commentAttachmentRepository.findAllByComment(comment);
    }

    @Override
    public List<CommentAttachment> uploadCommentAttachments(Long commentId, List<MultipartFile> files){
        Comment comment = commentService.getComment(commentId);

        List<CommentAttachment> attachments = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                try {
                    if (file.getContentType() == null || !file.getContentType().equalsIgnoreCase("application/pdf")) {
                        throw new FileUploadException("Only PDF files are allowed.");
                    }

                    String filePath = uploadFile(file);

                    CommentAttachment attachment = new CommentAttachment(file.getOriginalFilename(), file.getContentType(), filePath, LocalDateTime.now(), comment);
                    attachments.add(attachment);
                } catch (IOException e) {
                    throw new FileUploadException(e.getMessage());
                }
            }
        }

        return commentAttachmentRepository.saveAll(attachments);
    }


    private String getFileName(Long attachmentId) {
        return commentAttachmentRepository.findById(attachmentId)
                .map(CommentAttachment::getFileName)
                .orElse("downloaded-file");
    }

    @Override
    public Resource downloadAttachment(Long attachmentId){
        CommentAttachment attachment = commentAttachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(CommentAttachment.class, attachmentId.toString()));

        Path filePath = Paths.get(attachment.getFileUrl()).normalize();

        if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
            throw new FileDownloadException(filePath.toString());
        }

        try {
            return new UrlResource(filePath.toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }
}
