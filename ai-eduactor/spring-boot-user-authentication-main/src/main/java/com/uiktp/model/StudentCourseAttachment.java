package com.uiktp.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "student_course_attachment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentCourseAttachment extends Attachment{
    @Id
    private UUID id;
    @Lob
    private String chatbotConversation;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
}
