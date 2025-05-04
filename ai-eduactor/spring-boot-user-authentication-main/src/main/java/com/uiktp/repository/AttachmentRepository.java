package com.uiktp.repository;

import com.uiktp.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {

    List<Attachment> findAllByUserId(Long userId);

    List<Attachment> findAllByCourseId(Long courseId);
}
