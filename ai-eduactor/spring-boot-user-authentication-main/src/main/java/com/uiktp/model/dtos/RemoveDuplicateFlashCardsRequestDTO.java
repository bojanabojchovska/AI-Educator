package com.uiktp.model.dtos;

import lombok.Data;

import java.util.List;

@Data
public class RemoveDuplicateFlashCardsRequestDTO {
    List<FlashCardDTO> flashCardDTOList;
}
