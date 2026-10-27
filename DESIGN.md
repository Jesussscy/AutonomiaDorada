---
name: Autonomía Dorada
description: A calm, task-led public-service index with clear sources and visitor-controlled routes.
colors:
  petroleum: "#153f43"
  teal: "#155d58"
  ivory: "#f4f0df"
  surface: "#fffdf5"
  warm-surface: "#fbf8eb"
  amber: "#bd771e"
  ink: "#1b3838"
  muted-ink: "#526663"
  border: "#d1cbb8"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontWeight: 600
  body:
    fontFamily: "Atkinson Hyperlegible Next, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "6px"
  card: "8px"
  panel: "10px"
spacing:
  control-height: "44px"
  content-max: "1110px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "#fffdf4"
    rounded: "{rounded.control}"
    height: "48px"
  guide-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "18px"
  route-current-marker:
    backgroundColor: "{colors.amber}"
    rounded: "999px"
---

# Design System: Autonomía Dorada

## Overview

**Creative North Star: “El índice de autonomía”**

The interface is a public-service task index for older adults, families and caregivers in Cartagena. It helps a visitor name a task, identify the institution and source, and follow one step at a time while keeping the next decision in their hands. Warm ivory reading surfaces, petroleum ink and a small amber progress signal create a calm, practical civic character.

Atkinson Hyperlegible Next is served locally for readable body copy and controls; Newsreader gives headings an editorial voice. The catalog favors attributed, delineated rows and explicit review labels over promotional imagery. Genuine institutional marks retain their owners' names and do not imply endorsement.

**Key Characteristics:** task-led, readable, source-visible, visitor-controlled, restrained.

## Colors

The palette pairs warm paper and dark green-teal text with a restrained amber route signal; status is always written as well as colored.

### Primary
- **Petroleum** (`#153f43`): masthead and strongest brand field.
- **Service teal** (`#155d58`): primary actions, completed route progress and links.
- **Route amber** (`#bd771e`): current progress stop, focus and small emphasis; never the sole status cue.

### Neutral
- **Warm ivory** (`#f4f0df`): page canvas.
- **Reading surface** (`#fffdf5`): guide steps and content panels.
- **Warm source surface** (`#fbf8eb`): source links and quiet highlighted areas.
- **Deep ink** (`#1b3838`): primary text.
- **Muted ink** (`#526663`): supporting text.
- **Warm border** (`#d1cbb8`): separators and panel outlines.

## Typography

Use the locally served font files in `public/fonts/`. Body text, controls and labels use Atkinson Hyperlegible Next. Newsreader is the display face for page and guide headings. Preserve comfortable line spacing and the adjustable text scale; do not replace these with the unrelated legacy font stacks earlier in the stylesheet.

## Layout

The desktop content is centered with a maximum width near 1110px. The catalog uses a readable index with task, responsible institution, review state and source attribution visible in each entry. Guide detail presents the route progress spine alongside preparation/source context and the current instruction. At widths below 760px, layouts become a single column, controls wrap, and category navigation scrolls within its own region. At 420px and below, the masthead controls arrange in compact rows and the search action may occupy its own row. Keep the page free of horizontal overflow at narrow widths and enlarged text.

## Elevation & Depth

Use mostly flat surfaces, borders and tonal contrast. Reserve soft shadows for overlays and important panels; catalog entries should read as an index rather than floating promotional cards. Avoid decorative gradients and heavy layered depth.

## Shapes

Controls use compact 6px corners; index entries use restrained 7–9px corners and larger panels use about 10px. Prefer clear borders, generous internal spacing and large touch targets (at least 44px high). Avoid pill shapes except compact count/status markers where they aid scanning.

## Components

- **Masthead:** petroleum field with the product mark and persistent reading, text-size, settings and help controls.
- **Search and shortcuts:** lead with “¿Qué quieres hacer hoy?”, a prominent search field and a small set of task shortcuts.
- **Catalog entry:** identify task and institution, show review status in text and retain source attribution. Do not turn entries into generic marketing cards.
- **Route progress:** connect steps with a visible spine; distinguish current and completed stops with both shape/color and text.
- **Source link:** keep the responsible publisher and destination recognizable before leaving the app.
- **Settings and help panels:** brief, readable, keyboard reachable, with user-controlled narration and clear limits.
- **Motion:** panel opening uses the short `index-open` transition and the shared easing curve. Honor `prefers-reduced-motion` by removing animation and transitions.

## Do's and Don'ts

- Do name the task, institution, review state and official source.
- Do keep the guide text available when narration is offered and describe available voices honestly.
- Do use official marks only with documented provenance; the provenance table is in `public/brands/README.md`.
- Do not imply that a linked page proves the guide's steps are current.
- Do not recommend a particular IPS or imply provider availability; the user's EPS confirms its network and appointments.
- Do not invent, duplicate or pad catalog entries to meet a target. Current read-only catalog evidence is 34 verified and 40 pending overall; category counts vary and are documented by the catalog.
- Do not use amber or any color alone to communicate status, or request credentials and health records.
