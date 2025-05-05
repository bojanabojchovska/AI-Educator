package com.uiktp.model.dtos;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Getter
@Setter
public class CommentDTO {
    private String commentBody;
    private String studentEmail;
    public CommentDTO() {}

}
