# Security audit (self-review, not a penetration test)
| Area | Status |
|---|---|
| Input validation (zod, server-side), length caps, 10 KB body limit | Done, unit + live tested |
| CSRF: Origin must match host on POST | Done, live tested (403 cross-origin / no origin) |
| Honeypot, rate limit (5 / 10 min / IP), duplicate detection after successful save | Done, tested. Rate limit is in-memory: **per instance only** |
| Output encoding: React escapes; JSON-LD escapes `<` | Done |
| Security headers (nosniff, frame DENY, referrer, HSTS, permissions) | Done; **no CSP yet** |
| Secrets in repo | Scan clean; `.env.local` and `data/inquiries.jsonl` are gitignored |
| Admin/auth/uploads | **Not built**; no public admin routes exist |
| Dependencies | Prod: 0 vulns. Dev tooling: 8 moderate (minimatch), not shipped |
| Inquiry data at rest | Plain JSONL (VPS) or your webhook. Needs a retention/privacy decision |
Findings fixed during build: duplicate marker was set before save (fake success after failure); fixed and tested.
