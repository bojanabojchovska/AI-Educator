package com.uiktp.service.Implementation;

import com.uiktp.model.Course;
import com.uiktp.model.User;
import com.uiktp.model.UserCourseAttachment;
import com.uiktp.model.dtos.UserCourseAttachmentRequestDTO;
import com.uiktp.model.exceptions.custom.FileUploadFailureException;
import com.uiktp.model.exceptions.custom.PDFLoadingException;
import com.uiktp.model.exceptions.general.InvalidArgumentsException;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.UserCourseAttachmentRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.UserCourseAttachmentService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserCourseUserCourseAttachmentServiceImpl implements UserCourseAttachmentService {

    private final UserCourseAttachmentRepository userCourseAttachmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private static final String UPLOAD_DIR_PATH = "uploads";

    @Override
    public UserCourseAttachment uploadAttachment(UserCourseAttachmentRequestDTO dto){
        MultipartFile multipartFile = dto.getFile();

        if (multipartFile == null || multipartFile.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }

        if (!Objects.requireNonNull(dto.getFile().getOriginalFilename()).toLowerCase().endsWith(".pdf")) {
            throw new InvalidArgumentsException("Only PDF files can be accpeted!");
        }

        PDDocument document = null;
        try {
            document = PDDocument.load(dto.getFile().getInputStream());
        } catch (IOException e) {
            throw new PDFLoadingException();
        }
        int numPages = document.getNumberOfPages();
        if (numPages < 1 || numPages > 3) {
            throw new InvalidArgumentsException("PDFs must be between 1 and 3 pages!");
        }

        File dir = new File(UPLOAD_DIR_PATH);
        if (!dir.mkdirs() && !dir.isDirectory()) {
            throw new FileUploadFailureException();
        }

        String originalFilename = multipartFile.getOriginalFilename();
        String uniqueFilename = UUID.randomUUID() + "_" + originalFilename;
        String filePath = UPLOAD_DIR_PATH + File.separator + uniqueFilename;

        File dest = new File(filePath);
        try {
            multipartFile.transferTo(dest);
        } catch (IOException e) {
            throw new FileUploadFailureException();
        }

        UserCourseAttachment attachment = new UserCourseAttachment();
        attachment.setOriginalFileName(dto.getFile().getOriginalFilename());
        attachment.setSavedFileName(uniqueFilename);
        attachment.setFileUrl(filePath);
        attachment.setFileType("pdf");
        attachment.setChatBotConversation(dto.getChatBotConversation());
        attachment.setUploadedAt(LocalDateTime.now());
        attachment.setChatBotConversation(dto.getChatBotConversation());
        attachment.setUser(userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(User.class, dto.getUserId().toString())));
        attachment.setCourse(courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, dto.getCourseId().toString())));

        return userCourseAttachmentRepository.save(attachment);
    }


    @Override
    public List<UserCourseAttachment> getAttachmentsByUser(Long userId) {
        return userCourseAttachmentRepository.findAllByUserId(userId);
    }

    @Override
    public List<UserCourseAttachment> getAttachmentsByCourse(Long courseId) {
        return userCourseAttachmentRepository.findAllByCourseId(courseId);
    }

    @Override
    public List<UserCourseAttachment> getAttachmentsByCourseAndUser(Long courseId, Long userId){
        return userCourseAttachmentRepository.findAllByCourseIdAndUserId(courseId, userId);
    }

    @Override
    public UserCourseAttachment getById(UUID id) {
        return userCourseAttachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(UserCourseAttachment.class, id.toString()));
    }
}
