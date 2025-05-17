package com.uiktp.repository;

import com.uiktp.model.Attachment;
import com.uiktp.model.Course;
import com.uiktp.model.User;
import com.uiktp.model.UserCourseAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserCourseAttachmentRepository extends JpaRepository<UserCourseAttachment, UUID> {

    List<UserCourseAttachment> findAllByUserId(Long userId);

    List<UserCourseAttachment> findAllByCourseId(Long courseId);
    List<UserCourseAttachment> findAllByUserAndCourse(User user, Course course);
}
