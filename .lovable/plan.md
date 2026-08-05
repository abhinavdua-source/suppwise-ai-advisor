# WiseMent — AI Supplement & Fitness Advisor (mobile prototype)

A polished, front-end-only mobile app built to match the six supplied Stitch screens, plus a Profile & Premium tab. All data is realistic demo data held in memory — no login, no backend. The AI Advisor is a scripted conversation that reproduces the designed follow-up questions and the analysis report.

## Design system

Ported exactly from the supplied HTML:
- Palette: near-black primary, off-white background (#f7f9fb), layered surface greys, emerald secondary (#006c49 / #6cf8bb), blue tertiary accents (#3980f4 / #d8e2ff), soft red for errors.
- Type: Inter for display/headline/body, JetBrains Mono for uppercase micro-labels. Same size/weight scale (display 48, headline 32/28/24, body 18/16, label-caps 12).
- Material Symbols Outlined icon font, loaded via a link tag in the root route.
- Rounded cards (xl radius), subtle shadows, 20px mobile gutters, generous vertical rhythm.
- Fixed translucent blurred top bar with the WiseMent logo (hotlinked), and a fixed 5-tab bottom nav.

## Screens

1. **Home** — greeting, daily habits 4-up grid with completion pill, search bar with mic button, "Optimization Goals" 2-column cards (Sleep, Muscle, Fat, Energy, Recovery, Focus, Blood Test Review), current stack summary, energy trend, trending research list.
2. **AI Advisor** — empty state with suggested prompts, then a chat thread. Sending a message triggers a scripted assistant turn: diagnostic follow-up questions as tappable chips, an "Analyzing input..." state, then a link into the report. Medical disclaimer footer.
3. **AI Report** — analysis summary, ranked primary drivers with confidence levels, targeted protocol supplement cards (star evidence rating, match %, dosage, timing, "Add to Stack"). Each card links to an Evidence detail sheet with study count, consensus, plain-language explanation and reference links.
4. **My Stack** — interaction-check banner, routine-grouped supplement cards (dose, schedule, days remaining, cost), reminder toggles, synergy analysis, add-custom-supplement sheet.
5. **Progress** — 30-day overview with energy/sleep/recovery charts and trend deltas, daily metric logging (mood, energy, workout quality, sleep, symptoms), body metrics.
6. **Blood Test / Biomarkers** — upload card (mock), biomarker breakdown cards with status, explanation, and whether supplementation is advised; consultation CTA. Reached from the Home "Blood Test Review" card.
7. **Profile & Premium** (new, styled to match) — personal info, goals, diet, medical conditions, medications, allergies, budget, notification settings, and a premium upgrade card listing the subscription features.

Navigation between all tabs and detail screens is wired end to end, so the journey from asking a question → follow-ups → report → add to stack → progress works.

## Technical notes

- TanStack Start file routes: `/` (Home), `/advisor`, `/advisor/report`, `/evidence/$id`, `/stack`, `/progress`, `/bloodwork`, `/profile`. Bottom nav is a shared layout component.
- Design tokens go into `src/styles.css` as oklch semantic variables mapped in `@theme inline`; components use semantic classes only.
- Demo data lives in typed modules under `src/data/`; interactive state (habits ticked, stack additions, logged metrics, chat messages) is React state, resetting on reload as agreed.
- Per-route `head()` metadata with WiseMent-specific titles and descriptions.
- Images from the designs are hotlinked; no image generation needed.
