package com.uiktp.model.dtos;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class FlashCardResponseDTO {
    private List<Map<String, String>> question_answer_pairs;
}
