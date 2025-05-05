package com.uiktp.service.Interface;
import com.uiktp.model.Attachment;
import com.uiktp.model.Course;
import com.uiktp.model.User;

import java.util.List;
import java.util.UUID;

public interface StudentCourseAttachmentService {
    Attachment createAttachment(String fileName, String fileType,
                                String chatbotConversation, User user, Course course);

    List<Attachment> getAttachmentsByUser(Long userId);
    List<Attachment> getAttachmentsByCourse(Long courseId);
    Attachment getById(UUID id);

}
