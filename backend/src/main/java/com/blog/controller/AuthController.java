package com.blog.controller;

import org.springframework.security.authentication.BadCredentialsException;
import com.blog.config.UserPrincipal;
import com.blog.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody Map<String, String> body, jakarta.servlet.http.HttpServletResponse response) {
    String username = body.get("username");
    String email = body.get("email");
    String password = body.get("password");

    if (username == null || username.isBlank()) {
      return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
    }
    if (email == null || email.isBlank()) {
      return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
    }
    if (password == null || password.length() < 8) {
      return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 8 characters"));
    }

    try {
      String token = authService.register(username, email, password);
      setTokenCookie(response, token);
      return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("token", token));
    } catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String, String> body, jakarta.servlet.http.HttpServletResponse response) {
    String username = body.get("username");
    String password = body.get("password");

    try {
      String token = authService.login(username, password);
      setTokenCookie(response, token);
      return ResponseEntity.ok(Map.of("token", token));
    } catch (BadCredentialsException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
    }
  }

  private void setTokenCookie(jakarta.servlet.http.HttpServletResponse response, String token) {
    jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("token", token);
    cookie.setHttpOnly(true);
    cookie.setPath("/");
    cookie.setMaxAge(86400);
    response.addCookie(cookie);
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(Authentication authentication) {
    if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
    }
    UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
    return ResponseEntity.ok(Map.of("id", principal.userId(), "username", principal.username()));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(jakarta.servlet.http.HttpServletResponse response) {
    jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("token", "");
    cookie.setHttpOnly(true);
    cookie.setPath("/");
    cookie.setMaxAge(0);
    response.addCookie(cookie);
    return ResponseEntity.ok(Map.of("message", "Logged out"));
  }
}