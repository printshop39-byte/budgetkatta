# BudgetKatta 💰

Bilingual (मराठी + हिंदी) fintech information platform — FD rates, loans, SIP, and insurance with interactive calculators, a compare drawer, an interactive 3D AI guide bot, and n8n lead automation.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Zustand · Spline**.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional for local dev — see below)
cp .env.example .env.local

# 3. Run the dev server
npm run dev
```

Open **http://localhost:3000**.

The app runs fully **without any env vars**: rates come from `lib/data.ts` (illustrative sample data), the chatbot returns a placeholder reply, the desktop bot shows an animated fallback robot, and leads are logged to the console instead of being sent to n8n.

Other scripts: `npm run build` (production build), `npm run start` (serve the build), `npm run lint`.

---

## Environment configuration

Copy `.env.example` → `.env.local` and fill in only what you need. All values are optional for local development.

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | client | n8n lead-capture webhook |
| `NEXT_PUBLIC_SPLINE_SCENE_URL` | client | Spline 3D robot scene for the desktop bot |
| `GEMINI_API_KEY` | server (secret) | Google Gemini chatbot (falls back to rule-based) |
| `MONGODB_URI` | server (secret) | MongoDB Atlas connection (falls back to demo data) |
| `N8N_WEBHOOK_URL` | server (secret) | Webhook used by `/api/leads` (preferred) |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | client | Vapi voice assistant (falls back to "coming soon") |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | client | Vapi assistant id |
| `NEXT_PUBLIC_ENABLE_ADMIN` | client | `true` enables the `/admin` overview page |
| `NEXT_PUBLIC_APP_URL` | client | Public base URL of the app |

> `NEXT_PUBLIC_*` values are exposed to the browser — never put secrets there. `GEMINI_API_KEY`, `MONGODB_URI`, and `N8N_WEBHOOK_URL` stay server-side only.

After editing `.env.local`, restart `npm run dev` so Next.js picks up the changes.

---

## Adding a Spline 3D scene

The desktop bot ([`components/bot/Floating3DGuide.tsx`](components/bot/Floating3DGuide.tsx)) renders an interactive Spline robot, lazy-loaded on the client only (`dynamic`, `ssr: false`) so mobile and initial page load stay light. Mobile shows a compact avatar card and never loads the Spline runtime.

1. Create / open a scene in [Spline](https://spline.design).
2. **Export → Code → React**, and copy the `scene` URL (looks like `https://prod.spline.design/XXXXXXXX/scene.splinecode`).
3. Put it in `.env.local`:
   ```env
   NEXT_PUBLIC_SPLINE_SCENE_URL=https://prod.spline.design/XXXXXXXX/scene.splinecode
   ```
4. Restart the dev server.

If the variable is unset, the bot shows a **premium animated fallback robot** — no Spline runtime is loaded.

---

## Seeding the database (MongoDB)

The site reads products through [`lib/repository.ts`](lib/repository.ts), which:
1. returns demo data if `MONGODB_URI` is missing,
2. returns DB data if MongoDB is reachable **and** non-empty,
3. falls back to demo data if a collection is empty or the DB errors.

So as soon as you seed, the site serves DB data automatically.

```bash
# 1. Put your connection string in .env.local
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/budgetkatta

# 2. Load the demo data into MongoDB (clears + re-inserts each collection)
npm run seed
```

The seed script is [`scripts/seed.ts`](scripts/seed.ts) (run via `tsx`). Read APIs report their source — `{"ok":true,"source":"mongodb"|"demo","count":N,"data":[...]}` — at `/api/fd`, `/api/loans`, `/api/sip`, `/api/insurance` (or `/api/rates?module=…`).

---

## n8n lead automation

Every **"I am interested"** button opens a bilingual lead form ([`components/lead/LeadFormModal.tsx`](components/lead/LeadFormModal.tsx)) collecting **name, mobile, city, module, selected product, language**. On submit it POSTs to the server route [`app/api/leads/route.ts`](app/api/leads/route.ts), which **persists to MongoDB** (if configured) and **forwards to n8n**. The UI never blocks: on a well-formed submit it always shows the success message.

1. In n8n, add a **Webhook** trigger node (POST) and copy its production URL.
2. Set it in `.env.local` (prefer the server-side var):
   ```env
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/budgetkatta-leads
   ```
   `NEXT_PUBLIC_N8N_WEBHOOK_URL` also works and is used by lightweight client events (bot quick actions).
3. Build downstream nodes (Google Sheets append, CRM contact, WhatsApp/email follow-up, Slack/Telegram alert).

If no webhook is set, leads are **logged to the console** and never throw.

---

## Gemini chatbot

