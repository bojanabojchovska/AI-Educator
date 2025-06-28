package com.uiktp.service.Interface;

import com.uiktp.model.Attachment;
import com.uiktp.model.Course;
import com.uiktp.model.User;
import com.uiktp.model.UserCourseAttachment;
import com.uiktp.model.dtos.AskQuestionRequestDTO;
import com.uiktp.model.dtos.AskQuestionResponseDTO;
import com.uiktp.model.dtos.UserCourseAttachmentRequestDTO;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface UserCourseAttachmentService {
    UserCourseAttachment uploadAttachment(UserCourseAttachmentRequestDTO dto);
    List<UserCourseAttachment> getAllAttachments();

    List<UserCourseAttachment> getAttachmentsByUser(Long userId);

    List<UserCourseAttachment> getAttachmentsByCourse(Long courseId);

    UserCourseAttachment getById(UUID id);

    public List<UserCourseAttachment> getAttachmentsByCourseAndUser(Long courseId);

    AskQuestionResponseDTO askQuestion(AskQuestionRequestDTO askQuestionRequestDTO);

    void deleteAttachment(UUID id) throws FileNotFoundException;

}
