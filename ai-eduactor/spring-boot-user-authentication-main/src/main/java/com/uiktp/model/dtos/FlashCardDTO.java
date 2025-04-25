package com.uiktp.model.dtos;

public class FlashCardDTO {
    private Long id;
    private String question;
    private String answer;
    private Long courseId;
    private String courseTitle;

    // Constructors, getters, and setters
    public FlashCardDTO(Long id, String question, String answer, Long courseId, String courseTitle) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }
}
