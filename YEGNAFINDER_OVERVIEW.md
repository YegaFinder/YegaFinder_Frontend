# YegnaFinder — App Overview

**Developed by:** Phoenixopia Solution PLC

---

## What is YegnaFinder?

YegnaFinder is **Ethiopia's Smart Local Discovery & Marketplace Platform** — a Progressive Web App (PWA) that connects customers with local businesses. Users can discover nearby businesses, make bookings, manage their profiles, and interact with merchants through a single platform.

The app targets multiple user roles:

| Role | Description |
|------|-------------|
| **Customer** | Discovers and books local businesses |
| **Merchant** | Lists and manages their business, handles bookings |
| **Moderator** | Reviews and moderates business listings |
| **Admin** | Full platform management and oversight |

### Current Status

The platform is in active development. The authentication system and core user management are fully implemented. Business discovery, bookings, and the merchant/admin dashboards are planned for upcoming sprints.

**Planned Features (by sprint):**
- Sprint 1 ✅ — Authentication (register, login, OTP email verification, Google SSO, password reset)
- Sprint 2 — Customer profile management
- Sprint 3 — Business discovery (search, browse, detail pages)
- Later — Merchant dashboard, bookings, admin panel

---

## Architecture Overview

```
┌─────────────────────────┐        HTTPS / REST        ┌──────────────────────────┐
│   Next.js Frontend PWA  │ ◄────────────────────────► │   NestJS Backend API     │
│   (Port 3000)           │                             │   (Port 8000 / api/v1)   │
└─────────────────────────┘                             └──────────┬───────────────┘
                                                                   │
                                              ┌────────────────────┼────────────────────┐
                                              │                    │                    │
                                     ┌────────▼────────┐  ┌───────▼────────┐  ┌────────▼───────┐
                                     │   PostgreSQL     │  │     Redis      │  │  Resend (email)│
                                     │   (TypeORM)      │  │   (Cache/OTP)  │  │                │
                                     └─────────────────┘  └────────────────┘  └────────────────┘
```

---

## Tech Stack

### Backend — `yegnafinder-backend`

| Technology | Version | How It's Used |
|---|---|---|
| **NestJS** | v11 | Core server framework. Organizes the app into modules (AuthModule, UsersModule, CommonModule). Provides DI, pipes, guards, interceptors, and decorators. |
| **Node.js / TypeScript** | v5 TS | Runtime and language. Strict typing across all DTOs, entities, services, and controllers. |
| **TypeORM** | v1 | ORM for PostgreSQL. Defines the `users` and `refresh_tokens` entities as TypeScript classes. Handles migrations, soft deletes, and relations. |
| **PostgreSQL** | — | Primary relational database. Stores users, refresh tokens, and (later) businesses and bookings. |
| **Redis** | via ioredis | In-memory data store used for two things: (1) caching OTP codes with TTL during email verification and password reset, and (2) login rate limiting (max 10 attempts per 15 min per IP/email combination). |
| **`@nestjs/cache-manager`** | v3 | NestJS abstraction over `cache-manager` + `cache-manager-ioredis-yet` for Redis integration. Used by `SessionCacheService` and `OtpService`. |
| **Passport.js + `passport-jwt`** | v0.7 / v4 | Strategy-based authentication middleware. `JwtStrategy` validates the Bearer token on every protected route. A global `JwtAuthGuard` is applied by default; individual routes opt out with the `@Public()` decorator. |
| **`@nestjs/jwt`** | v11 | Signs and verifies JWT access tokens (15-minute expiry) and refresh tokens (7-day expiry) using separate secrets. |
| **bcrypt** | v6 | Password hashing with a cost factor of 12. Used in `User.hashPassword()` and `User.validatePassword()`. Refresh tokens are also stored hashed in the database. |
| **Google Auth Library** | v9 | Verifies Google `idToken`s issued by the frontend's Google Sign-In SDK. If the account doesn't exist, it is auto-created as a Customer. |
| **Resend** | v4 | Transactional email service. Sends OTP codes for email verification and password reset flows. Configured with `RESEND_API_KEY` and a `no-reply@yegnafinder.com` sender. |
| **`@nestjs/swagger`** | v11 | Auto-generates OpenAPI documentation from controller decorators. Docs available at `/api/docs`. All auth endpoints are fully documented. |
| **class-validator / class-transformer** | v0.15 / v0.5 | DTO validation. The global `ValidationPipe` (whitelist + forbidNonWhitelisted) ensures only declared fields reach the handlers. |
| **`@nestjs/config`** | v4 | Environment variable management with `Joi`-based validation on startup. App fails fast if a required env var (like `JWT_SECRET`) is missing. |
| **RxJS** | v7 | Used internally by NestJS for its interceptor pipeline (e.g., `TransformInterceptor` wraps all responses in a `{ success, data, message }` envelope). |
| **Docker** | — | `Dockerfile` and `docker-compose.yml` for local development and deployment. Includes PostgreSQL and Redis service definitions. |
| **Jest** | v30 | Unit and e2e test runner. `ts-jest` for TypeScript support. |
| **ESLint + Prettier** | v9 / v3 | Code quality and formatting. Enforced via `eslint.config.mjs` and `.prettierrc`. |

