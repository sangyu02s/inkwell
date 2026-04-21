## Why

The blog currently has no user authentication. Any visitor can create, edit, or delete any ink. This is inappropriate for a production blog - we need users to have their own identities, and only authors should modify their own content. Adding authentication also enables future features like comments, likes, and personal dashboards.

## What Changes

- **Backend**: Add `User` entity with username/email/password, JWT-based authentication endpoints (`POST /api/auth/register`, `POST /api/auth/login`)
- **Backend**: Add `@AuthenticationPrincipal` support, protect write endpoints (`POST`, `PUT`, `DELETE`) so only the ink's author can modify it
- **Frontend**: Add login and registration forms with Zod validation
- **Frontend**: Store JWT in httpOnly cookie (secure), auto-attach to API requests
- **Frontend**: Add `AuthContext` with user state, login/logout actions
- **Frontend**: Protect write buttons (Edit/Delete) - show only for own inks
- **Frontend**: Add user profile page showing user's inks

## Capabilities

### New Capabilities

- `user-auth`: User registration and login with JWT. BCrypt password hashing, httpOnly cookie storage, 24h token expiration.
- `ink-ownership`: Ink entity gains `authorId` field. Only the author can edit or delete their inks. Non-authors see read-only view.
- `auth-context`: Frontend `AuthContext` managing user state. Persistent login via cookie. Auto-refresh or logout on 401.

### Modified Capabilities

- (none - Phase 2 does not change existing spec requirements)

## Impact

- **Backend**: New `User` entity, `UserRepository`, `AuthService`, `AuthController`. New dependency: `jjwt` for JWT handling.
- **Frontend**: New `auth/` directory with `LoginPage.tsx`, `RegisterPage.tsx`. New `AuthContext.tsx`, `useAuth.ts` hook. Update `InkFormPage` to show author info.
- **Database**: New `users` table with id, username, email, password_hash, created_at.
- **Breaking**: Write endpoints now require `Authorization: Bearer <token>` header. Anonymous reads still allowed.