The bot calls [`app/api/chat/route.ts`](app/api/chat/route.ts) → [`lib/gemini.ts`](lib/gemini.ts). With `GEMINI_API_KEY` set it uses **gemini-1.5-flash** with a finance-only system prompt (FD, loans, SIP/mutual funds, insurance only), replies in the **selected site language**, and appends a disclaimer to any guidance. Without the key it uses a **rule-based fallback** with the same constraints.

```env
GEMINI_API_KEY=your_key_here
```

No code changes needed — set the key and restart.

## Vapi voice assistant (placeholder)

[`lib/vapi.ts`](lib/vapi.ts) is architecture-ready. The bot's 🎤 button shows a bilingual "coming soon" message until `NEXT_PUBLIC_VAPI_PUBLIC_KEY` is set; once set, it calls `startVoiceCall()`. To ship real voice: `npm install @vapi-ai/web`, set the Vapi keys, and implement the body of `startVoiceCall()` (real code is sketched in comments).

## Admin overview (placeholder)

Set `NEXT_PUBLIC_ENABLE_ADMIN=true` and visit [`/admin`](app/admin/page.tsx) for count cards (FD, loans, SIP, insurance, leads) with a `mongodb`/`demo` source badge. No CRUD UI yet — structural placeholder only. When disabled, the page shows a locked notice and the leads-count endpoint returns 403.

---

## Project layout

| Path | Purpose |
|---|---|
| `app/` | Pages (`/`, `/fds`, `/loans`, `/sip`, `/insurance`, `/admin`) + API routes (`/api/{fd,loans,sip,insurance,rates,leads,chat}`). `/fd` redirects to `/fds`. |
| `components/` | Layout, home, shared UI, calculators, compare drawer, bot, lead form, trust |
| `lib/` | `i18n`, `calculators`, `data` (demo), `repository` (DB+fallback), `useRemoteData`, `leadAutomation`, `gemini`, `vapi`, `mongodb` |
| `store/` | Zustand stores — language (persisted), compare items, lead form |
| `models/` | Mongoose schemas (used once `MONGODB_URI` is set) |
| `scripts/` | `seed.ts` — load demo data into MongoDB (`npm run seed`) |
| `types/` | Shared TypeScript interfaces |

---

## Deploying to Vercel

1. **Push to GitHub.** `.gitignore` already excludes `.env`, `.env.local`, `.next`, and `node_modules`, so no secrets or build output are committed.
2. **Import the repo** at [vercel.com/new](https://vercel.com/new). Vercel auto-detects Next.js — no build settings needed (`npm run build` / output handled automatically).
3. **Add environment variables** (Project → Settings → Environment Variables) from [`.env.example`](.env.example). All are optional, but for production you'll typically set:
   - `MONGODB_URI`, `N8N_WEBHOOK_URL`, `GEMINI_API_KEY` (secrets)
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com` (drives canonical/OG URLs, sitemap, robots)
   - optionally `NEXT_PUBLIC_SPLINE_SCENE_URL`, Vapi keys, `NEXT_PUBLIC_ENABLE_ADMIN`
4. **Seed the database** once: with `MONGODB_URI` in your local `.env.local`, run `npm run seed`.
5. **Deploy.** After the first deploy, set your custom domain and re-set `NEXT_PUBLIC_APP_URL` to it.

> Note: the rate limiter ([`lib/rateLimit.ts`](lib/rateLimit.ts)) is in-memory and per-instance. It's fine for a single small deployment; for scaled/serverless traffic, move it to a shared store (e.g. Upstash Redis) behind the same interface.

## Production checklist

- [ ] `npm run build` passes with no TypeScript errors
- [ ] `.env` / `.env.local` are **not** committed (verify `git status`)
- [ ] `NEXT_PUBLIC_APP_URL` set to the real domain (canonical, OG, sitemap, robots)
- [ ] `MONGODB_URI` set and `npm run seed` run → read APIs report `source: "mongodb"`
- [ ] `N8N_WEBHOOK_URL` set and a test lead reaches the n8n workflow
- [ ] `GEMINI_API_KEY` set (or accept the rule-based fallback)
- [ ] `NEXT_PUBLIC_ENABLE_ADMIN` left unset/false in production unless `/admin` is intended
- [ ] Spline scene set, or the animated fallback accepted
- [ ] Lighthouse mobile pass; bilingual switch, calculators, compare, and bot verified
- [ ] `/robots.txt` and `/sitemap.xml` resolve and reference the right domain

---

## Disclaimer

All rates and figures in `lib/data.ts` are illustrative samples for demonstration only — **not live financial data**. Verify with the relevant institution before making any financial decision.
