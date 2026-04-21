package com.blog.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {

  private final SecretKey key;

  public JwtUtils(@Value("${jwt.secret}") String secret) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  public String generateToken(Long userId, String username) {
    return Jwts.builder()
        .subject(userId.toString())
        .claim("username", username)
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
        .signWith(key)
        .compact();
  }

  public Claims validateToken(String token) {
    return Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  public Long getUserIdFromToken(String token) {
    Claims claims = validateToken(token);
    return Long.parseLong(claims.getSubject());
  }

  public String getUsernameFromToken(String token) {
    Claims claims = validateToken(token);
    return claims.get("username", String.class);
  }
}