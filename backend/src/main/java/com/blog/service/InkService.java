package com.blog.service;

import com.blog.entity.Ink;
import com.blog.exception.InkNotFoundException;
import com.blog.repository.InkRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class InkService {
  private final InkRepository inkRepository;

  public InkService(InkRepository inkRepository) {
    this.inkRepository = inkRepository;
  }

  public Page<Ink> findAll(Pageable pageable) {
    return inkRepository.findAll(pageable);
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
}
