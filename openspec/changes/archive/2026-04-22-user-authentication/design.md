## Context

The blog currently has no user authentication - any visitor can create, edit, or delete any ink. The Phase 1 UX foundations are complete (pagination, form validation, error boundaries, loading skeletons). Phase 2 introduces user authentication and ink ownership.

**Current State:**
- `Ink` entity has: id, title, content, createdAt, updatedAt
- No user tracking - no author information
- All API endpoints are public (GET, POST, PUT, DELETE)
- Frontend has no authentication state management

**Constraints:**
- Backend: Spring Boot 3.2, JPA with H2, `jjwt` library for JWT
- Frontend: React 19, React Router v7, Zod already available
- Passwords: BCrypt with minimum 10 salt rounds
- JWT: stored in httpOnly cookie, 24h expiration, HS256 signing

## Goals / Non-Goals

**Goals:**
- User registration with username/email/password
- User login returning JWT token
- JWT authentication on write endpoints (POST, PUT, DELETE)
- Ink ownership tracking (authorId on Ink)
- Ownership-based write protection (only author can edit/delete)
- Frontend AuthContext for login state management
- Login/Register pages with Zod validation
- Protected routes for write operations
- User profile page showing own inks

**Non-Goals:**
- OAuth/social login (Google, GitHub)
- Password reset / email verification
- User roles or admin functionality
- Comments or likes (Phase 3+)
- Profile picture upload
- JWT token refresh (re-login after 24h is acceptable)

## Decisions

### D1: JWT Storage - httpOnly Cookie (not localStorage)

**Decision:** Store JWT in httpOnly cookie, not localStorage.

**Alternatives considered:**
- localStorage (vulnerable to XSS)
- memory-only (lost on page refresh - needs cookie fallback anyway)

**Rationale:** httpOnly cookies cannot be accessed by JavaScript, making them immune to XSS attacks. The cookie should have `secure` flag in production (HTTPS only) and `sameSite: strict` to prevent CSRF.

**API Shape:**
```
POST /api/auth/login
Request: { "username": "alice", "password": "pass123" }
Response: 200 OK + Set-Cookie: token=<jwt>; HttpOnly; SameSite=Strict

POST /api/auth/register
Request: { "username": "alice", "email": "alice@example.com", "password": "pass123" }
Response: 201 Created + Set-Cookie: token=<jwt>; HttpOnly; SameSite=Strict
```

### D2: JWT Claims Structure

**Decision:** JWT payload contains `sub` (userId) and `username` claims.

```json
{
  "sub": 42,
  "username": "alice",
  "iat": 1713000000,
  "exp": 1713086400
}
```

**Rationale:** Minimal claims - userId for database lookups, username for display. Email not needed in token since it's rarely used in auth flows.

### D3: BCrypt Password Hashing

**Decision:** Use Spring Security's `BCryptPasswordEncoder` with default strength (10).

**Rationale:** Industry standard. 10 salt rounds provides good security without excessive CPU cost. Spring Security's encoder handles salt generation internally.

### D4: Spring Security Filter Chain

**Decision:** Use Spring Security with a custom `JwtAuthenticationFilter`.

**Filter order:**
1. `SecurityFilterChain` with stateless session (`STATELESS`)
2. For `/api/auth/**` - permit all
3. For GET `/api/inks` - permit all (public read)
4. For authenticated endpoints - require valid JWT

**Rationale:** Clean separation of concerns. Filter extracts JWT from cookie, validates, sets SecurityContext. Controllers remain simple.

### D5: Frontend AuthContext

**Decision:** Create `AuthContext` with React Context + `useReducer`.

**State shape:**
```typescript
interface AuthState {
  user: { id: number; username: string; email: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Actions:** LOGIN, LOGIN_FAILURE, LOGOUT, INIT (check cookie on mount)

**Rationale:** Centralized auth state. On app mount, check for existing cookie and restore session. API layer automatically includes cookie in requests (withCredentials: true).

### D6: Backend Entity Design - User

**Decision:** Create `User` entity with id, username (unique), email (unique), passwordHash, createdAt.

```java
@Entity
@Table(name = "users")
public class User {
  @Id @GeneratedValue
  private Long id;

  @Column(unique = true, nullable = false)
  private String username;

  @Column(unique = true, nullable = false)
  private String email;

  @Column(nullable = false)
  private String passwordHash;

  private LocalDateTime createdAt;
}
```

**Rationale:** Simple user model. Username for display, email for future features (password reset). No roles - all users are equal.

### D7: Ink entity gets authorId

**Decision:** Add `authorId` (ManyToOne User) to Ink entity.

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "author_id", nullable = false)
private User author;
```

**Rationale:** Ink creation sets author from SecurityContext. Future: could add authorName field for easier display (avoid JOIN on read).

### D8: Protected endpoints return 403 for non-owners

**Decision:** PUT/DELETE check `ink.author.id == currentUser.id`, return 403 if not.

**Rationale:** Consistent with REST semantics - 401 for auth issues, 403 for permission issues.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| XSS steals JWT from cookie | httpOnly cookie is immune to JS access |
| CSRF attack on write endpoints | sameSite=strict cookie prevents cross-origin sends |
| User enumerates usernames via login | Return same "Invalid credentials" for unknown user + wrong password |
| JWT secret exposed in repo | Use environment variable `JWT_SECRET`, not in code |
| Frontend redirect loop on auth failure | Max 1 redirect, then show error page |

## Migration Plan

**Backend:**
1. Add `jjwt-api`, `jjwt-impl`, `jjwt-jackson` dependencies (0.12.5)
2. Add `spring-boot-starter-security` dependency
3. Create `User` entity, `UserRepository`
4. Create `AuthService` with register/login methods
5. Create `AuthController` for `/api/auth/register`, `/api/auth/login`
6. Create `JwtUtils` class for token create/validate
7. Create `JwtAuthenticationFilter` for Spring Security
8. Configure `SecurityFilterChain` with stateless session
9. Add `authorId` to `Ink` entity, update `InkController`
10. Add ownership checks on PUT/DELETE endpoints
11. Update `data.sql` to include sample users

**Frontend:**
1. Create `AuthContext.tsx` with login/logout state
2. Create `useAuth.ts` hook
3. Create `LoginPage.tsx` and `RegisterPage.tsx` with Zod schemas
4. Update `App.tsx` with `/auth/*` routes
5. Update API layer with `withCredentials: true`
6. Add ProtectedRoute component
7. Update ink pages to show author info
8. Conditionally show Edit/Delete buttons based on ownership
9. Add logout button to navigation

**Rollback:** Remove Spring Security filter chain, revert Ink entity (drop authorId column), frontend removes AuthContext.

## Open Questions

- Should we add a "current user" endpoint like `GET /api/auth/me`? → **Yes, useful for frontend init**
- What happens when user tries to edit an ink they don't own? → **Show read-only view, no edit button**
- Should `authorUsername` be denormalized on Ink for faster reads? → **Yes, add `authorUsername` column to avoid JOIN**