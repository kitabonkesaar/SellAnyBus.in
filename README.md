# SellAnyBus.in — Verified Used Bus & Coach Marketplace for Odisha

A managed, trust-and-transaction marketplace for buying and selling verified used buses and coaches across all 30 districts of Odisha, India.

---

## Key Highlights & Architectural Guarantees
- **RTO Document Verification Desk:** RC, commercial permits, fitness, tax tokens, and insurance are checked by compliance officers before vehicle approval.
- **14-Point Mechanical Inspection:** Physical and diagnostic evaluations covering engine blow-by, turbo, full air brake pressure build time, suspension, tyre tread depth, and chassis integrity.
- **Mandatory Seller Price Approval:** Vehicles **cannot** be published until the seller explicitly reviews and approves the recommended asking price.
- **Strict Privacy & DPDP Compliance:** Sensitive identity documents, Aadhaar, chassis numbers, and seller phone numbers are **never exposed** on public pages or public APIs.
- **Mediated CRM Pipeline:** Qualified buyer enquiries flow into a dedicated sales pipeline; seller contacts are mediated to prevent spam.

---

## Quick Setup (Under 10 Commands)

Follow these steps to run the complete app and database locally:

```bash
# 1. Clone repository and navigate to folder
cd SellAnyBus.in

# 2. Install dependencies
npm install

# 3. Copy environment configuration
cp .env.example .env

# 4. Start local database daemon (embedded PostgreSQL with PGlite)
node scripts/dev-db.mjs &

# 5. Push Prisma schema to database
npx prisma db push

# 6. Seed demo inventory (30 districts, 24 realistic buses, users, inspections, leads)
npm run seed

# 7. Run automated test suite (Vitest)
npm test

# 8. Start Next.js development server
npm run dev
```

Visit the application at: `http://localhost:3000`

---

## Demo Credentials & Access

### Mobile OTP Login (Buyers & Sellers)
- Enter any 10-digit Indian mobile number (e.g. `9876543220` for Kalinga Travels).
- Development OTP is fixed: **`123456`**.

### Operations & Admin Console (`/admin`)
- **Email:** `admin@sellanybus.in`
- **Password:** `Admin@SellAnyBus2026!`

### Inspector Field Portal (`/inspector`)
- Login with mobile number `9876543211` or `9876543212` with OTP `123456`.

---

## Tech Stack
- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **Database & ORM:** PostgreSQL + Prisma ORM (UUID PKs, committed migrations)
- **Styling:** Tailwind CSS with commercial vehicle palette (`#0B3C8C` Deep Blue, `#F59E0B` Amber, `#16A34A` Green)
- **Auth:** Mobile OTP login with JWT in `httpOnly` secure cookies; Staff bcrypt login
- **Storage:** StorageProvider abstraction (`LocalStorageProvider` in dev, S3/R2 ready)
- **Encryption:** AES-256-GCM for sensitive fields (chassis numbers)
- **Testing:** Vitest (unit & integration tests for RBAC, IDOR, and lifecycle gates)
- **PWA:** Installable PWA with `manifest.json` and service worker offline shell

---

## Documentation
- [DECISIONS.md](docs/DECISIONS.md) — Technical and architectural decisions
- [PRIVACY.md](docs/PRIVACY.md) — Indian DPDP Act compliance, retention, and redaction policies
- [RUNBOOK.md](docs/RUNBOOK.md) — Operations runbook, backups, and disaster recovery
