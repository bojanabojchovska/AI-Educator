package com.uiktp.model.exceptions.custom;

public class FlashCardGenerationException extends RuntimeException {
    public FlashCardGenerationException(String attachment) {
        super(String.format("There was an error while generating flashcards for attachment: %s", attachment));
    }
}
