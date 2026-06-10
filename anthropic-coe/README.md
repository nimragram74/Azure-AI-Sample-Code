# Anthropic COE Portal · Wipro

A delightful, single-page **React** application for the **Anthropic Center of
Excellence (COE)** at Wipro. It brings the whole Claude practice together in one
place — guided **training paths**, stackable **certifications**, the **latest
updates & feeds**, the COE's **best-practices playbook for Claude**, and a clear
view of **how Wipro helps customers** with Claude.

The visual language blends Anthropic's warm clay-and-cream palette with a clean,
professional, BMS-inspired layout (generous whitespace, soft cards, gradient
accents, and reveal-on-scroll motion).

## ✨ Highlights

- **React 18 + Vite** — fast, modern build with a component-per-section design.
- **Bootstrap 5** grid & utilities + **Bootstrap Icons**, with a bespoke design
  system layered on top for delight (animations, gradients, hover states).
- **Everything is configured in XML.** All copy, links, branding, theme colours,
  navigation, training catalogue, certifications, feeds, best practices and
  customer offerings live in `public/config/*.xml`. Edit the XML — no React
  changes needed.
- **Runtime theming** — the colour palette is read from `site.xml` and injected
  as CSS custom properties at load time.
- Responsive, accessible (reduced-motion aware), and graceful loading/error
  states for every section.

## 🗂️ Configurable content (XML)

| File | Drives |
| --- | --- |
| `public/config/site.xml` | Branding, theme colours, navigation, hero, capabilities, footer |
| `public/config/training.xml` | Learning tracks & courses (with links) |
| `public/config/certifications.xml` | Certification milestones & criteria |
| `public/config/updates.xml` | Latest updates / filterable feeds |
| `public/config/bestpractices.xml` | Best-practices playbook (tabbed by category) |
| `public/config/offerings.xml` | Customer solutions, engagement model, contact |

Want to add a course, a new certification, or re-theme the portal? Just edit the
relevant XML file and refresh — the UI updates itself.

## 🚀 Getting started

```bash
cd anthropic-coe
npm install
npm run dev        # http://localhost:5173
```

### Production build

```bash
npm run build      # outputs to dist/ (config XML is copied automatically)
npm run preview    # serve the built app locally
```

The build uses a relative `base`, so `dist/` can be hosted from any static
host or sub-path (e.g. GitHub Pages).

## 🧱 Architecture

```
anthropic-coe/
├── index.html
├── public/
│   ├── favicon.svg
│   └── config/            # ← all editable content (XML)
└── src/
    ├── main.jsx           # entry: React + Bootstrap CSS
    ├── App.jsx            # loads site.xml, applies theme, lays out sections
    ├── index.css          # design system / animations
    ├── hooks/useXmlConfig.js   # load + parse an XML file → {data,loading,error}
    ├── utils/xml.js            # tiny DOMParser helpers
    └── components/
        ├── common.jsx     # Loader, SectionHeader, reveal/scroll hooks
        ├── NavBar.jsx  Hero.jsx  Features.jsx
        ├── Training.jsx  Certifications.jsx  Updates.jsx
        ├── BestPractices.jsx  Offerings.jsx  Footer.jsx
```

Each content section fetches its own XML config at runtime via `useXmlConfig`,
keeping the data layer fully decoupled from presentation.

---

© 2026 Wipro Limited. *Anthropic*, *Claude* and related marks are property of
Anthropic, PBC. Built by the Wipro Anthropic COE.
