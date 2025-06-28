package com.uiktp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@MappedSuperclass
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Attachment {

    private String originalFileName;

    private String savedFileName;

    private String fileType;
    private String filePath;

    private String fileUrl;

    private LocalDateTime uploadedAt;
}
