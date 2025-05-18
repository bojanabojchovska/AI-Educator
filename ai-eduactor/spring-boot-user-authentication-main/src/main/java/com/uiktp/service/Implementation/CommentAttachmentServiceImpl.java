package com.uiktp.service.Implementation;

import com.uiktp.model.Comment;
import com.uiktp.model.CommentAttachment;
import com.uiktp.model.Course;
import com.uiktp.model.exceptions.custom.FileDownloadException;
import com.uiktp.model.exceptions.custom.FileUploadException;
import com.uiktp.model.exceptions.custom.FileUploadFailureException;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import com.uiktp.repository.CommentAttachmentRepository;
import com.uiktp.repository.CommentRepository;
import com.uiktp.repository.CourseRepository;
import com.uiktp.service.Interface.CommentAttachmentService;
import com.uiktp.service.Interface.CommentService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class CommentAttachmentServiceImpl implements CommentAttachmentService {
    private final CommentAttachmentRepository commentAttachmentRepository;
    private final CommentRepository commentRepository;
    private final CourseRepository courseRepository;
    private static final String UPLOAD_DIR_PATH = "uploads/comments/";
    private static final String UPLOAD_URL = "http://localhost:8080/comments/files/";

    public CommentAttachmentServiceImpl(CommentAttachmentRepository commentAttachmentRepository, CommentRepository commentRepository, CourseRepository courseRepository) {
        this.commentAttachmentRepository = commentAttachmentRepository;
        this.commentRepository = commentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public void uploadFiles(List<MultipartFile> files, Comment savedComment) {
        File dir = new File(UPLOAD_DIR_PATH);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new FileUploadFailureException();
        }

        List<CommentAttachment> attachments = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("One or more files are empty.");
            }

            String originalFilename = Objects.requireNonNull(file.getOriginalFilename());
            String uniqueFilename = UUID.randomUUID() + "_" + originalFilename;
            Path filePath = Paths.get(UPLOAD_DIR_PATH, uniqueFilename).toAbsolutePath();

            try {
                file.transferTo(filePath);
            } catch (IOException e) {
                throw new FileUploadFailureException();
            }

            CommentAttachment attachment = new CommentAttachment();
            attachment.setOriginalFileName(originalFilename);
            attachment.setSavedFileName(uniqueFilename);
            attachment.setFilePath(filePath.toString());
            attachment.setFileUrl(UPLOAD_URL + uniqueFilename);
            attachment.setFileType(file.getContentType());
            attachment.setUploadedAt(LocalDateTime.now());
            attachment.setComment(savedComment);

            attachments.add(attachment);
        }

        commentAttachmentRepository.saveAll(attachments);
    }

    @Override
    public List<CommentAttachment> getCommentAttachments(Long courseId, Long commentId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId.toString()));
        Comment comment = commentRepository.findAllByCourse(course)
                .stream()
                .filter(com -> Objects.equals(com.getId(), commentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(Comment.class, commentId.toString()));
        return commentAttachmentRepository.findAllByComment(comment);
    }

}
