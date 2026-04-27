package com.blog.service;

import com.blog.entity.Ink;
import com.blog.entity.Tag;
import com.blog.exception.InkNotFoundException;
import com.blog.repository.InkRepository;
import com.blog.repository.TagRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class InkService {
  private final InkRepository inkRepository;
  private final TagRepository tagRepository;

  public InkService(InkRepository inkRepository, TagRepository tagRepository) {
    this.inkRepository = inkRepository;
    this.tagRepository = tagRepository;
  }

  public Page<Ink> findAll(Pageable pageable) {
    return inkRepository.findAll(pageable);
  }

  public Page<Ink> findByTag(String tagName, Pageable pageable) {
    List<Ink> inks = inkRepository.findByTagName(tagName.toLowerCase());
    return new PageImpl(inks, pageable, inks.size());
  }

  public Page<Ink> findByTags(List<String> tagNames, Pageable pageable) {
    List<String> lowerTagNames = tagNames.stream()
        .map(String::toLowerCase)
        .toList();
    List<Ink> inks = inkRepository.findByTagNames(lowerTagNames, lowerTagNames.size());
    return new PageImpl(inks, pageable, inks.size());
  }

  public Ink findById(Long id) {
    return inkRepository.findById(id).orElseThrow(() -> new InkNotFoundException("Ink not found with id " + id));
  }

  public Ink create(Ink ink) {
    ink.setCreatedAt(LocalDateTime.now());
    ink.setUpdatedAt(LocalDateTime.now());
    return inkRepository.save(ink);
  }

  public Ink update(Long id, Ink updated) {
    Ink existing = inkRepository.findById(id).orElseThrow(() -> new InkNotFoundException("Ink not found with id " + id));
    existing.setTitle(updated.getTitle());
    existing.setContent(updated.getContent());
    existing.setUpdatedAt(LocalDateTime.now());
    return inkRepository.save(existing);
  }

  public void delete(Long id) {
    Ink existing = inkRepository.findById(id).orElseThrow(() -> new InkNotFoundException("Ink not found with id " + id));
    inkRepository.delete(existing);
  }

  public Set<Tag> getTags(Long inkId) {
    Ink ink = inkRepository.findById(inkId)
        .orElseThrow(() -> new InkNotFoundException("Ink not found with id " + inkId));
    return ink.getTags();
  }

  public Ink setTags(Long inkId, List<Long> tagIds) {
    Ink ink = inkRepository.findById(inkId)
        .orElseThrow(() -> new InkNotFoundException("Ink not found with id " + inkId));

    Set<Tag> tags = new HashSet<>();
    for (Long tagId : tagIds) {
      Tag tag = tagRepository.findById(tagId)
          .orElseThrow(() -> new IllegalArgumentException("Tag not found with id " + tagId));
      tags.add(tag);
    }

    ink.setTags(tags);
    return inkRepository.save(ink);
  }
}
