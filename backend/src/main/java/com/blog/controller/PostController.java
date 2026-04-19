package com.blog.controller;

import com.blog.entity.Post;
import com.blog.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
  private final PostService postService;

  public PostController(PostService postService) {
    this.postService = postService;
  }

  @GetMapping
  public Page<Post> getAll(Pageable pageable) {
    return postService.findAll(pageable);
  }

  @GetMapping("/{id}")
  public Post getOne(@PathVariable Long id) {
    return postService.findById(id);
  }

  @PostMapping
  public ResponseEntity<Post> create(@Valid @RequestBody Post post) {
    Post created = postService.create(post);
    return new ResponseEntity<>(created, HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Post> update(@PathVariable Long id, @Valid @RequestBody Post post) {
    Post updated = postService.update(id, post);
    return new ResponseEntity<>(updated, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    postService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
