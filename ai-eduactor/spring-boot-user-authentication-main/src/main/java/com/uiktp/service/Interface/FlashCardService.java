package com.uiktp.service.Interface;

import com.uiktp.model.FlashCard;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

public interface FlashCardService {
    List<FlashCard> getAllFlashCards();

    Optional<FlashCard> getFlashCardById(Long id);

    FlashCard addFlashCard(FlashCard flashCard);

    FlashCard updateFlashCard(Long id, FlashCard flashCard);

    void deleteFlashCard(Long id);

    void generateFlashCard(Long courseId, MultipartFile file, int numFlashcards) throws IOException;
}
