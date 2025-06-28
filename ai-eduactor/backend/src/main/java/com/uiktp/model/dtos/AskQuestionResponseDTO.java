package com.uiktp.model.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class AskQuestionResponseDTO {
    @JsonProperty("Question")
    private String question;
    @JsonProperty("Answer")
    private String answer;
}
