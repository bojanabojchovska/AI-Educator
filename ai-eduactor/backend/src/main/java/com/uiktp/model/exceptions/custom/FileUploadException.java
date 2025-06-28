package com.uiktp.model.exceptions.custom;

public class FileUploadException extends RuntimeException{
    public FileUploadException(String message){
        super("File upload failed!" + message);
    }
}
