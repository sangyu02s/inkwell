package com.blog.service;

import com.blog.entity.Tag;
import com.blog.repository.TagRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {
  private final TagRepository tagRepository;

  public TagService(TagRepository tagRepository) {
    this.tagRepository = tagRepository;
  }

  public List<Tag> findAll() {
    return tagRepository.findAll();
  }

  public List<Tag> findByPrefix(String prefix) {
    return tagRepository.findByPrefix(prefix);
  }

  public Tag create(String name) {
    Tag tag = new Tag();
    tag.setName(name.toLowerCase().trim());
    try {
      return tagRepository.save(tag);
    } catch (DataIntegrityViolationException e) {
      throw new IllegalStateException("Tag already exists");
    }
  }

  public Tag findById(Long id) {
    return tagRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Tag not found with id " + id));
  }
}
