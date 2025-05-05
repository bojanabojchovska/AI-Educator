package com.uiktp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.security.auth.Subject;
import java.time.LocalDateTime;
import java.util.UUID;

@MappedSuperclass
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Attachment {
    private String fileName;

    private String fileType;

    private String fileUrl;

    private LocalDateTime uploadedAt;
}
