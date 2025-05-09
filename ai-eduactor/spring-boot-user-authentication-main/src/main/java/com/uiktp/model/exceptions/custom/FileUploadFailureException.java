package com.uiktp.model.exceptions.custom;

public class FileUploadFailureException extends RuntimeException{
    public FileUploadFailureException(){
        super("File failed to upload!");
    }
}
