# Run Documentation — claude-workshop

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20+ | https://nodejs.org |
| Python | 3.11+ | https://python.org |
| npm | 10+ | bundled with Node |

---

## 1. Environment Setup

Copy `.env.example` to the correct locations and fill in your values:

```powershell
Copy-Item .env.example frontend\.env.local
Copy-Item .env.example services\api\.env
Copy-Item .env.example services\mcp\.env
```

---

## 2. Run Each Service

### Frontend (Next.js)
```powershell
cd frontend
npm install
npm run dev
# Available at http://localhost:3000
```

### Python API (FastAPI)
```powershell
cd services\api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Available at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

### MCP Server
```powershell
cd services\mcp
npm install
npm run dev
# Registered with Claude Code via .claude/mcp.json
```

---

## 3. Run All Services Together (Recommended)

```powershell
npm install -g concurrently
concurrently `
  "cd frontend && npm run dev" `
  "cd services/api && .venv/Scripts/activate && uvicorn main:app --reload --port 8000" `
  "cd services/mcp && npm run dev"
```

---

## 4. Database Setup (Supabase)

1. Create a project at https://supabase.com
2. Open the SQL editor and run `supabase/migrations/001_initial.sql`
3. Copy your project URL and keys into your `.env` files

---

## 5. Deployment (Free Tier)

| Service | Platform | Command |
|---|---|---|
| Frontend | Vercel | `npx vercel --prod` from `frontend/` |
| Python API | Railway | Push `services/api/` as a Railway service |
| Database | Supabase Cloud | Already hosted |
