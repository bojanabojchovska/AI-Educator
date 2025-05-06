package com.uiktp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "user_course_attachments")
public class UserCourseAttachment extends Attachment{
    @Id
    private UUID id;
    @Lob
    private String chatBotConversation;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    public UserCourseAttachment(String fileName, String savedFileName, String fileType, String filePath, LocalDateTime uploadedAt, String chatBotConversation, User user, Course course){
        super(fileName, savedFileName, fileType, filePath, uploadedAt);
        this.chatBotConversation = chatBotConversation;
        this.user = user;
        this.course = course;
    }
}
