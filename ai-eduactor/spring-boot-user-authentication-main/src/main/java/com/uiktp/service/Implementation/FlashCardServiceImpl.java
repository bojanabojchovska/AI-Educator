package com.uiktp.service.Implementation;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfWriter;
import com.uiktp.model.Course;
import com.uiktp.model.FlashCard;
import com.uiktp.model.User;
import com.uiktp.model.dtos.FlashCardDTO;
import com.uiktp.model.dtos.FlashCardResponseDTO;
import com.uiktp.model.exceptions.custom.FlashCardGenerationException;
import com.uiktp.model.exceptions.custom.PDFLoadingException;
import com.uiktp.model.exceptions.general.InvalidArgumentsException;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.FlashCardRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.FlashCardService;
import jakarta.persistence.PersistenceException;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Hibernate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.pdmodel.PDDocument;

import java.awt.*;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlashCardServiceImpl implements FlashCardService {

    private final FlashCardRepository flashCardRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public FlashCardServiceImpl(FlashCardRepository flashCardRepository, CourseRepository courseRepository, UserRepository userRepository) {
        this.flashCardRepository = flashCardRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<FlashCard> getAllFlashCards() {
        return flashCardRepository.findAll();
    }

    @Override
    public List<FlashCardDTO> getAllFlashCardsByCourseId(Long courseId) {
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null.");
        }
        try {
            List<FlashCard> flashCards = flashCardRepository.findAllByCourse_Id(courseId);

            if (flashCards.isEmpty()) {
                throw new NoSuchElementException("No flashcards found for course ID: " + courseId);
            }
            List<FlashCardDTO> flashCardDTOs = flashCards.stream()
                    .map(flashCard -> new FlashCardDTO(
                            flashCard.getId(),
                            flashCard.getQuestion(),
                            flashCard.getAnswer(),
                            flashCard.getCourse().getId(),
                            flashCard.getCourse().getTitle()))
                    .collect(Collectors.toList());

            return flashCardDTOs;
        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while fetching flashcards for course ID: " + courseId, e);
        } catch (PersistenceException e) {
            throw new RuntimeException("Persistence error while fetching flashcards for course ID: " + courseId, e);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching flashcards for course ID: " + courseId, e);
        }
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
                flashCard.setUser(currentUser);
                flashCards.add(flashCard);
            }
            flashCardRepository.saveAll(flashCards);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new FlashCardGenerationException(course.getTitle());
        }

    }
    @Override
    @Transactional(readOnly = true)
    public void exportFlashCardsToPdf(Long courseId, HttpServletResponse response)
            throws DocumentException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser;

        if (authentication.getPrincipal() instanceof User) {
            currentUser = (User) authentication.getPrincipal();
        } else {
            String currentUserEmail = authentication.getName();
            currentUser = userRepository.findByEmail(currentUserEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new InvalidArgumentsException(String.format("Course with id: %d not found", courseId)));

        Hibernate.initialize(course.getLikedBy());

        List<FlashCard> allUserCourseFlashcards = flashCardRepository.findByCourseIdAndUserId(courseId, currentUser.getId());

        if (allUserCourseFlashcards.isEmpty()) {
            throw new InvalidArgumentsException("No flashcards found for this course");
        }

        Map<String, List<FlashCard>> flashcardBatches = new HashMap<>();
        for (FlashCard card : allUserCourseFlashcards) {
            String attachmentHash = card.getAttachment() != null ?
                    String.valueOf(Arrays.hashCode(card.getAttachment())) :
                    "no-attachment";

            if (!flashcardBatches.containsKey(attachmentHash)) {
                flashcardBatches.put(attachmentHash, new ArrayList<>());
            }
            flashcardBatches.get(attachmentHash).add(card);
        }

        List<FlashCard> mostRecentBatch = allUserCourseFlashcards.stream()
                .sorted(Comparator.comparing(FlashCard::getId).reversed())
                .limit(1)
                .map(card -> {
                    String hash = card.getAttachment() != null ?
                            String.valueOf(Arrays.hashCode(card.getAttachment())) :
                            "no-attachment";
                    return flashcardBatches.get(hash);
                })
                .findFirst()
                .orElse(Collections.emptyList());

        if (mostRecentBatch.isEmpty()) {
            throw new InvalidArgumentsException("No flashcards found for this course");
        }

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        titleFont.setSize(18);
        titleFont.setColor(Color.BLUE);

        Paragraph title = new Paragraph("Flashcards for " + course.getTitle(), titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        Font dateFont = FontFactory.getFont(FontFactory.HELVETICA);
        dateFont.setSize(12);

        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        Paragraph date = new Paragraph("Generated on: " + formatter.format(new Date()), dateFont);
        date.setAlignment(Paragraph.ALIGN_RIGHT);
        document.add(date);

        document.add(new Paragraph("\n"));

        for (int i = 0; i < mostRecentBatch.size(); i++) {
            FlashCard flashCard = mostRecentBatch.get(i);

            Font cardFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            cardFont.setSize(14);

            Paragraph cardNumber = new Paragraph("Flashcard #" + (i + 1), cardFont);
            document.add(cardNumber);

            Font questionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            questionFont.setSize(12);

            Paragraph question = new Paragraph("Question: ", questionFont);
            question.add(new Chunk(flashCard.getQuestion(), FontFactory.getFont(FontFactory.HELVETICA)));
            document.add(question);

            Font answerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            answerFont.setSize(12);

            Paragraph answer = new Paragraph("Answer: ", answerFont);
            answer.add(new Chunk(flashCard.getAnswer(), FontFactory.getFont(FontFactory.HELVETICA)));
            document.add(answer);

            document.add(new Paragraph("\n"));
        }

        document.close();
    }
}
