# HomeFix 🛠️
> **Home repairs, solved in 15 minutes.**  
> *Fixing Homes, Improving Lives.*

[![Live Website](https://img.shields.io/badge/Production-Live-emerald?style=flat-square&logo=vercel)](https://homefix-official.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Security Hardened](https://img.shields.io/badge/Security-Hardened-purple?style=flat-square&logo=shield)](https://github.com/OmkarKhot21/HomeFix)

---

## 📖 Executive Overview

**HomeFix** is an on-demand, app-first hyperlocal home maintenance platform operating across the Mumbai Metropolitan Region (MMR) — including **Thane, Mumbai, and Navi Mumbai**. 

Traditional home service discovery in urban India suffers from fragmented local vendors, unpredictable surge pricing, delayed response times (hours/days), lack of verified trust, and absent warranties. HomeFix transforms urban maintenance into a quick-commerce experience:
- **15-Minute Guaranteed Dispatch SLA**: Auto-matched nearby police-verified technicians.
- **Upfront Standardized Rate Cards**: Base inspections starting at ₹199 with transparent pricing.
- **30-Day Workmanship Warranty**: Guaranteed after-service protection.
- **Real-Time Technician Tracking**: Live ETA and technician dispatch verification.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16** (App Router, Server Actions) | Server-rendered pages, edge routing, and streaming UI |
| **Language** | **TypeScript 5.x** | End-to-end type safety |
| **Validation** | **Zod 4.x** | Strict runtime schema parsing and sanitization for all inputs |
| **Styling** | **Tailwind CSS v4 + Lucide Icons** | Ultra-responsive monochrome design system with micro-interactions |
| **Auth & Sessions** | **JOSE (JSON Web Encryption/Signatures)** | Pure-JS, edge-compatible HS256 stateless session tokens |
| **Security Layer** | **Node.js Crypto + Custom Rate Limiter** | Constant-time comparisons, sliding-window rate limiting, and HTTP security headers |
| **Cloud Runtime** | **Vercel Serverless Edge** | Global CDN distribution, automated SSL, and instant regional routing |

---

## 🛡️ Security & Hardening Architecture

HomeFix implements multi-layer defense-in-depth across the entire request lifecycle:

1. **Defense-in-Depth Authorization (`requireAdmin`)**:
   - Edge route interception via `proxy.ts` (convenience redirect).
   - Independent server-side authentication boundary via `requireAdmin()` on every admin page and `verifyAdminApi()` on API routes.
2. **Algorithm Pinning & Secret Enforcement**:
   - Enforced `HS256` pinning on `jwtVerify` to prevent algorithm confusion attacks.
   - Zero hardcoded fallback secrets: production strictly throws a fatal configuration error if `SESSION_SECRET` or `ADMIN_PASSWORD` is unconfigured.
3. **Open-Redirect Protection**:
   - Login flow preserves the requested destination URL (`?next=...`) with strict validation: only paths starting with `/admin` and strictly lacking protocol-relative characters (`//` or `\`) are accepted.
4. **Brute-Force & Denial-of-Service Defense**:
   - In-memory sliding window rate limiter (`lib/rateLimit.ts`): enforces a 5-attempt lockout per 15 minutes for `/admin/login` and a 10-submission limit per 5 minutes for lead capture.
5. **Runtime Input Validation**:
   - Centralized Zod schemas (`lib/validations.ts`) validate every email, phone number, and credential payload before database execution.
6. **Side-Channel Timing Attack Defense**:
   - Credentials checked via `crypto.timingSafeEqual` over SHA-256 digests.
7. **Spreadsheet Formula Injection Defense (CWE-1236)**:
   - CSV export sanitization neutralizes leading whitespace and execution command operators (`=`, `+`, `-`, `@`, `|`, `%`).
8. **Serverless Filesystem Resilience**:
   - Fault-tolerant database abstraction automatically detects read-only cloud lambdas and redirects file writes to `/tmp/leads.json` to eliminate serverless `EROFS` crashes.
9. **Enterprise HTTP Headers (`next.config.ts`)**:
   - `Content-Security-Policy`, `X-Frame-Options: DENY` (Anti-Clickjacking), `X-Content-Type-Options: nosniff`, `Strict-Transport-Security` (HSTS), and `Permissions-Policy`.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v24.x`
- **npm**: `v10.x` or higher

### 1. Clone Repository
```bash
git clone https://github.com/OmkarKhot21/HomeFix.git
cd HomeFix
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the project root:
```env
# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
SESSION_SECRET=your_32_character_high_entropy_jwt_secret_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛠️ Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with hot-reloading |
| `npm run build` | Compiles production Next.js webpack build |
| `npm run start` | Starts compiled production server locally |
| `npm run typecheck` | Runs strict TypeScript compiler check (`tsc --noEmit`) |
| `npm run lint` | Runs Next.js ESLint static code analysis |
| `npm test` | Runs unified test suite (`typecheck` + `lint`) |

---

## 🗺️ Production Roadmap

- [ ] **Database Migration**: Transition to PostgreSQL via **Supabase** / **Neon** with Prisma ORM.
- [ ] **Dual-Persona Portal**: Customer booking portal vs. Verified Partner field dispatch dashboard.
- [ ] **Real-Time GPS Tracking**: Google Maps Directions API with animated technician route beacons.
- [ ] **Payment Gateway**: Integration of **Razorpay** (UPI Instant, Cards) with automated escrow release and Cash-on-Service.
- [ ] **Automated WhatsApp Notifications**: Instant booking alerts, technician ETA, and digital invoices.
- [ ] **Continuous Integration (CI)**: GitHub Actions workflow executing lint, typecheck, and build on every push.

---

## 📄 License & Attribution

© 2026 HomeFix Technologies Pvt. Ltd. All rights reserved.  
*Crafted for high-density urban living in Mumbai Metropolitan Region.*
