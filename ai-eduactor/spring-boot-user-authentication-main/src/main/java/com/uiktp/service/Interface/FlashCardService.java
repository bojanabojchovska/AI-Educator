package com.uiktp.service.Interface;

import com.lowagie.text.DocumentException;
import com.uiktp.model.FlashCard;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.uiktp.model.dtos.FlashCardDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.transaction.annotation.Transactional;

public interface FlashCardService {
    List<FlashCard> getAllFlashCards();
    List<FlashCardDTO> getAllFlashCardsByCourseId(Long courseId);

    Optional<FlashCard> getFlashCardById(Long id);

    FlashCard addFlashCard(FlashCard flashCard);

    FlashCard updateFlashCard(Long id, FlashCard flashCard);

    void deleteFlashCard(Long id);

    List<FlashCard> generateFlashCard(UUID attachmentId, int numFlashcards) throws FileNotFoundException;

    @Transactional
    public String exportFlashCardsToPdf(Long courseId) throws DocumentException, IOException;
}
