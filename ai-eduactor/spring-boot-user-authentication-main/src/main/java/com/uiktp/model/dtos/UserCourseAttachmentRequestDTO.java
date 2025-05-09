package com.uiktp.model.dtos;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserCourseAttachmentRequestDTO {
    private MultipartFile file;
    private Long userId;
    private Long courseId;
}
