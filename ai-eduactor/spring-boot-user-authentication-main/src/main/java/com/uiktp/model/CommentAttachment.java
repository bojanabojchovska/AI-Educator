package com.uiktp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment_attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentAttachment extends Attachment{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "comment_id")
    private Comment comment;

    public CommentAttachment(String fileName, String fileType, String fileUrl, LocalDateTime uploadedAt, Comment comment){
        super(fileName, fileType, fileUrl, uploadedAt);
        this.comment = comment;
    }

}
