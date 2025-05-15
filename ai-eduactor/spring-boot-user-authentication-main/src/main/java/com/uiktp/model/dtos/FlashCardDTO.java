package com.uiktp.model.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class FlashCardDTO {
    // Getters and Setters
    private Long id;
    private String question;
    private String answer;
    private Long courseId;
    private String courseTitle;
    private UUID attachmentId;

    // Constructors, getters, and setters
    public FlashCardDTO(Long id, String question, String answer, Long courseId, String courseTitle, UUID attachmentId) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.attachmentId = attachmentId;
    }

}
