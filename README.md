# Scientific Writing — Course Companion

A web app for the Honours Student Program *Scientific Writing: Principles and
Practice* course. Students follow the five-class deck at their own pace, write
short in-app practice tasks, ask questions in a per-class discussion, and check
themselves with quizzes built from the deck's own "Quick Check" slides. The
instructor gets a password-protected dashboard showing everyone's progress.

## What's in it

- **Follow along** — every slide from the deck, in order, with next/back
  navigation, arrow-key and swipe support, and a progress bar per class.
- **Quizzes** — 4–5 multiple-choice questions per class, pulled directly from
  the course's own Quick Check / Answer slides.
- **Writing tasks** — one short task per class, grounded in exercises already
  in the deck (rewriting an overloaded sentence, writing a testable hypothesis,
  stating an honest limitation, etc.), with a save button and a short
  self-check checklist afterward.
- **Discussion** — a simple per-class text chat where students can ask
  questions and see each other's (and the instructor's) messages. Updates by
  polling every few seconds — no extra infrastructure required.
- **Accounts** — students sign in with their name and a 4-digit PIN (not a
  real password — just enough to keep each student's own progress separate
  and let them pick up where they left off on another device).
- **Tutor dashboard** (`/tutor`) — password-protected. Shows the roster with
  each student's slides-viewed and quiz scores per class, every writing
  submission (expandable), and a read-only view of each class's chat. Has a
  "Danger zone" to permanently wipe all student data in one type-to-confirm
  action — use it once, right before real students start, to clear out any
  test accounts.

## Project structure

```
app/
  page.js                     Home page — the five classes and progress
  login/page.js                 Student sign in / sign up
  class/[id]/page.js             Slide viewer for one class
  class/[id]/quiz/page.js         Quiz for one class
  class/[id]/write/page.js        Writing task for one class
  class/[id]/chat/page.js         Discussion for one class
  tutor/page.js                  Tutor login
  tutor/dashboard/page.js         Tutor dashboard (server component)
  api/                           All backend routes (auth, state, writing, chat, tutor)
components/                     UI pieces (slide renderer, quiz, chat panel, header)
lib/
  db.js                          Data layer — Postgres in production, in-memory for local dev
  auth.js                        PIN hashing + signed session cookies
  ProgressProvider.js             Client-side auth/progress state, synced to the server
  storage.js                      localStorage cache (instant UX, works offline)
data/
  slides.json                    All 263 slides, extracted from the course PowerPoint
  quizzes.json                    22 quiz questions extracted from the Quick Check slides
  writingTasks.js                 The five writing task prompts
  classes.js                      The five classes' titles, blurbs, and slide ranges
```

## Run it locally

Requires [Node.js](https://nodejs.org) 18 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000. **No database is required for local use** — with
no `DATABASE_URL` set, the app automatically uses an in-memory store so you
can try everything (sign up, chat, writing tasks, the tutor dashboard). That
in-memory data resets whenever the dev server restarts and does **not** work
correctly in production — see the next section before you deploy.

For the tutor dashboard locally, set a password first:

```bash
TUTOR_PASSWORD=your-password npm run dev
```

## Deploy it (GitHub + Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Scientific writing course app"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### 2. Import it on Vercel

Go to https://vercel.com/new, import the repo, and click **Deploy**. Next.js
is auto-detected — no build configuration needed.

### 3. Connect a database (required for accounts, chat, writing tasks, and the dashboard)

The slide viewer and quizzes work immediately without this step, using each
visitor's own browser storage. But accounts, chat, writing submissions, and
the tutor dashboard all need a real shared database — without one, every
serverless request could land on a different empty in-memory store.

1. In your Vercel project, open the **Storage** tab → **Connect Database**.
2. Pick a Postgres provider from the Marketplace (**Neon** is the simplest —
   free tier, one click, no separate account setup). Supabase works too.
3. Connect it to this project. Vercel automatically adds a `DATABASE_URL`
   environment variable and redeploys.
4. The database tables are created automatically the first time the app
   queries them — there's no migration step to run by hand.

If your provider gives you a choice, use the **pooled** connection string
(often the one with `-pooler` in the hostname) — it's built for serverless
functions making many short-lived connections.

### 4. Set two more environment variables

In your Vercel project's **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `SESSION_SECRET` | Any long random string (used to sign student login cookies) |
| `TUTOR_PASSWORD` | Whatever password you want to use to open `/tutor` |

Redeploy after adding these (Vercel will prompt you, or push any commit).

That's it — share the `*.vercel.app` URL with your 15 students, and use
`your-url.vercel.app/tutor` yourself.

## Notes on the content and design choices

- The deck's own "Quick Check → Answer" slide pairs became the quiz
  questions — nothing was invented. Classes 1, 3, and 5 have 4 questions
  each; Classes 2 and 4 have 5.
- The five writing tasks are adapted from exercises already in the deck
  (the "Try It" sentence rewrites, the aim/hypothesis examples, the
  limitation-statement examples) rather than written from scratch.
- Reference tables in the deck (e.g. "IMRAD at a Glance", the self-editing
  checklist) are reproduced as real tables, not screenshots.
- The 4-digit PIN is intentionally lightweight — it stops accidental name
  collisions and casual impersonation, not a determined attacker. Don't
  treat it as a real password, and don't put anything sensitive in the
  writing tasks or chat.
- Chat updates by polling (checking for new messages every 4 seconds)
  rather than a live push connection. At 15 students this is simpler and
  needs no extra infrastructure; messages typically appear within a few
  seconds.
- Progress and quiz scores are cached in the browser's local storage *and*
  synced to the database when a student is logged in, so the app still
  feels instant even on a slow connection, and logging in on a second
  device merges both devices' progress (keeping whichever is further
  along) rather than overwriting one with the other.
