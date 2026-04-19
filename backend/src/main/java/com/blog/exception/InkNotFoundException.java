package com.blog.exception;

public class InkNotFoundException extends RuntimeException {
  public InkNotFoundException(String message) {
    super(message);
  }
}
