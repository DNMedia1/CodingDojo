# Mobile Learning Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first mobile learning PWA with course content, lessons, quizzes, progress, gamification, profile, and settings.

**Architecture:** React Router handles the app pages, a typed course repository provides local content, and a progress context persists user state through localStorage. The UI is a mobile app shell with reusable cards, bars, lesson steps, quiz controls, and bottom navigation.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Vitest, React Router, Context API, PWA manifest/service worker.

---

## File Map

- `src/models/learning.ts`: shared domain types.
- `src/data/courses.ts`: initial content for six languages.
- `src/data/projects.ts`: practice project briefs.
- `src/services/progressService.ts`: localStorage persistence and gamification helpers.
- `src/store/ProgressContext.tsx`: app state and progress actions.
- `src/pages/*`: routed product screens.
- `src/components/*`: reusable mobile UI primitives.
- `public/manifest.webmanifest`, `public/sw.js`: PWA foundation.
- `README.md`: concept, architecture, backend roadmap, and run commands.

## Tasks

- [x] Define design spec and app architecture.
- [ ] Create Vite/React/Tailwind project scaffolding.
- [ ] Add typed course and project content.
- [ ] Implement progress persistence, XP, level, streak, and quiz scoring.
- [ ] Build mobile app shell, bottom navigation, reusable UI components.
- [ ] Build dashboard, courses, course detail, module, lesson, quiz, projects, profile, progress, and settings pages.
- [ ] Add PWA manifest and service worker.
- [ ] Add unit tests for learning data and progress logic.
- [ ] Verify with tests, production build, and local browser smoke test.

## Self Review

The plan covers the requested MVP scope and explicitly leaves backend, login, community, AI tutor, sandbox, certificates, and admin tooling for later roadmap versions. No placeholder implementation tasks remain.
