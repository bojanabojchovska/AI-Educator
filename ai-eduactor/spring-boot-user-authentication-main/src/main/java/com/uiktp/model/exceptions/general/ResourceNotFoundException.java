package com.uiktp.model.exceptions.general;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(Class<?> entityType, Long entityId) {
        super(String.format("%s with id: %d not found", entityType.getSimpleName(), entityId));
    }
}