package com.blog.controller;

import com.blog.entity.Post;
import com.blog.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
  private final PostService postService;

  public PostController(PostService postService) {
    this.postService = postService;
  }

  @GetMapping
  public List<Post> getAll() {
    return postService.findAll();
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
