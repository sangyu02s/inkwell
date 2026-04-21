## 1. Backend - User Entity & Repository

- [ ] 1.1 Add `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (0.12.5) and `spring-boot-starter-security` to pom.xml
- [ ] 1.2 Create `User.java` entity with id, username, email, passwordHash, createdAt fields
- [ ] 1.3 Add `@Column(unique = true)` constraints on username and email
- [ ] 1.4 Create `UserRepository.java` extending `JpaRepository<User, Long>`
- [ ] 1.5 Add `findByUsername(String username)` and `findByEmail(String email)` methods

## 2. Backend - JWT Utilities

- [ ] 2.1 Create `JwtUtils.java` class with `generateToken(userId, username)` method
- [ ] 2.2 Implement `validateToken(token)` method returning claims or throwing ExpiredException
- [ ] 2.3 Extract userId from token with `getUserIdFromToken(token)`
- [ ] 2.4 Use HS256 algorithm, 24h expiration, secret from environment variable `JWT_SECRET`
- [ ] 2.5 Create `JwtAuthenticationFilter.java` extending `OncePerRequestFilter`
- [ ] 2.6 Extract JWT from cookie, validate, set SecurityContext with username/userId

## 3. Backend - Security Configuration

- [ ] 3.1 Create `SecurityConfig.java` with `SecurityFilterChain` bean
- [ ] 3.3 Configure stateless session, disable CSRF (REST API)
- [ ] 3.4 Permit all on `/api/auth/**` and `GET /api/inks`
- [ ] 3.5 Require authentication on POST/PUT/DELETE `/api/inks/**`
- [ ] 3.6 Add `AuthenticationEntryPoint` for 401 responses with JSON error body

## 4. Backend - Auth Service & Controller

- [ ] 4.1 Create `AuthService.java` with `register(username, email, password)` method
- [ ] 4.2 Use `BCryptPasswordEncoder` to hash password, return JWT token
- [ ] 4.3 Create `AuthService.java` with `login(username, password)` method
- [ ] 4.4 Validate credentials, return JWT token on success
- [ ] 4.5 Throw `BadCredentialsException` on failure (for consistent error messages)
- [ ] 4.6 Create `AuthController.java` with `POST /api/auth/register`
- [ ] 4.7 Create `AuthController.java` with `POST /api/auth/login`
- [ ] 4.8 Return JWT in response body (client will set cookie)

## 5. Backend - Current User Endpoint

- [ ] 5.1 Add `GET /api/auth/me` endpoint returning current user info
- [ ] 5.2 Return `{ id, username, email }` for authenticated user
- [ ] 5.3 Return 401 if not authenticated

## 6. Backend - Ink Ownership

- [ ] 6.1 Add `authorId` (ManyToOne) field to `Ink.java` entity
- [ ] 6.2 Add `authorUsername` column (String, denormalized for read performance)
- [ ] 6.3 Update `@PrePersist` to set `author` from SecurityContext
- [ ] 6.4 Update `InkController.create()` to set author from JWT claims
- [ ] 6.5 Add `GET /api/inks` to return `authorUsername` in response (add join or subquery)
- [ ] 6.6 Add ownership check on `PUT /api/inks/{id}` - return 403 if not owner
- [ ] 6.7 Add ownership check on `DELETE /api/inks/{id}` - return 403 if not owner
- [ ] 6.8 Update `data.sql` with sample users (bcrypt hashed passwords)

## 7. Frontend - Auth Context

- [ ] 7.1 Create `AuthContext.tsx` with React Context + useReducer
- [ ] 7.2 Implement actions: LOGIN, LOGIN_FAILURE, LOGOUT, INIT_COMPLETE
- [ ] 7.3 On INIT action, call `GET /api/auth/me` to restore session from cookie
- [ ] 7.4 Create `useAuth.ts` hook exposing `{ user, isAuthenticated, isLoading, login, logout, register }`
- [ ] 7.5 Update API layer to include `withCredentials: true` on all requests

## 8. Frontend - Login & Register Pages

- [ ] 8.1 Create `pages/auth/LoginPage.tsx` with username/password form
- [ ] 8.2 Add Zod schema: `z.object({ username: z.string().min(1), password: z.string().min(1) })`
- [ ] 8.3 Create `pages/auth/RegisterPage.tsx` with username/email/password/confirmPassword form
- [ ] 8.4 Add Zod schema with email format and password confirmation validation
- [ ] 8.5 On success, store token in cookie (backend sets httpOnly cookie automatically via Set-Cookie header - handle via withCredentials)
- [ ] 8.6 On success, redirect to `/inks`

## 9. Frontend - Protected Routes

- [ ] 9.1 Create `components/ProtectedRoute.tsx` that checks AuthContext.isAuthenticated
- [ ] 9.2 If not authenticated, redirect to `/auth/login?redirect=<currentPath>`
- [ ] 9.3 Wrap `/inks/new` and `/inks/:id/edit` with ProtectedRoute
- [ ] 9.4 Update App.tsx to add `/auth/login` and `/auth/register` routes

## 10. Frontend - Navigation & UI Updates

- [ ] 10.1 Update navigation to show username + logout when authenticated
- [ ] 10.2 Show Login/Register links when not authenticated
- [ ] 10.3 On ink detail page, show author username
- [ ] 10.4 Conditionally show Edit/Delete buttons - only for `ink.authorId === currentUser.id`
- [ ] 10.5 Add "My Inks" link to navigation (filtered view of user's inks)

## 11. Verification

- [ ] 11.1 Backend compiles (`mvn compile`)
- [ ] 11.2 Frontend lint + build passes
- [ ] 11.3 User can register and receive JWT
- [ ] 11.4 User can login and receive JWT
- [ ] 11.5 Authenticated user can create ink with authorId set
- [ ] 11.6 Non-owner cannot edit/delete other's inks (403 returned)
- [ ] 11.7 Unauthenticated users can read all inks
- [ ] 11.8 Frontend login/register pages work with form validation
- [ ] 11.9 Protected routes redirect to login when unauthenticated
- [ ] 11.10 Playwright E2E: register → create ink → see own author name → logout