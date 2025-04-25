package com.uiktp.service.Implementation;

import com.uiktp.model.Course;
import com.uiktp.model.FlashCard;
import com.uiktp.model.dtos.FlashCardResponseDTO;
import com.uiktp.model.exceptions.custom.FlashCardGenerationException;
import com.uiktp.model.exceptions.custom.PDFLoadingException;
import com.uiktp.model.exceptions.general.InvalidArgumentsException;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.FlashCardRepository;
import com.uiktp.service.Interface.FlashCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.pdmodel.PDDocument;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FlashCardServiceImpl implements FlashCardService {

    private final FlashCardRepository flashCardRepository;
    private final CourseRepository courseRepository;

    public FlashCardServiceImpl(FlashCardRepository flashCardRepository, CourseRepository courseRepository) {
        this.flashCardRepository = flashCardRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public List<FlashCard> getAllFlashCards() {
        return flashCardRepository.findAll();
    }

    @Override
    public Optional<FlashCard> getFlashCardById(Long id) {
        return flashCardRepository.findById(id);
    }

    @Override
    public FlashCard addFlashCard(FlashCard flashCard) {
        return flashCardRepository.save(flashCard);
    }

    @Override
    public FlashCard updateFlashCard(Long id, FlashCard flashCard) {
        Optional<FlashCard> existingFlashCard = flashCardRepository.findById(id);
        if (existingFlashCard.isPresent()) {
            FlashCard flashCardToUpdate = existingFlashCard.get();
            flashCardToUpdate.setQuestion(flashCard.getQuestion());
            flashCardToUpdate.setAnswer(flashCard.getAnswer());
            return flashCardRepository.save(flashCardToUpdate);
        }
        return null;
    }

    @Override
    public void deleteFlashCard(Long id) {
        flashCardRepository.deleteById(id);
    }

    @Override
    public void generateFlashCard(Long courseId, MultipartFile file, int numFlashcards) {
        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new InvalidArgumentsException(String.format("Course with id: %d not found", courseId)));
        if (!file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new InvalidArgumentsException("Only PDF files can be accpeted!");
        }
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            int numPages = document.getNumberOfPages();
            if (numPages < 1 || numPages > 3) {
                throw new InvalidArgumentsException("PDFs must be between 1 and 3 pages!");
            }
        } catch (IOException e) {
            throw new PDFLoadingException();
        }
        if (numFlashcards < 1 || numFlashcards > 5) {
            throw new InvalidArgumentsException("A maximum of 5 flashcards can be generated!");
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            ByteArrayResource PDFasResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            body.add("file", PDFasResource);
            body.add("num_flashcards", numFlashcards);

            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<FlashCardResponseDTO> response = restTemplate.postForEntity("http://localhost:8000/", entity,
                    FlashCardResponseDTO.class);

            List<Map<String, String>> pairs = response.getBody().getQuestion_answer_pairs();
            List<FlashCard> flashCards = new ArrayList<>();

            for (Map<String, String> pair : pairs) {
                String question = "";
                String answer = "";

                for (Map.Entry<String, String> entry : pair.entrySet()) {
                    if (entry.getKey().toLowerCase().contains("question")) {
                        question = entry.getValue();
                    } else if (entry.getKey().toLowerCase().contains("answer")) {
                        answer = entry.getValue();
                    }
                }

                FlashCard flashCard = new FlashCard();
                flashCard.setQuestion(question);
                flashCard.setAnswer(answer);
                flashCard.setCourse(course);
                flashCard.setAttachment(file.getBytes());
                flashCards.add(flashCard);
            }
            flashCardRepository.saveAll(flashCards);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new FlashCardGenerationException(course.getTitle());
        }

    }
}
