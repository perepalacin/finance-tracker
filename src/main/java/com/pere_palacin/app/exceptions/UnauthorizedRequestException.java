package com.pere_palacin.app.exceptions;

public class UnauthorizedRequestException extends RuntimeException {
  public UnauthorizedRequestException() {
    super("You are unauthorized to perform this request");
  }
}
