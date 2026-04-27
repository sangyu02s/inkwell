# Inkwell（墨池）— Developer Context

## Project Overview

- **Type**: Full-stack blog (Spring Boot API + React/Vite frontend)
- **Stack**: Spring Boot 3.2.3 · Java 21 · H2 · JWT | React 18 · TypeScript · Vite · TanStack Query v5
- **Auth**: JWT (HS512) stored in httpOnly Cookie — frontend reads via `AuthContext`

## Project Structure

```
inkwell/
├── backend/                    # Spring Boot API (port 8080)
│   └── src/main/resources/
│       └── application.properties  # H2 create-drop, JWT secret
├── frontend/                   # React SPA (port 5173)
│   └── src/
│       ├── api/              # Axios API calls
│       ├── contexts/          # AuthContext (JWT cookie state)
│       ├── pages/             # Route pages
│       └── components/        # Shared components
├── openspec/                  # OpenSpec change workflow artifacts
├── data.sql                   # H2 seed data (14 posts + 1 user)
└── AGENTS.md                  # This file
```

## Developer Commands

### Backend (port 8080)
```bash
# Uses custom Maven path — do NOT assume `mvn` is available globally
/Users/sangyu/DevTools/apache-maven-3.9.14/bin/mvn spring-boot:run -q

# Restart (kill + start)
lsof -ti :8080 | xargs kill -9 2>/dev/null; sleep 2
nohup /Users/sangyu/DevTools/apache-maven-3.9.14/bin/mvn spring-boot:run -q > /tmp/inkwell.log 2>&1 &

# Verify startup
curl -s http://localhost:8080/api/inks | python3 -c "import sys,json; print(f'inks: {json.load(sys.stdin)[\"totalElements\"]}')"
```

### Frontend (port 5173)
```bash
cd frontend
npm run dev          # Dev server with HMR
npm run build        # Typecheck + Vite build (tsc -b && vite build)
npm run lint         # ESLint flat config
npm run preview      # Preview production build
```

### Vite Proxy
`vite.config.ts` proxies `/api` → `http://localhost:8080`. Frontend API calls use absolute paths (`/api/auth/...`).

## Critical Behavior

- **H2 Database**: In-memory, `ddl-auto=create-drop`. **Data resets on every restart.** `data.sql` re-executes on each startup.
- **JWT Auth**: Tokens in httpOnly Cookie. Manual cookie management for testing (browser handles automatically).
- **No tests configured**: No test directories or test commands in pom.xml or package.json.

## Pre-configured Accounts

| Username | Email | Password |
|----------|-------|----------|
| sakura | sakura@gmail.com | 12345678 |

## OpenSpec Workflow

This repo uses OpenSpec artifact workflow (`/openspec-*` skills). Active changes live in `openspec/changes/`, archived in `openspec/changes/archive/`.

Key skills: `openspec-new-change`, `openspec-propose`, `openspec-apply-change`, `openspec-verify-change`, `openspec-archive-change`

## Architecture Notes

- **Entry points**: Backend `BlogApplication.java`; Frontend `App.tsx` (router)
- **Auth flow**: `SecurityConfig` → `JwtAuthenticationFilter` → `AuthService` → `AuthController`
- **Ownership check**: `InkService` validates `authorId` on edit/delete (not in repository layer)
- **State management**: Server state via TanStack Query, client auth state via `AuthContext`

## CI/Lint Conventions

- Frontend ESLint: flat config (`eslint.config.js`), extends `recommended`, `typescript-eslint`, `react-hooks`
- No Prettier — ESLint handles formatting
- TypeScript strict mode: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`
