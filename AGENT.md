# AGENT.md — Codebase Guide

## 1. PROJECT OVERVIEW

Personal portfolio for John Eduard De Villa, full-stack developer. Deployed to Vercel at `https://joed-portfolio.vercel.app`.

**Stack:** React 19 + Vite 8, Tailwind CSS 3, GSAP + ScrollTrigger, cmdk. No backend — static site.

**Dependencies (from `package.json`):**

| Package | Version | Purpose |
|---|---|---|
| `react` / `react-dom` | ^19.2.6 | UI framework |
| `gsap` | ^3.15.0 | Animation engine |
| `@gsap/react` | ^2.1.2 | GSAP React integration |
| `cmdk` | ^1.1.1 | Command palette (⌘K) |
| `playwright` | ^1.62.1 | Screenshot asset generation only — no test suite |
| `tailwindcss` | ^3.4.19 | Utility CSS |
| `vite` | ^8.0.12 | Build tool |
| `eslint` | ^10.3.0 | Linting |

No test framework is installed. No CI/CD pipeline exists. Deploys are manual.

---

## 2. ARCHITECTURE NOTES

### Content: `src/data/content.js`

Single source of truth for all copy. Exports: `personal`, `stats`, `skillGroups`, `projects`, `certifications`, `timeline`. Never hardcode or duplicate text in components — pull from here.

### Animations: `src/lib/animations.js`

One exported function, `initAnimations()`, wraps everything in a single `gsap.context()` on `document.body`. GSAP is code-split via dynamic `import()` in `App.jsx`, loaded during `requestIdleCallback` (200ms fallback) — it never touches the critical path.

**Inside the context, in order:**

1. **Functional scroll UI (always active, even under reduced motion):**
   - `[data-scroll-progress]` → `scaleX` from scroll progress
   - `[data-back-to-top]` → opacity/y toggle after 0.8× viewport height
   - `[data-nav]` → background/blur after 40px scroll
   - `[data-hero-arrow]` → opacity fade after 0.85× viewport height

2. **Reduced-motion gate:** `if (prefersReducedMotion()) return` — everything below is skipped under `prefers-reduced-motion: reduce`.

3. **`attachSweep(section, triggerVars)`:** Helper that appends a `.sweep-divider` beam to a section and fires a one-shot scaleX sweep on `onEnter`. Wraps the `scrollTrigger` config of every section reveal.

4. **`revealSection(id, opts)`:** Generic section reveal — selects `.section-label, .section-heading, [data-reveal]`, animates `opacity: 0, y → 1, y: 0` with stagger.

5. **Hero counters:** `data-hero-count` elements animated with `gsap.to` on a state object + `snap`.

6. **About section:** Custom timeline with `.about-top-glow`, `.skill-card-content` cards, and `.skill-pill` cascade.

7. **Contact section:** Uses `revealSection` with `y: -20` (downward settling).

8. **Projects stacked-card:** Pins `#projects-pin-wrap` (desktop only, `>= 768px`). Card 0 is anchor; cards 1..N animate from `opacity: 0` to `opacity: 1, y: -overlapPx * i` where `overlapPx = firstCardHeight * 0.75`. `getPinDistance` is a function: `() => (featuredCards.length - 1) * window.innerHeight`.

9. **Timeline horizontal scroll:** Pins `#experience` on desktop. `getDistance` is a function: `() => Math.max(0, inner.scrollWidth - track.clientWidth)`. Both `end` and the `x` target use this same function. Heading reveal is a separate ScrollTrigger (not part of the scrub timeline) to avoid hijacking pin range. Mobile (`< 768px`) falls back to native horizontal scroll with a one-shot line/dot reveal.

10. **Certifications:** Lighter version of the card entrance pattern, `start: 'top 80%'`.

Returns a cleanup function that calls `responsiveMedia.revert()` and `ctx.revert()`.

### JSON-LD: Build-Time Injection

`vite.config.js` defines a plugin (`structuredDataPlugin`) using the `transformIndexHtml` hook. It calls `buildStructuredData()` from `src/data/structuredData.js`, which:
- Reads `index.html` at build time via `readFileSync` to extract `<meta>` tag values (`og:url`, `description`)
- Imports `personal` from `content.js` for name, title, email, social links
- Returns a `@graph` with `Person` and `WebSite` schema.org types

**Do NOT hand-edit JSON-LD into `index.html`.** Schema changes go in `structuredData.js`. Data changes go in `content.js` or `index.html` meta tags. The Vite plugin handles injection.

