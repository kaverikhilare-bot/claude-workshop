# Test Documentation — claude-workshop

## 1. Python API — Unit Tests

```powershell
cd services\api
.venv\Scripts\activate
pytest tests\ -v --cov=. --cov-report=term-missing
```

Coverage target: **80% minimum** on routers and models.

---

## 2. Frontend — Unit Tests

```powershell
cd frontend
npm run test
```

Uses **Vitest**. Test files live alongside components as `*.test.tsx`.

---

## 3. Frontend — End-to-End Tests

```powershell
cd frontend
npx playwright install  # first time only
npm run test:e2e
```

Golden path covered:
- [ ] Landing page loads
- [ ] Product grid renders
- [ ] Newsletter form submits and shows confirmation
- [ ] Cart add/remove
- [ ] Checkout flow completes

---

## 4. MCP Tools — Unit Tests

```powershell
cd services\mcp
npm run test
```

---

## 5. Load Test

Requires [k6](https://k6.io/docs/get-started/installation/) installed.

```powershell
# Against local frontend
k6 run tests\load\landing-page.js

# Against a deployed URL
k6 run -e BASE_URL=https://your-vercel-url.vercel.app tests\load\landing-page.js
```

Thresholds enforced:
- 95th percentile response time < 500ms
- Error rate < 1%

---

## 6. CI Strategy

Add a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs:
1. `pytest` on the API
2. `vitest` on the frontend
3. `vitest` on the MCP service

Load tests run manually or on a schedule — not on every PR (too slow for POC).
