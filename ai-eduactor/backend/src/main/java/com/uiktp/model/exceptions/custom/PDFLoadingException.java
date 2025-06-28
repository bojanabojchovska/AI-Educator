package com.uiktp.model.exceptions.custom;

public class PDFLoadingException extends RuntimeException {
    public PDFLoadingException() {
        super("There was an error while loading the PDF");
    }

}
