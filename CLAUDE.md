# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page project for **Iridia.tech** — a young Italian tech company (founders under 30) that builds custom apps and AI solutions for Italian SMEs. Iridia is the technical team behind the **elevIA** platform. The chosen concept is "Builder Silenziosi" (Silent Builders): builder identity, not consultants.

## Architecture

### Main Landing Page

`IridiaLanding.jsx` — A single self-contained React component (JSX) that renders the entire Iridia.tech landing page. No build system or package.json exists in this repo; the component is designed to be dropped into an external React project.

Key patterns in the component:
- **Color palette** defined as a `C` object at the top, extracted from the Iridia logo (navy/indigo/blue tones)
- **Inline styles** used throughout (not CSS modules or styled-components) with Tailwind CSS utility classes for layout
- **`useFadeIn` custom hook** + `FadeSection` wrapper for scroll-triggered fade-in animations via IntersectionObserver
- **Flip-card interaction** in the Problems section (CSS 3D transforms with `perspective` and `rotateY`)
- **Section components**: Hero, WhatWeDo, Problems, Process, Approach, Market, Team, FAQ, CTAFinal, Footer — rendered sequentially in the default export `IridiaLanding`
- Font: Plus Jakarta Sans / Inter (loaded externally)
- Dark mode by default, all content in Italian

### Supporting Materials

- `brainstorm/01-brainstorm.md` — Structured brainstorming session (divergence/challenge/synthesis) that produced the landing page concept
- `LAIC_016/` — Marketing and strategy documents for the LAIC/elevIA ecosystem (value proposition, personas, tone of voice, ebook content, partner prototype HTML). The `partner_prototype.html` is a full standalone HTML page demonstrating a white-label partner site
- `laic_lead_magnet/` — Ebook PDF generation. `generate_template.py` uses Python's `reportlab` library to generate a branded PDF ebook template. Run with: `python generate_template.py` (requires `reportlab` package)

## Brand & Copy Guidelines

- Language: Italian only (no bilingual content)
- Tone: professional-informal, direct, zero buzzwords ("trasformazione digitale", "sinergia", "paradigma" are banned)
- Address the reader with informal "tu"
- Talk about real problems, not technology jargon
- Contact email: info@iridia.tech
- The team's youth should be shown visually, never explicitly claimed in copy
