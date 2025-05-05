package com.uiktp.repository;

import com.uiktp.model.Attachment;
import com.uiktp.model.StudentCourseAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StudentCourseAttachmentRepository extends JpaRepository<StudentCourseAttachment, UUID> {
    List<Attachment> findAllByUserId(Long userId);

    List<Attachment> findAllByCourseId(Long courseId);
}
