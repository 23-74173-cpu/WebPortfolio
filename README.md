# John Eduard De Villa — Portfolio

Full-stack developer portfolio built with React 19, Vite 8, and Tailwind CSS 3.

> From EHR schema design to IoT sensor pipelines — production systems for real clients.

## Tech Stack

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS 3 + CSS Custom Properties (dark/light mode)
- **Typography:** DM Serif Display (headings), Inter (body), JetBrains Mono (code)
- **Deployment:** Vercel (with security headers via `vercel.json`)
- **Design Reference:** Linear-inspired dark-canvas system with signal-blue accent

## Sections

- **Hero** — Systems shipped / sprints left stats
- **About** — Background, education, and workflow
- **Skills** — 7 domain groups (Languages, Frontend, Backend, Database, Infrastructure, Analytics, AI-Assisted)
- **Projects** — 8 featured projects with images, tech stacks, and impact metrics
- **Certifications** — Microsoft IT Specialist & Cisco Networking Academy
- **Contact** — Email, social links, résumé download

## Getting Started

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview production build
npm run lint       # ESLint check
```

## Live Demo

Deployed at: [https://joed-portfolio.vercel.app](https://joed-portfolio.vercel.app)

## Project Structure

```
src/
├── assets/           # Project placeholder images (SVG)
├── components/       # 12 React components
├── context/          # ThemeContext
├── data/             # Single content source (content.js)
├── hooks/            # useInView, useTheme
├── App.jsx           # Root layout
├── main.jsx          # Entry point
└── index.css         # Tailwind + CSS custom properties
```

## License

MIT
