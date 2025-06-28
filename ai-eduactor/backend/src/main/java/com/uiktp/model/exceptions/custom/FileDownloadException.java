package com.uiktp.model.exceptions.custom;

public class FileDownloadException extends RuntimeException{
    public FileDownloadException(String filePath){
        super(String.format("Cannot access file at: %s", filePath));
    }
}
