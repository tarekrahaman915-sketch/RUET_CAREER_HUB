# RUET Carrier HUB

A full-stack platform connecting students, alumni, faculty, recruiters, and admins across **all RUET
departments** — job/internship portal, research hub, mentorship, events, resource library, auto-generated
CVs, and admin moderation, backed by a real **Node/Express + MongoDB** API.

## Project layout

```
RUET_Carrier_Hub_Website/
├── src/            ← React + Vite frontend (this folder)
├── server/         ← Node/Express + MongoDB backend
└── .env.example    ← frontend env (copy to .env)
```

## Running it

You need **two terminals** — one for the API, one for the frontend — plus a MongoDB instance (local
`mongod`, or a free MongoDB Atlas cluster).

**1. Backend**
```bash
cd server
npm install
cp .env.example .env     # then fill in MONGODB_URI and JWT_SECRET
npm run seed             # creates the first Admin account (see below)
npm run dev              # starts the API on http://localhost:5000
```

**2. Frontend** (from the project root)
```bash
npm install
cp .env.example .env      # defaults to http://localhost:5000/api, adjust if needed
npm run dev               # http://localhost:5173
```

> **I couldn't test-run this myself** — my sandbox has no network access, so I can't `npm install` real
> packages or connect to a real MongoDB instance. Every file passed a syntax check (`node --check` on the
> backend, `esbuild` on the frontend), a full bundle check from each entry point with zero errors, and I
> manually cross-referenced every frontend API call against the actual backend routes to catch typos — but
> you're the first one to actually run this end-to-end. If something doesn't work, it's most likely a small
> wiring issue, not a fundamentally broken design.

### Seeding the first Admin account

Admin isn't a self-registerable role (real admins shouldn't be able to sign themselves up). Run `npm run
seed` in `server/` to create one — defaults to `admin@ruet.ac.bd` / `admin12345` unless you set
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars first. **Change this password** by updating it directly
in the database until a real admin-settings UI exists.

## How accounts work now

- **Real authentication** — bcrypt-hashed passwords, JWTs, all stored in MongoDB. Login no longer has a
  role dropdown (that was a mock-auth artifact) — your role comes from your account.
- **Admin approval required** — every new Student/Alumni/Faculty/Recruiter registration starts as
  `PendingApproval` and can't sign in until an Admin approves them on the Users page. This is real now, not
  illustrative sample data.
- **Forgot password** — generates a real, time-limited (1 hour) reset token stored in MongoDB. There's no
  email service wired up yet, so the token is shown directly in the UI instead of emailed (clearly labeled
  as a dev-only shortcut in `routes/auth.routes.js` — replace with a real email provider before deploying
  this for real users).

## What's new in v4 (real data + cleanup)

- **Real faculty** (24 teachers, Dept. of ETE) copied from ete.ruet.ac.bd: name, designation, official email, photo, profile link. Full bios, education, research areas and publications (with links) for Dr. Md. Kamal Hosain and Dr. Md. Munjure Mowla; the other teachers link to their official profile for the complete list. Data lives in `src/data/ruetFaculty.json` and `ruetFacultyDetails.json`; add more teachers by extending the details file.
- **Real students**: the 58 ETE students from your sheet appear in People as *unclaimed* profiles (name, department, batch only). Parents' names, phone numbers, religion and gender were NOT imported. Roster is `src/data/eteRoster.json`.
- **Jobs / Companies**: 16 real employers and public bodies, each opening its own careers/recruitment page (plus BDJobs). **Study Abroad**: real programmes with current deadlines (Chevening 6 Oct 2026, DAAD doctoral 21 Oct 2026) or typical windows where dates aren't published yet.
- **Career paths** (students only): photo on every path (from Wikipedia), detailed step-by-step guideline, roadmap, and real resources. **My career plan** in the student dashboard is built around the path the student chose; it also shows on their public profile.
- **Resources** page: real courses/docs/tools for every career path, filterable.
- Removed: career path / roadmap / mentor-contact items for Alumni, Faculty and Recruiter; the duplicate dark-mode toggle in dashboards; the "Five roles. One board." home section.

