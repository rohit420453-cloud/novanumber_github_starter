# NovaNumber — GitHub Starter

This repository contains:
- `public/index.html`: existing marketplace UI prototype
- `public/payments.html`: existing payment/admin UI prototype
- `src/server.js`: Express API starter with health check
- `src/db.js`: PostgreSQL connection pool
- `.env.example`: names of required environment variables

## Important status

This is a **starter/demo**, not a live payment marketplace. Authentication, database migrations,
wallet ledger, payment-provider verification, Telegram callbacks and real number-provider
integration are not implemented yet. The deposit endpoint deliberately returns HTTP 501.
The UI uses sample/demo data and its approval buttons do not move money.

## Local development

Requires Node.js 20 or later and a PostgreSQL database.

```bash
npm install
cp .env.example .env
# Set DATABASE_URL and DATABASE_SSL in .env
npm run dev
```

Health check: `http://localhost:3000/api/health`

The current server only exposes the API and does not serve `public/`; preview the HTML files
directly or use a static host for the UI. The Vercel configuration deploys the static pages.
Deploy the Express API separately as a Render Web Service with `npm start`.

## GitHub safety

- Never commit `.env`, API tokens, passwords, payment secrets or database credentials.
- A Telegram bot token previously shared publicly should be revoked in BotFather and replaced.
- Set secrets in Render's Environment dashboard, not in frontend code.
- Do not approve deposits based solely on a user-submitted UTR or screenshot. Verify through
  trusted payment-provider/merchant records.
- Do not enable live wallet credits until authentication, idempotency, authorization and audit
  logging are implemented and tested.

## Deploy overview

### Render API
- Create a managed PostgreSQL database.
- Create a Web Service from this repository.
- Build command: `npm install`
- Start command: `npm start`
- Set `DATABASE_URL`, `DATABASE_SSL=true`, and `FRONTEND_ORIGIN` in Render environment variables.

### Vercel frontend
For the cleanest deployment, import the repository into Vercel and use the included
`vercel.json` for static UI. Configure the frontend to call the Render API only after the
API integration is implemented. Set the Render `FRONTEND_ORIGIN` to the deployed Vercel origin.

## Next implementation steps
1. Add SQL schema and migrations.
2. Implement registration, email verification and secure sessions.
3. Add user-owned deposit records and a double-entry/ledger wallet.
4. Integrate a legitimate payment provider and verify signed webhooks.
5. Add server-side admin roles and audited approve/reject actions.
6. Add Telegram bot notifications/callbacks using a newly rotated token in environment variables.
7. Integrate an authorized virtual-number provider and test demo/live mode separation.
