# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People in Cartagena, Colombia, approaching older age (roughly 50–65) and people aged 65 and over. Family members and caregivers are additional users seeking guidance and support.

## Product Purpose

Autonomía Dorada is a social entrepreneurship initiative for quality of life, active ageing, participation, and autonomy. This web experience helps people and their families find understandable, step-by-step guidance and reliable service channels while the broader initiative connects an interdisciplinary network of services. The user remains an active decision-maker.

## Positioning

“Más que asistencia, es tu autonomía.” The proposal treats older adults as capable people with experience, agency, and potential, and brings health, emotional, social, family, legal, financial, cultural, and digital support into an integral service ecosystem.

## Operating Context

The initiative is based in Cartagena and is framed by the supplied business proposal as part of the silver economy. Its underlying service model includes both individual services and recurring plans, with support for relatives and caregivers. Digital tools support that human service relationship; the web app is one guidance and access channel, not a substitute for clinical, legal, or emergency services.

## Capabilities and Constraints

- Existing implementation: React, Vite, Express, and a seeded SQLite catalogue with a static Vercel catalogue export.
- Current experience includes task search, category filters, step-by-step guides, bookmarks, reading controls, optional narration, source links, and mobile layouts.
- The requested catalogue target is 30 task guides and 30 distinct entities in each existing category, including public services. Only include entities whose legitimacy can be confirmed from the appropriate official registry or official source. Never invent, duplicate, or pad entries to reach a target. If fewer than 30 valid entities exist in a category, show all verified entries and state the available count.
- Guide instructions need source evidence and a review date. A link alone does not prove a process is current. Clearly separate reviewed guidance from entries that are still being researched.
- Do not rank or recommend a particular IPS. For health pathways, direct users to official authorities and explain that their own EPS confirms their network, eligibility, and appointment availability.
- Use an institution's official logo only when its provenance is confirmed; use a neutral category symbol when it is not. Logos identify their owners and do not imply sponsorship.
- Do not collect passwords, authentication codes, financial credentials, or health records. Keep sensitive data on the official institution's own service.
- Do not change the Vercel project URL or deploy until the user explicitly authorizes the planned publication.

## Brand Commitments

- Product name: Autonomía Dorada.
- Slogan: “Más que asistencia, es tu autonomía.”
- The supplied proposal commits to dignity, respect, autonomy, active participation, human accompaniment, and an interdisciplinary approach.
- The user explicitly wants genuine institutional logos where available and has rejected character-like drawings as substitutes for institution marks.

## Evidence on Hand

- The supplied PAT Colectivo business proposal describes the target groups, Cartagena context, silver-economy framing, interdisciplinary service network, family/caregiver support, and digital tools as support for a primarily human service relationship.
- The supplied research-poster template summarizes the Autonomía Dorada value proposition and target population.
- Existing code, catalogue, source records, and official identity assets are present in this repository. The catalogue and each logo's provenance must be checked before reuse or expansion.
- The supplied PDFs contain personal information unrelated to product behavior; do not copy it into this product record or UI.

## Product Principles

1. Preserve the person's agency and let them choose the next step.
2. Explain one task at a time in everyday language.
3. Make the source and limits of every guide understandable.
4. Include families and caregivers without taking control away from the older adult.
5. Treat health, financial, and identity information with care.

## Accessibility & Inclusion

Design mobile-first for older adults and people with varying digital confidence. Use readable adjustable text, large touch targets, clear labels, step-by-step navigation, voluntary narration, and reduced-motion support. Keep the experience usable without audio or vision-dependent cues.