If choosing a career path says "saved on this device only", restart the API (`npm run dev` in `server/`) so the new `/api/profile/career-path` route is loaded.

## What's new in v3

- **Modal bug fixed** (the clipped scholarship "Details" dialog): `Modal` now renders through a portal on
  `<body>`, so it always sits above the sticky navbar; page scroll is locked behind it; the title/close
  button stay pinned while the content scrolls.
- **Profile picture at sign-up** — the Create profile form has a photo picker with live preview
  (`POST /api/auth/register` now accepts multipart with an optional `picture`). Pictures can be changed
  later under *Public profile* in each dashboard.
- **Signed-in navbar** — shows your avatar and email, with a menu (Dashboard, public profile,
  publications, career path, Messages with an unread badge, Sign out). Session state lives in
  `src/context/AuthContext.jsx`.
- **People directory** — every card shows the profile picture, portfolio links (GitHub / LinkedIn /
  website), a Message button and Email (email only for signed-in members). Each person has a full public
  profile at `/people/:id`.
- **Publications** — add papers/theses with a link under *Publications* in the Student, Alumni and Faculty
  dashboards; links are clickable on the public profile. Only `http(s)` links are stored.
- **Alumni mentorship** — `/mentors` lists alumni mentors; students (any signed-in member) can message them
  or request a session. Conversations live in `/messages` (`DirectMessage` model, `/api/messages`).
- **Career paths** (`/careers`, `/careers/:id`) — nine paths with details (roles ladder, skills, tools,
  employers) and a "Choose this path" button; the choice shows on your public profile.
