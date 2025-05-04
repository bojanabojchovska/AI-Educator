package com.uiktp.model.dtos;
import lombok.Data;

@Data
public class AttachmentRequestDTO {
    private String fileName;
    private String fileType;
    private String fileUrl;
    private String chatbotConversation;
    private Long userId;
    private Long courseId;
}
