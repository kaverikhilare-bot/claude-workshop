# CLAUDE.md — claude-workshop

## Project Overview

**Project:** claude-workshop
**Purpose:** Landing page similar to Amazon — product listings, customer capture, cart, and checkout flows.
**Stage:** Proof of Concept (POC) — low-budget, lean stack.

---

## Stack

### Core
| Layer | Technology |
|---|---|
| Frontend | TypeScript + Next.js (App Router) |
| Backend API | Python (FastAPI) |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Styling | Tailwind CSS |

### Additional (POC-grade, low-cost)
| Purpose | Technology | Why |
|---|---|---|
| Task queue | Redis (Upstash free tier) | Async jobs without infra cost |
| Email capture | Resend (free tier) | Customer onboarding emails |
| Payments (stub) | Stripe test mode | Safe POC checkout flow |
| Deployment | Vercel (frontend) + Railway (Python API) | Free tiers, zero-ops |
| MCP runtime | Claude Code MCP server (local) | Skills + tool orchestration |
| Load balancing | Vercel Edge (frontend) + Railway autoscale (API) | Built-in, no extra cost |

---

## Repository Structure

```
claude-workshop/
│
├── CLAUDE.md                    # ← this file
│
├── services/                    # All backend services — one folder per service
│   ├── api/                     # Python FastAPI service
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── products.py
│   │   │   ├── customers.py
│   │   │   └── orders.py
│   │   ├── models/
│   │   ├── tests/
│   │   └── requirements.txt
│   │
│   └── mcp/                     # MCP service — all MCP tools in one folder
│       ├── server.ts            # MCP server entry point
│       ├── tools/               # Individual MCP tool modules
│       │   ├── customer-tool.ts
│       │   ├── product-tool.ts
│       │   └── order-tool.ts
│       ├── skills/              # Skill definitions loaded by MCP server
│       │   ├── capture-customer.md
│       │   ├── search-products.md
│       │   └── process-order.md
│       └── package.json
│
├── frontend/                    # Next.js TypeScript frontend
│   ├── app/
│   │   ├── page.tsx             # Landing page (Amazon-style)
│   │   ├── products/
│   │   ├── cart/
│   │   └── checkout/
│   ├── components/
│   ├── lib/
│   │   └── supabase.ts
│   └── package.json
│
├── supabase/                    # Supabase migrations and seed data
│   ├── migrations/
│   └── seed.sql
│
└── docs/                        # Auto-generated documentation
    ├── run.md                   # How to run each module
    └── test.md                  # How to test each module
```

---

## Modules as Services

### 1. `services/api` — Python FastAPI
Handles all business logic: products, customers, orders.
- Connects to Supabase via `supabase-py`.
- **Customer data collection:** every visitor/signup is captured in the `customers` table (see schema below).
- Exposes `/health`, `/products`, `/customers`, `/orders`.

### 2. `services/mcp` — MCP All-in-One Service
Single MCP server exposing all tools and skills.
- All MCP tools live in `services/mcp/tools/`.
- All skill definitions live in `services/mcp/skills/`.
- Register this server in `.claude/mcp.json` to activate in Claude Code.

### 3. `frontend` — Next.js TypeScript
Amazon-style landing page:
- Hero banner, product grid, search bar, cart drawer, checkout page.
- Calls `services/api` for data.
- Uses Supabase Auth for customer login/signup.

---

## Customer Data — IMPORTANT

All customer information must be captured and persisted. Minimum required fields:

```sql
-- supabase/migrations/001_customers.sql
create table customers (
  id           uuid primary key default gen_random_uuid(),
  email        text unique not null,
  full_name    text,
  phone        text,
  address      jsonb,
  created_at   timestamptz default now(),
  last_seen_at timestamptz,
  source       text          -- e.g. 'landing_page', 'checkout', 'newsletter'
);
```

Capture points:
1. Newsletter signup on landing page.
2. Account creation at checkout.
3. Guest checkout (email + shipping address).
4. MCP `capture-customer` skill triggered on any new lead event.

---

## Style Rules

- **Tone:** Formal — suitable for office/professional context. No slang, contractions minimised in UI copy.
- **UI:** Clean, structured, Amazon-inspired layout. Priority: clarity over decoration.
- **Code style:** Strict TypeScript (`strict: true`). Python with type hints (Pydantic models). No `any`.
- **MCP / Skills:** All MCP tools and skills are co-located in `services/mcp/` — no scattered tool files.
- **Testing:** Unit tests required for every service module. Load balancing configured at deploy level (see Run docs).

---

## Key Commands

### Run

> Full documentation: [`docs/run.md`](docs/run.md) — auto-generated on first run.

**Frontend**
```bash
cd frontend && npm install && npm run dev
# Runs on http://localhost:3000
```

**Python API**
```bash
cd services/api
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Runs on http://localhost:8000
```

**MCP Server**
```bash
cd services/mcp && npm install && npm run dev
# Registers tools with Claude Code MCP runtime
```

**All services (recommended for POC)**
```bash
# Use a process manager — install concurrently at root
npm install -g concurrently
concurrently "cd frontend && npm run dev" "cd services/api && uvicorn main:app --reload" "cd services/mcp && npm run dev"
```

### Test

> Full documentation: [`docs/test.md`](docs/test.md) — auto-generated on first test run.

**Frontend unit tests**
```bash
cd frontend && npm run test        # Vitest
cd frontend && npm run test:e2e    # Playwright (golden path + edge cases)
```

**Python API unit tests**
```bash
cd services/api && pytest tests/ -v --cov
```

**MCP tools**
```bash
cd services/mcp && npm run test    # Vitest
```

**Load test (POC)**
```bash
# k6 — free, runs locally
k6 run tests/load/landing-page.js
# Target: 100 virtual users, 30s ramp
```

---

## Load Balancing Strategy (POC)

| Layer | Method |
|---|---|
| Frontend | Vercel Edge Network — automatic, global CDN |
| API | Railway autoscale (min 1, max 3 replicas on free tier) |
| Database | Supabase connection pooling via PgBouncer (built-in) |
| Local dev | Round-robin via `concurrently` — single instance is fine for POC |

---

## MCP Configuration

Add to `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "claude-workshop": {
      "command": "node",
      "args": ["services/mcp/server.js"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_ANON_KEY": "${SUPABASE_ANON_KEY}"
      }
    }
  }
}
```

---

## Environment Variables

Create `.env.local` in `frontend/` and `.env` in `services/api/`:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
REDIS_URL=
API_BASE_URL=http://localhost:8000
```

---

## Important Notes

1. **Customer data is mandatory** — every touchpoint must write to the `customers` table. No anonymous sessions should leave without an email capture attempt.
2. **POC budget** — prefer free tiers (Vercel, Railway, Supabase, Upstash, Resend). Escalate only when a bottleneck is proven.
3. **MCP is the integration layer** — business automation, AI-assisted workflows, and skill execution all route through `services/mcp/`. Do not add MCP tooling outside this folder.
4. **Unit tests are not optional** — every new function in `services/api` and `services/mcp` needs a corresponding test. CI will block merges without coverage.
5. **Documentation is auto-generated** — after scaffolding a module, run `/run` or `/test` slash commands to regenerate `docs/run.md` and `docs/test.md`.
