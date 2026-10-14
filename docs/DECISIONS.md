# Architecture & Technical Decisions (DECISIONS.md)

This log documents all architectural and technical decisions made during the development of SellAnyBus.in, in accordance with the PRD Section 1.

---

## Decision 1: Project Architecture & Directory Layout
- **Decision:** Use Next.js 15 App Router with a modular monolith structure under `src/modules/`.
- **Rationale:** Keeps domain business logic separated from presentation and routing layers. Allows thin route handlers and reusable server-side services (vehicles, listings, inspections, valuations, enquiries, auth, audit).

## Decision 2: Database Strategy & Local Execution
- **Decision:** Use Prisma ORM with PostgreSQL schema as specified in PRD Section 3.
- **Details:** Provide `docker-compose.yml` for local PostgreSQL services. In environments without Docker daemon or native PostgreSQL installed, support `@prisma/adapter-pglite` or SQLite fallback for development and unit testing so that migrations, tests, and seed scripts run seamlessly without external infrastructure blockers.

## Decision 3: Authentication & Token Management
- **Decision:** Custom mobile OTP login storing signed JWTs in `httpOnly` secure cookies.
- **Details:** Access token short-lived (15 min), refresh token (7 days) with rotation. Dev environment uses `ConsoleOtpProvider` (logs to console and accepts fixed OTP `123456`). Staff login supports bcrypt-hashed passwords for `/auth/staff/login`.

## Decision 4: Document Privacy & Signed URL Access
- **Decision:** Sensitive documents (RC, Aadhaar, Insurance, Fitness, Permits, Tax, NOC) stored in private storage bucket.
- **Details:** Direct access is denied. Admin/staff must request time-limited signed URLs (≤ 5 minutes expiration) which require role validation and generate an audit log entry on every view. No sensitive identification numbers or document URLs are ever exposed in public APIs.

## Decision 5: Listing State Machine Publishing Gate
- **Decision:** Strictly enforce the hard rule in `src/modules/listings/listing.service.ts`:
  1. All required vehicle documents must be `VERIFIED`.
  2. Vehicle inspection must be `APPROVED`.
  3. Seller must have recorded explicit price approval for the recommended valuation.
- **Rationale:** Mandated by PRD Section 7 & 13.
