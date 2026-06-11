# DevPath Mobile Learning

DevPath ist eine mobile-first PWA für angehende Entwickler. Die App ist vom schnellen Lernrhythmus bekannter Coding-Apps inspiriert, setzt aber stärker auf echte Entwicklerpraxis: kurze Theorie, korrekte Codebeispiele, direkte Quiz-Rückmeldung, Praxisaufgaben, XP, Streaks, Projekte und Fortschrittstracking.

Wichtig: Die Lerninhalte und Erklärungen sind auf Deutsch. Code, Dateinamen, TypeScript-Modelle, Variablen, Funktionen und Codebeispiele bleiben bewusst auf Englisch und syntaktisch korrekt.

## Stack

- React, TypeScript, Vite
- Tailwind CSS
- React Router
- Context API für lokalen State
- localStorage für Fortschritt
- Vitest für Verhaltenstests
- PWA Manifest und Service Worker

## Lokal starten

```bash
npm install
npm run dev
```

Danach die lokale Vite-URL öffnen, normalerweise `http://localhost:5173` oder `http://127.0.0.1:5173`.

Falls der Browser nach Änderungen eine leere alte Ansicht zeigt, einmal hart neu laden oder alte Website-Daten für localhost löschen. Im Dev-Modus meldet die App alte Service-Worker-Registrierungen automatisch ab.

## Nützliche Befehle

```bash
npm test
npm run lint
npm run build
npm run preview
```

## Produktkonzept

Version 1 läuft komplett lokal und fühlt sich auf dem Smartphone wie eine App an:

- Dashboard mit Weiterlernen-Karte
- sechs Kurs-Tracks: Python, C#, Java, HTML, CSS, JavaScript
- drei Module pro Kurs
- drei Lektionen pro Modul
- jede Lektion enthält Theorie, Codebeispiel, zwei Quizfragen und eine Praxisaufgabe
- Quizmodus mit Schwierigkeitsfiltern und Wiederholung falscher Fragen
- XP, Level, Streak, Tagesziel und Kursfortschritt
- Praxisprojekte mit Anforderungen, Hinweisen und Lösungsnotizen
- Profil, Fortschritt und Einstellungen
- Dark Mode als Standard mit optionalem Light Mode
- PWA-Grundstruktur

## Architektur

Kursinhalte liegen in `src/data/courses.ts` und nutzen die Domain-Modelle aus `src/models/learning.ts`. Die Fortschrittslogik liegt in `src/services/progressService.ts`; `src/store/ProgressContext.tsx` verbindet sie mit React und localStorage.

Die Struktur ist so vorbereitet, dass später ein Backend die lokalen Datenservices ersetzen kann. Seitenkomponenten bleiben für Darstellung und Interaktion zuständig; Persistenz, Scoring und Fortschrittsregeln liegen in Services.

## Backend-Roadmap

Version 2 kann ergänzen:

- FastAPI oder ASP.NET Core REST API
- PostgreSQL
- Login und Sessions
- serverseitige Fortschrittssynchronisierung
- Adminbereich für Lektionen und Quizfragen
- Content-Versionierung

Mögliche API-Struktur:

- `GET /courses`
- `GET /courses/:courseId`
- `GET /lessons/:lessonId`
- `POST /progress/lessons/:lessonId/complete`
- `POST /quiz/attempts`
- `GET /me/progress`
- `PATCH /me/settings`

Version 3 kann ergänzen:

- KI-Tutor
- Codeanalyse
- personalisierte Lernpfade
- echte Coding Sandbox
- Zertifikate
- bewerbungsorientierte Lernpfade

## Hinweis

Die erste Version verzichtet bewusst auf Backend-Abhängigkeiten. Dadurch bleibt die Portfolio-Demo leicht startbar, während die Codegrenzen für eine spätere API sauber bleiben.
