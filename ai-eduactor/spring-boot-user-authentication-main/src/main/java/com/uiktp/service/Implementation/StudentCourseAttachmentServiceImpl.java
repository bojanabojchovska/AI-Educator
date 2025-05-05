package com.uiktp.service.Implementation;

import com.uiktp.model.Attachment;
import com.uiktp.model.Course;
import com.uiktp.model.StudentCourseAttachment;
import com.uiktp.model.User;
import com.uiktp.repository.StudentCourseAttachmentRepository;
import com.uiktp.service.Interface.StudentCourseAttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentCourseAttachmentServiceImpl implements StudentCourseAttachmentService {

    private final StudentCourseAttachmentRepository studentCourseAttachmentRepository;

    @Override
    public Attachment createAttachment(String fileName, String fileType,
                                       String chatbotConversation, User user, Course course) {
        StudentCourseAttachment attachment = new StudentCourseAttachment();
        attachment.setId(UUID.randomUUID());
        attachment.setFileName(fileName);
        attachment.setFileType(fileType);
        attachment.setUploadedAt(LocalDateTime.now());
        attachment.setChatbotConversation(chatbotConversation);
        attachment.setUser(user);
        attachment.setCourse(course);

        return studentCourseAttachmentRepository.save(attachment);
    }

    @Override
    public List<Attachment> getAttachmentsByUser(Long userId) {
        return studentCourseAttachmentRepository.findAllByUserId(userId);
    }

    @Override
    public List<Attachment> getAttachmentsByCourse(Long courseId) {
        return studentCourseAttachmentRepository.findAllByCourseId(courseId);
    }

    @Override
    public Attachment getById(UUID id) {
        return studentCourseAttachmentRepository.findById(id).orElse(null);
    }
}
