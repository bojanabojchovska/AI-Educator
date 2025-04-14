package com.uiktp.service.Interface;

import com.uiktp.model.Comment;
import com.uiktp.model.dtos.CommentDTO;
import org.springframework.stereotype.Service;

@Service
public interface CommentService {
    Comment addComment(CommentDTO dto);
}