#### Backend Module Structure

```
src/
├── app.module.ts          # Root module — wires all infrastructure
├── main.ts                # Bootstrap: global prefix, CORS, ValidationPipe, Swagger
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts # All /auth/* endpoints
│   ├── services/
│   │   ├── auth.service.ts         # Core auth business logic
│   │   ├── otp.service.ts          # OTP generation + Redis storage
│   │   ├── token.service.ts        # JWT issuance + token rotation
│   │   ├── refresh-token.service.ts # Refresh token DB lifecycle
│   │   └── session-cache.service.ts # Login rate limiting via Redis
│   ├── dto/               # RegisterDto, LoginDto, VerifyOtpDto, etc.
│   └── entities/
│       └── refresh-token.entity.ts
├── users/
│   ├── users.service.ts
│   ├── entities/
│   │   └── user.entity.ts  # Main user model
│   └── dto/
└── common/
    ├── decorators/         # @Public(), @CurrentUser(), @Roles()
    ├── guards/             # JwtAuthGuard, RolesGuard
    ├── filters/            # HttpExceptionFilter
    └── interceptors/       # TransformInterceptor (response envelope)
```

---

### Frontend — `yegnafinder-frontend`

| Technology | Version | How It's Used |
|---|---|---|
| **Next.js** | v15 (App Router) | Full-stack React framework. Uses the App Router for file-based routing, server components, and layout nesting. The `/dashboard` and `/profile` routes are protected at the middleware level. |
| **React** | v19 | UI rendering. All client-side components and interactive auth forms. |
| **TypeScript** | v5 | Strict typing across all pages, components, hooks, API functions, and Zustand stores. |
| **Tailwind CSS** | v4 | Utility-first styling. All components are styled with Tailwind classes. Uses `tw-animate-css` for animations. |
| **shadcn/ui** | — | Component library built on Radix UI primitives (Label, Slot) + `class-variance-authority`. Provides accessible, unstyled base components that are composed into the app's design system. |
| **Radix UI** | v2 | Headless, accessible UI primitives used as the foundation of shadcn components (`@radix-ui/react-label`, `@radix-ui/react-slot`). |
| **`class-variance-authority` (CVA)** | v0.7 | Defines component variants (e.g., button sizes/colors) as typed TypeScript functions. Works alongside `clsx` and `tailwind-merge`. |
| **Zustand** | v5 | Client-side state management. The `useAuthStore` holds the current user, authentication status, and loading state. Uses `zustand/middleware/persist` to hydrate the user from localStorage across page refreshes. |
| **Axios** | v1.18 | HTTP client for all API calls. A single `apiClient` instance is configured with: (1) a request interceptor that attaches the Bearer token, and (2) a response interceptor that silently refreshes on a 401 and retries the original request — or logs out if the refresh also fails. |
| **Zod** | v3.24 | Schema-based runtime validation for all form inputs (email format, password strength, OTP format, etc.). Schemas are colocated with each feature's types. |
| **React Hook Form** | v7.54 | Performant form state management. Integrates with Zod via `@hookform/resolvers/zod` for schema-driven validation on all auth forms. |
| **Serwist (`@serwist/next`)** | v9 | Service worker library for Next.js. Configures the app as an installable PWA with offline support, asset precaching, and a `manifest.json`. Google Fonts (Poppins, Inter, Noto Sans Ethiopic) are also cached. |
| **`lucide-react`** | v0.469 | Icon library used throughout the UI. |
| **Next.js Middleware** | — | Runs server-side before any page render. Checks for an `access_token` cookie on protected routes (`/dashboard/*`, `/profile/*`) and redirects unauthenticated users to `/login?redirectTo=...`. |

