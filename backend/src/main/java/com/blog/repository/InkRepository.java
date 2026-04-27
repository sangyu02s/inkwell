package com.blog.repository;

import com.blog.entity.Ink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InkRepository extends JpaRepository<Ink, Long> {
  @Query("SELECT DISTINCT i FROM Ink i JOIN i.tags t WHERE LOWER(t.name) = LOWER(:tagName)")
  List<Ink> findByTagName(@Param("tagName") String tagName);

  @Query("SELECT DISTINCT i FROM Ink i JOIN i.tags t WHERE LOWER(t.name) IN :tagNames GROUP BY i HAVING COUNT(DISTINCT t) = :size")
  List<Ink> findByTagNames(@Param("tagNames") List<String> tagNames, @Param("size") long size);
}
