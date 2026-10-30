# Second Prof Atlas — MBBS Phase II learning platform

Open-source study site for MBBS 2nd-year students: Pathology, Microbiology, Pharmacology,
Community Medicine and Forensic Medicine & Toxicology. 66 chapters with concepts, 107 interactive flowcharts (41 with every step explained and an offline exam pack:
related questions + short/medium/long model answers),
a Notes & Books PDF reader with subject- and page-wise bookmarks,
offline model answers (Simplify / Short / Medium / Long) for exam topics — being added subject by subject,
levelled question banks (100 flashcards + 100 MCQs per chapter, Basic → Exam-pattern) with spaced repetition,
an adaptive quiz ladder and a mistakes bank, tap-to-explain key terms,
an exam radar from past-paper priorities, flashcards, an MCQ bank, mock tests, a study planner and
ten AI tools (tutor, simplifier, question generator, summaries, flashcards, mock tests,
personalised coaching, voice tutor, planner, doubt resolution).

```
index.html      the whole site (HTML + CSS + JS in one file)
api/ai.js       AI proxy: keeps your Anthropic API key on the server, streams answers
vercel.json     security headers
docs/           reference PDFs shown in Notes & Books (seniors' priority lists, class notes)
src/            editable source (content per subject, app.js, style.css) — run `python3 build.py` to regenerate index.html
```

## Deploy free on Vercel (about 10 minutes)

1. **Create a GitHub repository** (public is fine — the key is never in the code).
   Go to github.com → New repository → name it `second-prof-atlas` → upload the three items
   in this folder (`index.html`, `vercel.json`, and the `api` folder with `ai.js`).
2. **Import into Vercel.** Go to vercel.com → sign in with GitHub → *Add New → Project* →
   pick the repository → *Deploy*. Framework preset: **Other**. No build command.
3. **Add your AI key.** Get a key at console.anthropic.com (add billing credit).
   In Vercel: *Project → Settings → Environment Variables*:
   - `ANTHROPIC_API_KEY` = your key  **(required)**
   - `ANTHROPIC_MODEL` = `claude-haiku-5-5` (cheaper) or leave empty for `claude-sonnet-5-5`
   - `ALLOWED_ORIGIN` = your site address, e.g. `https://second-prof-atlas.vercel.app`
   - `RATE_PER_MIN` = `12` (requests per minute per student)
4. **Redeploy** (*Deployments → ⋯ → Redeploy*) so the key is picked up.
5. Open the site. The badge at the top should say **● AI tutor connected**.
   Share the link (e.g. `https://second-prof-atlas.vercel.app`) with learners — no login needed.

Optional: *Settings → Domains* to attach your own domain (e.g. `atlas.yourcollege.in`).

## Without AI (zero cost)

Upload only `index.html` to **GitHub Pages** (repo → Settings → Pages → Deploy from branch)
or **Netlify Drop** (drag the folder onto app.netlify.com/drop). Everything works except the AI
tools, which show a friendly "not switched on" message.

## Notes & Books

- `docs/` PDFs are public reference documents shown to every student.
- Copyrighted books (M for Microbiology, Patho Main File, Prof Buster Paper 1 & 2) are **not** in this repo.
  Each student adds their own PDF in the Library; it is stored only in that browser (IndexedDB) and never uploaded.
- Bookmarks (page, subject, chapter, note) are saved in the student's browser.
- "Explain this page with AI" sends an image of the current page to the AI backend.

## Costs and safety

- Every AI request is billed to the API key owner. Set a monthly spend limit in the
  Anthropic Console (*Settings → Limits*) before sharing widely.
- `RATE_PER_MIN` and `ALLOWED_ORIGIN` reduce abuse; for large batches of students consider adding
  a simple sign-in (e.g. Vercel password protection or Cloudflare Access).
- Student progress (XP, streaks, scores, plans) is stored only in each student's browser.
- Voice input uses the browser's speech recognition (best in Chrome on Android/desktop over HTTPS).

## Content note

Star ratings for Pathology, Microbiology and Pharmacology come from seniors' past-paper priority
lists; topics tagged **NMC** were added from the NMC CBME Phase II competency list.
Community Medicine and FMT priorities are standard high-yield estimates. Section numbers follow
BNS/BNSS/BSA (in force from 1 July 2024) with old IPC/CrPC/IEA numbers. Always confirm the current
exam blueprint with your department.

Licence: MIT for the code. Educational content may be reused with attribution.
