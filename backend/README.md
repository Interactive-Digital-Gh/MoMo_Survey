# MoMo Survey — Backend

Fastify + PostgreSQL API for the MTN MoMo survey campaign. Sized for a ~500-user
activation running alongside other apps on the shared ID-Server.

## Endpoints

| Method | Path                | Auth        | Purpose                                   |
|--------|---------------------|-------------|-------------------------------------------|
| GET    | `/api/health`       | –           | Liveness + DB check                       |
| POST   | `/api/responses`    | – (public)  | Submit a completed survey (idempotent)    |
| GET    | `/api/responses`    | Bearer JWT  | List all responses (dashboard)            |
| POST   | `/api/auth/login`   | –           | Admin login → JWT                         |

- **Idempotency:** each submission carries a client-generated `submission_id`;
  `INSERT ... ON CONFLICT DO NOTHING` makes retries safe (no duplicate entries).
- **Rate limits:** global 100/min per IP; submit 20/min; login 10/min.
- **Body limit:** 16 KB. **CORS:** off in prod (same-origin behind nginx).

## Entry policy

Default = **unlimited entries per phone** (deduped only by `submission_id`).
To enforce **one entry per phone**, set `ONE_ENTRY_PER_PHONE=true` — a partial
unique index is created and duplicate phones get a `409`.

## Local development

Requires a local Postgres. Create the DB/role once:

```sql
CREATE ROLE momo_survey LOGIN PASSWORD 'momo_local_dev';
CREATE DATABASE momo_survey OWNER momo_survey;
```

```bash
cp .env.example .env      # already provided for local dev
npm install
npm run dev               # http://127.0.0.1:3001
```

The frontend (Vite, port 5180) proxies `/api` here automatically.

## Production deploy (ID-Server)

1. **Postgres:** create a dedicated DB + role (as above) with a strong password.
2. **Code:** put repo at `/opt/momo-survey`; `cd backend && npm ci --omit=dev`.
3. **Config:** `cp .env.example .env` and fill real `DATABASE_URL`,
   `ADMIN_PASSWORD`, and a long random `JWT_SECRET`. Leave `CORS_ORIGINS` empty.
4. **Frontend:** `cd ../frontend && npm ci && npm run build` → serves from `dist/`.
5. **Service:** install `deploy/momo-survey-api.service`, then
   `systemctl enable --now momo-survey-api` (schema is created on first boot).
6. **nginx:** add the `limit_req_zone` line to `http{}`, install
   `deploy/nginx-momo-survey.conf`, set the domain + TLS cert, `nginx -t`, reload.

The systemd unit is sandboxed and CPU/memory-capped so the campaign stays
isolated from the other production apps on the box.

## Notes

- If a submission fails (network/server), the frontend stashes it in the
  browser's `localStorage` (`momo_pending_entries`) so nothing is lost.
- Phone numbers are PII — keep the DB access restricted, rotate the admin
  password/JWT secret, and define a retention/deletion plan after the draw.
