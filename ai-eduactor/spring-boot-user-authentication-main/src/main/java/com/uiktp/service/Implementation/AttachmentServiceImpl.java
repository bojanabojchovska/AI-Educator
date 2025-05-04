package com.uiktp.service.Implementation;

import com.uiktp.model.Attachment;
import com.uiktp.model.Course;
import com.uiktp.model.User;
import com.uiktp.repository.AttachmentRepository;
import com.uiktp.service.Interface.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.security.auth.Subject;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentRepository attachmentRepository;

    @Override
    public Attachment createAttachment(String fileName, String fileType,
                                       String chatbotConversation, User user, Course course) {
        Attachment attachment = new Attachment();
        attachment.setId(UUID.randomUUID());
        attachment.setFileName(fileName);
        attachment.setFileType(fileType);
        attachment.setUploadedAt(LocalDateTime.now());
        attachment.setChatbotConversation(chatbotConversation);
        attachment.setUser(user);
        attachment.setCourse(course);

        return attachmentRepository.save(attachment);
    }

    @Override
    public List<Attachment> getAttachmentsByUser(Long userId) {
        return attachmentRepository.findAllByUserId(userId);
    }

    @Override
    public List<Attachment> getAttachmentsByCourse(Long courseId) {
        return attachmentRepository.findAllByCourseId(courseId);
    }

    @Override
    public Attachment getById(UUID id) {
        return attachmentRepository.findById(id).orElse(null);
    }
}
