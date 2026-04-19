package com.blog.service;

import com.blog.entity.Post;
import com.blog.exception.PostNotFoundException;
import com.blog.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {
  private final PostRepository postRepository;

  public PostService(PostRepository postRepository) {
    this.postRepository = postRepository;
  }

  public List<Post> findAll() {
    return postRepository.findAll();
  }

  public Post findById(Long id) {
    return postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found with id " + id));
  }

  public Post create(Post post) {
    post.setCreatedAt(LocalDateTime.now());
    post.setUpdatedAt(LocalDateTime.now());
    return postRepository.save(post);
  }

  public Post update(Long id, Post updated) {
    Post existing = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found with id " + id));
    existing.setTitle(updated.getTitle());
    existing.setContent(updated.getContent());
    existing.setUpdatedAt(LocalDateTime.now());
    return postRepository.save(existing);
  }

  public void delete(Long id) {
    Post existing = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found with id " + id));
    postRepository.delete(existing);
  }
}
