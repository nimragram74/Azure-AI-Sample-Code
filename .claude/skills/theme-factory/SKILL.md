---
name: theme-factory
description: Generates a cohesive colour theme for the Anthropic COE Portal and applies it to anthropic-coe/public/config/site.xml, then regenerates the standalone HTML. Use when the user wants to re-theme, re-skin, re-brand, or change the colours/palette of the COE portal (e.g. "make the portal Wipro-blue", "give it a dark midnight theme", "theme it like <brand>").
argument-hint: [brand or vibe, e.g. "Wipro corporate blue" or "dark midnight neon"]
allowed-tools: Read, Edit, Bash(cd:*), Bash(node:*)
---

# Theme Factory — COE Portal

Generate and apply a complete, accessible colour theme for the Wipro Anthropic
COE Portal based on the user's requested brand or vibe: **$ARGUMENTS**

## The 7 theme tokens (in `anthropic-coe/public/config/site.xml` → `<theme>`)

| Token | Role | Constraints |
|-------|------|-------------|
| `primary` | Main brand colour — buttons, links, accents, hero gradient start | Vivid; must be readable as a text colour on cream/paper |
| `primaryDark` | Hover/active + small text on light bg | A darker shade of `primary`; ≥ 4.5:1 contrast on `paper` |
| `ink` | Near-black for headings, dark sections, navbar logo, footer bg | Very dark, slightly tinted is fine |
| `cream` | Soft section background (alternating bands) | Light, low-chroma; clearly distinct from `paper` |
| `paper` | Page background | Lightest colour; near-white |
| `accent` | Secondary colour — gradient end, pills, "outcome" chips, step focus | Distinct hue from `primary`; works as text on `accentSoft` |
| `accentSoft` | Tinted background behind `accent` text | Very light tint of `accent` |

## Steps

1. **Read** the current theme so you know the baseline:
   Read `anthropic-coe/public/config/site.xml` and locate the `<theme>` block.

2. **Design the palette** from "$ARGUMENTS". Produce all 7 hex values and make sure:
   - `paper` is lightest, then `cream`, then everything else; `ink` is darkest.
   - `primaryDark` is a clearly darker `primary` and passes ~4.5:1 contrast on `paper` (it is used for small text).
   - `primary` and `accent` are visibly different hues so gradients and pills read well.
   - `accentSoft` is a pale tint of `accent`; white text must be legible on `primary` and `accent` (buttons/badges use white text).
   If the user named a brand, match its known brand colours; if they gave a vibe, interpret it tastefully.

3. **Apply** the values by editing the seven elements inside `<theme>…</theme>` in
   `anthropic-coe/public/config/site.xml`. Only change the hex values, nothing else.

4. **Regenerate** the offline single-file build so it reflects the new theme:
   ```bash
   cd anthropic-coe && node standalone/build-standalone.mjs
   ```

5. **Report** the result: list each token with its hex and a one-line rationale,
   and note that the theme is applied at runtime via CSS variables (so the dev
   app `npm run dev` updates too). Mention any contrast trade-offs you made.

## Notes
- Do NOT touch React/CSS files — the whole point is that theming is data-driven
  through `site.xml`. Changing those seven hex values re-skins the entire portal.
- Keep edits minimal and surgical so the diff is easy to review.
