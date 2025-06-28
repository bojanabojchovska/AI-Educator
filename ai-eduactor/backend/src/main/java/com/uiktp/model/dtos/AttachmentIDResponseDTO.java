package com.uiktp.model.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class AttachmentIDResponseDTO {
    @JsonProperty("Id")
    private String id;
}