### Component Tree

```
ThemeProvider → PaletteProvider
  ├── ScrollProgress
  ├── BackgroundLayer
  ├── Cursor
  ├── Navbar
  ├── main
  │   ├── Hero
  │   ├── TechMarquee
  │   ├── About (includes Skills)
  │   ├── Projects (includes CommandPalette via portal)
  │   ├── Timeline
  │   ├── Certifications
  │   └── Contact
  ├── Footer
  └── BackToTop
```

Section dividers: `<div className="section-stopper" aria-hidden="true" />`.

---

## 3. HARD CONSTRAINTS

Non-negotiable. These have broken the site before.

1. **Animate ONLY `transform`/`opacity`/`scale`.** Never animate `width`, `height`, `top`, `left`, `margin`, `padding`, or any layout-triggering property. Zero CLS — verify on every change.

2. **`prefers-reduced-motion` must be respected by every animation.** The pattern: check `prefersReducedMotion()` early, skip decorative triggers. New animations must follow this — gate on the same check or use GSAP `matchMedia`. Never bypass.

3. **`pin: true` pin distance must match animation distance, derived from the same DOM measurement, computed as functions.** Both the `end` value and the animation target (`x` or equivalent) must be arrow functions calling the same measurement (e.g., `inner.scrollWidth - track.clientWidth`). Never capture a value once in a `const` outside the ScrollTrigger config.

4. **Before shipping `pin: true`, verify at 100%, 90%, and 80% browser zoom.** Confirm the computed `end` matches `scrollWidth - clientWidth` at each level. If it doesn't, fall back to sticky-wrapper + `rAF` scroll-progress instead of patching the pin math.

5. **Keep GSAP off the critical path.** Already code-split via dynamic `import()` in `App.jsx`. New animation libraries must follow the same pattern.

6. **No new dependencies without clear justification.** Check `package.json` first. Prefer extending `src/lib/` over adding packages.

---

## 4. KNOWN-FRAGILE AREAS

### Timeline (`src/components/Timeline.jsx` + timeline block in `animations.js`)

Rebuilt multiple times due to pin/scroll-lock bugs (dead scroll zones, card cropping, zoom-level drift). Current implementation: heading reveal is a separate ScrollTrigger from the scrub timeline; desktop pins `#experience` and translates `.timeline-track-inner` horizontally by `getDistance()` (function). Mobile uses native scroll.

Read the current state in `animations.js` before touching. Any change here is high-risk.

### Projects (`src/components/Projects.jsx` + projects block in `animations.js`)

Stacked-card scroll reveal: pins `#projects-pin-wrap`, animates `.project-card--featured` cards upward with ~75% overlap. Mobile (`< 768px`) falls back to normal list.

**Known issues:** Numbered indicator may overlap during stacked animation; section heading is inside the pin wrapper and may disappear during scroll; filter switching while pinned may cause visual glitches.

### Command Palette (`src/components/CommandPalette.jsx`)

Uses `cmdk` with `createPortal` to `document.body`. Has `trapTab` handler preventing Tab escape. Must remain keyboard-accessible — check arrow keys, Escape, Tab trapping on any change.

---

## 5. VERIFICATION EXPECTATIONS

No automated test suite. The project owner verifies manually.

**For scroll/animation changes, check:**
- Desktop 100% zoom: sections reveal, pins don't cause dead scroll, timeline scrolls smoothly
- Desktop 90% and 80% zoom: pin distances still match, no stuck/overshooting scroll
- Reduced motion toggle: all decorative animations skipped, functional UI (progress bar, back-to-top, navbar) still works
- Mobile (< 768px): timeline native scroll, projects stacked-card disabled, command palette opens/closes

**For accessibility-adjacent changes:**
- This project has previously fixed real WCAG contrast violations in both light and dark themes. Don't introduce new low-contrast text/background combinations without checking computed contrast ratios.

**For content changes:**
- All text from `content.js`, no hardcoded strings
- Metadata changes reflected in `index.html` meta tags (structured data rebuilds automatically)

---

## 6. WHAT NOT TO DO

- Don't reintroduce `pin: true` with a hardcoded or estimated `end` distance.
- Don't add automated testing frameworks or scripts unless explicitly asked.
- Don't touch the custom cursor (`Cursor.jsx`), idle-gesture system, hero background effects (`BackgroundLayer.jsx`), or theme toggle (`ThemeTransition.jsx` / `useTheme`) unless the task specifically concerns them — these are stable and working.
- Don't duplicate content that already exists in `content.js`.
