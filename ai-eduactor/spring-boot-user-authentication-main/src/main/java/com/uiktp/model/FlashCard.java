package com.uiktp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "attachment", columnDefinition = "BYTEA")
    private byte[] attachment;

    public FlashCard(String question, String answer, Course course) {
        this.question = question;
        this.answer = answer;
        this.course = course;
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
