package com.blog.service;

import com.blog.entity.User;
import com.blog.repository.UserRepository;
import com.blog.util.JwtUtils;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtils jwtUtils;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtils = jwtUtils;
  }

  public String register(String username, String email, String password) {
    if (userRepository.findByUsername(username).isPresent()) {
      throw new IllegalStateException("Username already taken");
    }
    if (userRepository.findByEmail(email).isPresent()) {
      throw new IllegalStateException("Email already registered");
    }

    User user = new User();
    user.setUsername(username);
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(password));
    userRepository.save(user);

    return jwtUtils.generateToken(user.getId(), username);
  }

  public String login(String username, String password) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

    if (!passwordEncoder.matches(password, user.getPasswordHash())) {
      throw new BadCredentialsException("Invalid credentials");
    }

    return jwtUtils.generateToken(user.getId(), username);
  }
}