package com.blog.controller;

import com.blog.config.UserPrincipal;
import com.blog.entity.Ink;
import com.blog.entity.User;
import com.blog.repository.UserRepository;
import com.blog.service.InkService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inks")
@CrossOrigin(origins = "*")
public class InkController {
  private final InkService inkService;
  private final UserRepository userRepository;

  public InkController(InkService inkService, UserRepository userRepository) {
    this.inkService = inkService;
    this.userRepository = userRepository;
  }

  @GetMapping
  public Page<Ink> getAll(Pageable pageable) {
    return inkService.findAll(pageable);
  }

  @GetMapping("/{id}")
  public Ink getOne(@PathVariable Long id) {
    return inkService.findById(id);
  }

  @PostMapping
  public ResponseEntity<?> create(@Valid @RequestBody Ink ink, Authentication authentication) {
    if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("error", "Authentication required"));
    }
    UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
    User author = userRepository.findById(principal.userId())
        .orElseThrow(() -> new IllegalStateException("User not found"));
    ink.setAuthor(author);
    ink.setAuthorUsername(author.getUsername());
    Ink created = inkService.create(ink);
    return new ResponseEntity<>(created, HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Ink ink, Authentication authentication) {
    if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("error", "Authentication required"));
    }
    UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
    Ink existing = inkService.findById(id);
    if (!existing.getAuthor().getId().equals(principal.userId())) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(java.util.Map.of("error", "You can only edit your own inks"));
    }
    Ink updated = inkService.update(id, ink);
    return new ResponseEntity<>(updated, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
    if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("error", "Authentication required"));
    }
    UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
    Ink existing = inkService.findById(id);
    if (!existing.getAuthor().getId().equals(principal.userId())) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(java.util.Map.of("error", "You can only delete your own inks"));
    }
    inkService.delete(id);
    return ResponseEntity.noContent().build();
  }
}