#### Frontend Feature Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── (auth)/            # Route group: login, register, forgot-password, verify-otp, reset-password
│   ├── (main)/            # Route group: home, businesses (planned), profile (planned)
│   └── dashboard/         # Merchant dashboard (planned)
├── features/
│   └── auth/
│       ├── api/           # authApi — all backend HTTP calls
│       ├── hooks/         # useLogin, useRegister, useVerifyOtp, etc.
│       ├── types/         # TypeScript types for auth payloads and responses
│       └── schemas/       # Zod validation schemas
├── components/            # Shared UI components (shadcn wrappers, etc.)
├── store/
│   └── auth-store.ts      # Zustand auth state
├── lib/
│   ├── api-client.ts      # Axios instance with token + refresh interceptors
│   └── auth-storage.ts    # Token read/write helpers (localStorage + cookie mirror)
├── constants/
│   └── routes.ts          # Centralised route constants (ROUTES.LOGIN, etc.)
├── config/                # App-level config (API URL, etc.)
└── middleware.ts           # Route protection via cookie check
```

---

## Authentication Flow

```
Register ──► OTP email (via Resend) ──► verify-otp ──► Login
                                                          │
                                              ┌───────────▼────────────┐
                                              │  accessToken (15m JWT) │
                                              │  refreshToken (7d, DB) │
                                              └───────────┬────────────┘
                                                          │
                                        401? ◄── Axios interceptor ──► /auth/refresh
                                                          │
                                              (rotate token pair or logout)
```

- **Email + Password** registration with OTP email verification before login is allowed
- **Google OAuth2** — frontend sends a Google `idToken`; backend verifies it and creates/finds the account
- **JWT access token** (15 min) in `Authorization: Bearer` header
- **Refresh token** (7 days) stored hashed in PostgreSQL; rotated on every use (old token revoked, new pair issued)
- **Token mirroring** — the access token is also written to an `access_token` cookie so Next.js middleware (which has no localStorage access) can check authentication on the server
- **Login rate limiting** — 10 failed attempts per IP/email combination in a 15-minute window, enforced via Redis

---

## API Endpoints

All endpoints are prefixed with `/api/v1`. Full interactive docs are available at `/api/docs` (Swagger UI).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/register` | Public | Register with name, email, password |
| `POST` | `/auth/verify-otp` | Public | Verify email with 6-digit OTP |
| `POST` | `/auth/resend-verification` | Public | Resend OTP to email |
| `POST` | `/auth/login` | Public | Email + password login |
| `POST` | `/auth/google` | Public | Google `idToken` login / register |
| `POST` | `/auth/refresh` | Public | Rotate refresh token pair |
| `GET` | `/auth/me` | Bearer | Get current user's profile |
| `POST` | `/auth/logout` | Bearer | Revoke one refresh token (single device) |
| `POST` | `/auth/logout-all` | Bearer | Revoke all tokens (all devices) |
| `POST` | `/auth/forgot-password` | Public | Request password reset OTP |
| `POST` | `/auth/reset-password` | Public | Reset password with OTP |

---

## Environment Variables

### Backend (`.env`)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default `8000`) |
| `FRONTEND_ORIGIN` | Comma-separated CORS origins |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | PostgreSQL connection |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | Redis connection |
| `JWT_SECRET` | Secret for access token signing |
| `JWT_EXPIRES_IN` | Access token lifetime (default `15m`) |
| `JWT_REFRESH_SECRET` | Secret for refresh token signing |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (default `7d`) |
| `OTP_EXPIRY_SECONDS` | OTP validity window (default `300` = 5 min) |
| `OTP_LENGTH` | OTP digit count (default `6`) |
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID |
| `RESEND_API_KEY` | Resend email API key |
| `RESEND_FROM_EMAIL` | Sender email address |

### Frontend (`.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend base URL (default `http://localhost:8000/api/v1`) |

---

## Running the App

### Backend

```bash
# Install dependencies
npm install

# Start with hot reload (development)
npm run start:dev

# Or with Docker (includes PostgreSQL + Redis)
docker-compose up
```

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Swagger UI available at: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
