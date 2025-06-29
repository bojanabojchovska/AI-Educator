package com.uiktp.service.Implementation;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfWriter;
import com.uiktp.model.Course;
import com.uiktp.model.FlashCard;
import com.uiktp.model.UserCourseAttachment;
import com.uiktp.model.dtos.FlashCardDTO;
import com.uiktp.model.dtos.FlashCardResponseDTO;
import com.uiktp.model.dtos.RemoveDuplicateFlashCardsRequestDTO;
import com.uiktp.model.exceptions.custom.FlashCardGenerationException;
import com.uiktp.model.exceptions.general.InvalidArgumentsException;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.FlashCardRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.FlashCardService;
import com.uiktp.service.Interface.UserCourseAttachmentService;
import jakarta.persistence.PersistenceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.dao.DataAccessException;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.awt.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlashCardServiceImpl implements FlashCardService {

    private final FlashCardRepository flashCardRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final UserCourseAttachmentService userCourseAttachmentService;
    private static final String UPLOAD_DIR_PATH = "uploads";

    @Value("${ai.service.url}")
    private String aiServiceUrl;


    public FlashCardServiceImpl(FlashCardRepository flashCardRepository, CourseRepository courseRepository, UserRepository userRepository, UserCourseAttachmentService userCourseAttachmentService) {
        this.flashCardRepository = flashCardRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.userCourseAttachmentService = userCourseAttachmentService;
    }

    @Override
    public List<FlashCard> getAllFlashCards() {
        return flashCardRepository.findAll();
    }

    @Override
    public List<FlashCardDTO> getAllFlashCardsByCourseId(Long courseId) {
        List<FlashCardDTO> flashCards = getFlashCardsByCourse(courseId, false);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestMap = new HashMap<>();
        requestMap.put("flashCards", flashCards);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestMap, headers);

        ResponseEntity<RemoveDuplicateFlashCardsRequestDTO> response = restTemplate.postForEntity(
                aiServiceUrl + "/remove-duplicates", requestEntity, RemoveDuplicateFlashCardsRequestDTO.class
        );

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            List<FlashCardDTO> cleanedFlashcards = response.getBody().getFlashCardDTOList();
            if (cleanedFlashcards != null) {
                return cleanedFlashcards;
            }
        }

        return flashCards;
    }

    @Override
    public List<FlashCardDTO> getAllFlashCardsByCourseAndUser(Long courseId) {
        return getFlashCardsByCourse(courseId, true);
    }

    private List<FlashCardDTO> getFlashCardsByCourse(Long courseId, boolean isForUser) {
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null.");
        }
        try {
            List<FlashCard> flashCards = new ArrayList<>();

            if (isForUser) {
                flashCards = userCourseAttachmentService.getAttachmentsByCourseAndUser(courseId)
                        .stream()
                        .flatMap(attachment -> flashCardRepository.findAllByAttachment(attachment).stream())
                        .toList();
            } else {
                flashCards = userCourseAttachmentService.getAttachmentsByCourse(courseId)
                        .stream()
                        .flatMap(attachment -> flashCardRepository.findAllByAttachment(attachment).stream())
                        .toList();
            }

            return flashCards.stream()
                    .map(flashCard -> new FlashCardDTO(
                            flashCard.getId(),
                            flashCard.getQuestion(),
                            flashCard.getAnswer(),
                            flashCard.getAttachment().getCourse().getId(),
                            flashCard.getAttachment().getCourse().getTitle(),
                            flashCard.getAttachment().getId()))
                    .collect(Collectors.toList());
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
    public List<FlashCard> generateFlashCard(UUID attachmentId, int numFlashcards) throws FileNotFoundException {
        UserCourseAttachment attachment = userCourseAttachmentService.getById(attachmentId);

        File file = new File(attachment.getFilePath());
        if (!file.exists()) {
            throw new FileNotFoundException("File not found at path: " + attachment.getFileUrl());
        }

        byte[] fileBytes;
        try {
            Path path = file.toPath();
            fileBytes = Files.readAllBytes(path);
        } catch (IOException e) {
            throw new RuntimeException("Error reading file bytes", e);
        }

        if (numFlashcards < 1 || numFlashcards > 5) {
            throw new InvalidArgumentsException("A maximum of 5 flashcards can be generated!");
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            ByteArrayResource PDFasResource = new ByteArrayResource(fileBytes) {
                @Override
                public String getFilename() {
                    return file.getName();
                }
            };

            body.add("file", PDFasResource);
            body.add("num_flashcards", numFlashcards);

            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<FlashCardResponseDTO> response = restTemplate.postForEntity(aiServiceUrl, entity,
                    FlashCardResponseDTO.class);

            List<Map<String, String>> pairs = Objects.requireNonNull(response.getBody()).getQuestion_answer_pairs();
            List<FlashCard> flashCards = new ArrayList<>();

            for (Map<String, String> pair : pairs) {
                FlashCard flashCard = getFlashCard(pair, attachment);
                flashCards.add(flashCard);
            }
            return flashCardRepository.saveAll(flashCards);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new FlashCardGenerationException(attachment.getOriginalFileName());
        }
    }

    private FlashCard getFlashCard(Map<String, String> pair, UserCourseAttachment attachment) {
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
        flashCard.setAttachment(attachment);
        return flashCard;
    }

    @Override
    @Transactional
    public String exportFlashCardsToPdf(Long courseId) throws DocumentException, IOException {
        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new InvalidArgumentsException(String.format("Course with id: %d not found", courseId)));

        Path folderPath = Files.createDirectories(Paths.get(UPLOAD_DIR_PATH));

        String uniqueFilename = UUID.randomUUID() + "_" + course.getTitle() + ".pdf";
        String filePath = folderPath + File.separator + uniqueFilename;

        Document document = new Document(PageSize.A4);
        PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(filePath));

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

        List<FlashCard> allUserCourseFlashcards = userCourseAttachmentService.getAttachmentsByCourseAndUser(courseId)
                .stream()
                .flatMap(attachment -> flashCardRepository.findAllByAttachment(attachment).stream())
                .toList();

        if (allUserCourseFlashcards.isEmpty()) {
            throw new InvalidArgumentsException("No flashcards found for this course");
        }

        for (int i = 0; i < allUserCourseFlashcards.size(); i++) {
            FlashCard flashCard = allUserCourseFlashcards.get(i);

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
        writer.flush();

        return "http://localhost:8080/files/" + uniqueFilename;
    }

    @Override
    @Transactional
    public String exportAttachmentFlashCardsToPdf(UUID attachmentId) throws DocumentException, IOException {
        UserCourseAttachment attachment = userCourseAttachmentService.getById(attachmentId);
        Course course = attachment.getCourse();

        Path folderPath = Files.createDirectories(Paths.get(UPLOAD_DIR_PATH));

        String uniqueFilename = UUID.randomUUID() + "_" + course.getTitle() + ".pdf";
        String filePath = folderPath + File.separator + uniqueFilename;

        Document document = new Document(PageSize.A4);
        PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(filePath));

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        titleFont.setSize(18);
        titleFont.setColor(Color.BLUE);

        Paragraph title = new Paragraph("Flashcards for " + attachment.getOriginalFileName(), titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        Font dateFont = FontFactory.getFont(FontFactory.HELVETICA);
        dateFont.setSize(12);
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        Paragraph date = new Paragraph("Generated on: " + formatter.format(new Date()), dateFont);
        date.setAlignment(Paragraph.ALIGN_RIGHT);
        document.add(date);

        document.add(new Paragraph("\n"));

        List<FlashCard> flashCards = flashCardRepository.findAllByAttachment(attachment);

        if (flashCards.isEmpty()) {
            throw new InvalidArgumentsException("No flashcards found for this PDF");
        }

        for (int i = 0; i < flashCards.size(); i++) {
            FlashCard flashCard = flashCards.get(i);

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
        writer.flush();

        return "http://localhost:8080/files/" + uniqueFilename;
    }

    @Override
    public List<FlashCardDTO> getAllFlashCardsByAttachment(UUID attachmentId) {
        UserCourseAttachment attachment = userCourseAttachmentService.getById(attachmentId);
        return flashCardRepository.findAllByAttachment(attachment).stream()
                .map(fc -> new FlashCardDTO(fc.getId(), fc.getQuestion(), fc.getAnswer()))
                .collect(Collectors.toList());
    }


}