- **Learning roadmaps** (`/roadmaps`, or the *Learning roadmap* tab of a path) — phased steps you can tick
  off; progress is saved to your account (or in the browser if you're not signed in).
  Edit content in `src/data/careerPaths.js`.

After pulling this update run `npm run seed:reset` in `server/` if you want the demo accounts to have
bios, publications and career paths. Restart the API so the new `/api/messages` route loads.

> Tested here against a mock API (no MongoDB in my sandbox): the frontend builds cleanly and every new page
> was checked in a real browser. The new backend routes pass a syntax check but have not run against a
> live database.

## What's new in this round

- **Profile picture + auto-generated CV** — students upload a photo (`/student/documents`); a professional
  PDF resume is generated on the fly from their live profile data (name, department, education, skills,
  projects, certifications, links, and photo) via `server/src/utils/generateCV.js` (using `pdfkit`).
  Recruiters can download this same generated CV — or the student's manually uploaded one — for anyone who
  applies to their postings, right from the Applicants page.
- **Resource Library uploads** — Faculty and Admins can upload real files (notes, past papers, etc.) via
  `/api/resources`; the public library merges these with a few illustrative sample entries.
- **Account approval workflow** — see above. Admin's Users page shows a real `Pending` queue with
  Approve/Reject actions.
- **Public People Directory** (`/people`) — browse approved Students/Alumni/Faculty by category and
  department.
- **Student "Department" page** (`/student/department`) — shows fellow students and faculty in your own
  department, pulled from the People Directory data.
- **Circular RUET logo** — `src/assets/ruet-logo-circle.png` is your uploaded seal, cropped into a true
  circle with a transparent background (see `components/common/Logo.jsx`).
- **Richer Events, Research, and Company Directory** — events now carry a venue and description; the
  Company Directory shows a jobs-vs-internships breakdown per company from live posting data.

## Latest changes: redesign, Study Abroad, demo data

- **New home page** — rewritten hero copy (English and Bangla), a rotating image panel, a quick search bar
  (jobs / study abroad / events), a Study Abroad band, a "Latest on the board" feed (circulars, jobs, events)
  and live statistics. Fonts are Hind Siliguri (text, Latin + Bangla) and Plus Jakarta Sans (headings),
  loaded from Google Fonts in `index.html`. Heading weight is one variable, `--fw-head`, at the top of `src/index.css`.
- **Hero photos** — three real RUET photos from Wikimedia Commons (CC BY-SA 4.0: entrance gate, campus road,
  Architecture building) load at the size the screen needs (`srcset`), with a credit line under the image. If
  one can't load, an illustration takes its place. To use your own photos instead, drop `hero-1.jpg` …
  `hero-4.jpg` into `src/assets/hero/` (see the README there); those win over the Wikimedia ones.
- **Sample data for every public page** — `src/data/sampleData.js` holds jobs, events, resources, companies,
  people, project showcase, research labs, professors and publications. Pages show it when the server is off
  or empty and switch to live data automatically. `npm run seed` writes the same data into MongoDB (jobs,
  events, resources with placeholder files, companies' recruiters, people, projects). Labs, professors and
  publications stay front-end sample data. All names, companies and papers are fictional.
- **Study Abroad** (`/study-abroad`) — searchable scholarship board with country / level / funding filters,
  a details popup, and posting for Faculty, Alumni and Admin. Students can save scholarships and track them
  (Saved → Preparing → Applied → Shortlisted → Awarded) at `/student/study-abroad`.
- **Circulars** (`/circulars`) — public list of faculty notices.
- **Demo data** — `npm run seed` (in `server/`) now creates the admin plus demo accounts, jobs, internships,
  events, circulars, research openings, mentors, success stories, projects, scholarships and a few
  applications. Re-running is safe; `npm run seed:reset` wipes the demo content first.
  Demo password for every non-admin account: `demo12345`.
  The login page shows one-click demo buttons when running `npm run dev`.
- If the API is unreachable, the home and Study Abroad pages fall back to bundled sample content so they
  never look empty. Programme names and links are real; deadlines are generated relative to today and are
  illustrative, so confirm everything on the official site.

## Architecture

- **`src/services/apiClient.js`** — the only place that talks to `fetch`. Every page/context calls
  `api.get/post/patch/delete/upload(...)`. `downloadAuthenticatedFile()` handles PDF downloads specially,
  since plain `<a href>` links can't carry the `Authorization` header a protected download needs.
- **Contexts (`src/context/*Context.jsx`)** now fetch from and write to the real API instead of
  `localStorage`. The old `src/store/*` "shared localStorage store" hack from the pre-backend version has
  been deleted entirely — MongoDB is the real shared datastore now.
- **`server/src/routes/*.routes.js`** — one file per domain (auth, students, alumni, company, faculty,
  jobs, events, projects, mentors, admin, profile, resources, people). Role-gating is layered:
  `requireAuth` (valid token) → `requireActive` (not pending/suspended) → `requireRole(...)`.
- **File uploads** (`server/src/middleware/upload.js`) save to `server/uploads/`, served statically at
  `/uploads/...`. Not S3/cloud storage — fine for development, swap out before any real deployment.

## Known gaps / honesty notes

- **No real email service** — password reset and any future "you've been approved" notifications need one
  (Resend, SES, etc.) before this is production-ready.
- **AI Tools are still heuristic**, not a real model — see the comment block in `src/services/aiService.js`.
- **Homepage statistics** (placement rate, average salary) and **Research Labs/Professors/Publications**
  remain illustrative sample data — only the Project Showcase tab is real.
- **Admin's Reports/Verification-queue/Messages** are separate from account approval and still mostly
  illustrative — there's no UI yet for someone to actually *file* a report or a verification request.
- Not built yet: Career Roadmap tool, standalone Resume/Cover Letter Builder UI (the generated CV covers
  some of this), Interview Prep with a leaderboard, and the Community discussion forum.
