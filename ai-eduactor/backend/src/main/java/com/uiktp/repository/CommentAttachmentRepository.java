package com.uiktp.repository;

import com.uiktp.model.Comment;
import com.uiktp.model.CommentAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentAttachmentRepository extends JpaRepository<CommentAttachment, Long> {
    public List<CommentAttachment> findAllByComment(Comment comment);
}
