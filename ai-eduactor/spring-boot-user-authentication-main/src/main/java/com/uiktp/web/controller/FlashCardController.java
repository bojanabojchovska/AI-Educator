package com.uiktp.web.controller;

import com.lowagie.text.DocumentException;
import com.uiktp.model.FlashCard;
import com.uiktp.service.Interface.FlashCardService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "http://localhost:3000")
public class FlashCardController {

    private final FlashCardService flashCardService;

    public FlashCardController(FlashCardService flashCardService) {
        this.flashCardService = flashCardService;
    }

    @GetMapping
    public List<FlashCard> getAllFlashCards() {
        return flashCardService.getAllFlashCards();
    }

    @GetMapping("/{id}")
    public Optional<FlashCard> getFlashCardById(@PathVariable Long id) {
        return flashCardService.getFlashCardById(id);
    }

    @PostMapping
    public FlashCard createFlashCard(@RequestBody FlashCard flashCard) {
        return flashCardService.addFlashCard(flashCard);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlashCard> updateFlashCard(@PathVariable Long id, @RequestBody FlashCard flashCard) {
        return ResponseEntity.ok(flashCardService.updateFlashCard(id, flashCard));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlashCard(@PathVariable Long id) {
        flashCardService.deleteFlashCard(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateFlashCard(
            @RequestParam("course_id") Long courseId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("num_flashcards") int numFlashcards) {
        flashCardService.generateFlashCard(courseId, file, numFlashcards);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/{courseId}")
    public void exportFlashCardsToPdf(
            @PathVariable("courseId") Long courseId,
            HttpServletResponse response) throws IOException, DocumentException {
        response.setContentType("application/pdf");
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormat.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=flashcards_" + currentDateTime + ".pdf";
        response.setHeader(headerKey, headerValue);

        flashCardService.exportFlashCardsToPdf(courseId, response);
    }


}
