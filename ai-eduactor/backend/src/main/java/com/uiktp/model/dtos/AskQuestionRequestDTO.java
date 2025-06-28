package com.uiktp.model.dtos;

import lombok.Data;

@Data
public class AskQuestionRequestDTO {
    private String question;
    private String pdf_id;
}
