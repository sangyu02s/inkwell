package com.blog.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tags")
public class Tag {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "Tag name must not be blank")
  @Size(min = 1, max = 50, message = "Tag name must be at most 50 characters")
  @Column(unique = true, nullable = false, length = 50)
  private String name;

  @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
  @JsonIgnore
  private Set<Ink> inks = new HashSet<>();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Set<Ink> getInks() {
    return inks;
  }

  public void setInks(Set<Ink> inks) {
    this.inks = inks;
  }
}
