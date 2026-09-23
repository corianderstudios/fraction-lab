# FractionLab

A React + Vite app that teaches how fractions work: basics, adding, subtracting, multiplying and dividing. Each lesson has an explanation, worked examples, a playground and clickable memory tips. A games section asks up to ten adaptive questions per skill.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest + React Testing Library + jest-dom
npm run build      # static site in dist/
npm run preview    # serve the production build locally
```

Node 18.18 or newer.

## Hosting

The build is a plain static folder (`dist/`). It uses hash routing (`#/learn/add`) and a relative base path, so it works on any static host, in any sub-folder, with no rewrite rules.

- **GitHub Pages:** push to `main`. `.github/workflows/deploy.yml` runs the tests, builds, and deploys. (Enable Pages → Source: GitHub Actions in the repo settings.)
- **Netlify / Cloudflare Pages:** build command `npm run build`, publish directory `dist`. Security headers come from `public/_headers`.
- **Vercel:** import the repo; `vercel.json` adds the security headers.
- **Anywhere else:** upload the contents of `dist/`.

## How it's organised

```
src/
  lib/          fraction math + step explanations, sanitizing, adaptive question generator, router, storage
  data/         sections list and lesson content (edit text here)
  context/      theme (light default / dark) and progress (visited, completed, best scores)
  components/   NavBar, Breadcrumb, Tip, FractionInput, Playground, Game, ScoreTracker…
  pages/        Home, Lesson, Games, Game, NotFound
```

Lesson copy and tips live in `src/data/lessons.js`. Examples are worked out automatically from the fraction library, so adding an example is one line.

## Behaviour

- **Layout:** from 768px wide, examples and playground sit on the left and the explanation on the right. The page body stays still and each column scrolls on its own (`overflow-y: auto`, never hidden). On phones the columns stack and the page scrolls.
- **Active section:** the nav outlines only the section you're viewing; the outline moves when you click another section.
- **Progress:** opening a section doesn't change its status. The "Mark as in progress" button (at the bottom of each section) adds a soft highlight at 50% opacity in the nav; select it again to clear it. "Mark section complete" replaces the highlight with a check mark beside the title in the nav and page heading. Progress is saved in `localStorage`.
- **Games:** start at level 1 of 5. A right answer makes the next question one level harder; a wrong answer makes it one level easier. Ten questions per game. Equivalent answers are accepted. Scores use calm green and warm sand, never red.
- **Themes:** light (warm off-white) is the default; dark uses deep indigo slate, not black. Text contrast is at least 4.5:1 in both.

## Accessibility

- Everything works by keyboard: Tab between fields, Enter to check an answer, Enter again for the next question, Escape to close tips and the mobile menu.
- Skip link, landmarks, breadcrumb with `aria-current`, focus moved to the page heading on navigation.
- Fractions are read aloud as "3 over 4"; bar models have text descriptions; answers, errors and progress changes are announced through live regions.
- Visible focus rings; reduced-motion preference respected.

## Security

- Every typed field is a whole-number box. Input is normalised and reduced to digits only (max 4) on every keystroke and paste, then parsed again before use (`src/lib/sanitize.js`).
- The URL hash is treated as input: only known routes are accepted.
- Saved progress is validated on load; anything unexpected is dropped.
- React escapes all output and the app never uses `dangerouslySetInnerHTML`.
- The production build includes a Content-Security-Policy meta tag; `_headers` / `vercel.json` add CSP, `frame-ancestors`, `nosniff` and related headers.
