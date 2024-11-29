package com.pere_palacin.app.exceptions;

public class BatchDeleteRequestToLargeException extends RuntimeException {
    public BatchDeleteRequestToLargeException() {
        super("Batch delete exceeds maximum size of 20 items per request.");
    }
}
