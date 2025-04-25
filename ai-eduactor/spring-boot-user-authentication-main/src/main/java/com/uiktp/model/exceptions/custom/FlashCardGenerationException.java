package com.uiktp.model.exceptions.custom;

public class FlashCardGenerationException extends RuntimeException {
    public FlashCardGenerationException(String course) {
        super(String.format("There was an error while generating flashcards for course: %s", course));
    }
}
