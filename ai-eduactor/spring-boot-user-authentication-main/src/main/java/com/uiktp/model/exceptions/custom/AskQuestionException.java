package com.uiktp.model.exceptions.custom;

public class AskQuestionException extends RuntimeException {
    public AskQuestionException() {
        super(String.format("There was an error generating a response!"));
    }
}
