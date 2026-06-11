# Mobile Learning Platform Design

## Goal

Build a mobile-first PWA learning platform for junior developers. The first version runs locally without a backend, uses structured course data, saves progress in localStorage, and feels like a polished app that can later be wrapped with Capacitor.

## Product Shape

The app focuses on short, practice-oriented lessons for Python, C#, Java, HTML, CSS, and JavaScript. Each course has three modules with three lessons each. Every lesson includes theory, a code example, two quiz questions, and one practical task. The learner can continue a lesson, browse courses, take mixed quizzes, inspect practice projects, view progress, and manage profile/settings.

## Architecture

The project uses React, TypeScript, Vite, Tailwind CSS, React Router, and a small Context-based progress store. Course content is modeled as TypeScript data now, with interfaces shaped so the same payload can later come from JSON files or a REST API. User progress, XP, streak, completed lessons, quiz history, and theme are persisted via a storage service.

## UI Direction

Dark mode is the default. The interface uses a compact app shell with a safe-area aware bottom navigation, touch-friendly controls, rounded course cards, high-contrast typography, and language-specific accent colors. The first screen prioritizes "continue learning", daily practice, progress, and course discovery instead of a marketing hero.

## Backend Roadmap

Version 2 can replace the local repository services with HTTP services backed by FastAPI or ASP.NET Core, PostgreSQL, login, progress sync, and an admin area. Version 3 can add an AI tutor, code analysis, personalized paths, a coding sandbox, certificates, and job-oriented tracks.

## Verification

The MVP should build with `npm run build`, run with `npm run dev`, and include focused unit tests for progress calculations, lesson completion, XP/level math, quiz scoring, and course data integrity.
