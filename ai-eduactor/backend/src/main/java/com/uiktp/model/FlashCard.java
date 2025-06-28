package com.uiktp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "flashcards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlashCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String question;
    private String answer;

    @ManyToOne
    @JoinColumn(name = "attachment_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private UserCourseAttachment attachment;

    public FlashCard(UserCourseAttachment attachment, String question, String answer) {
        this.attachment = attachment;
        this.question = question;
        this.answer = answer;
    }
}
