package com.blog.controller;

import com.blog.entity.Tag;
import com.blog.service.TagService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "*")
public class TagController {
  private final TagService tagService;

  public TagController(TagService tagService) {
    this.tagService = tagService;
  }

  @GetMapping
  public ResponseEntity<List<Tag>> getAll(@RequestParam(required = false) String q) {
    List<Tag> tags;
    if (q != null && !q.isBlank()) {
      tags = tagService.findByPrefix(q.trim());
    } else {
      tags = tagService.findAll();
    }
    return ResponseEntity.ok(tags);
  }

  @PostMapping
  public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
    String name = body.get("name");
    if (name == null || name.isBlank()) {
      return ResponseEntity.badRequest().body(Map.of("error", "Tag name is required"));
    }
    if (name.length() > 50) {
      return ResponseEntity.badRequest().body(Map.of("error", "Tag name must be at most 50 characters"));
    }
    try {
      Tag tag = tagService.create(name);
      return ResponseEntity.status(HttpStatus.CREATED).body(tag);
    } catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
    }
  }
}
