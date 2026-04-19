package com.blog.controller;

import com.blog.entity.Ink;
import com.blog.service.InkService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inks")
@CrossOrigin(origins = "*")
public class InkController {
  private final InkService inkService;

  public InkController(InkService inkService) {
    this.inkService = inkService;
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
  public ResponseEntity<Ink> create(@Valid @RequestBody Ink ink) {
    Ink created = inkService.create(ink);
    return new ResponseEntity<>(created, HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Ink> update(@PathVariable Long id, @Valid @RequestBody Ink ink) {
    Ink updated = inkService.update(id, ink);
    return new ResponseEntity<>(updated, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    inkService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
