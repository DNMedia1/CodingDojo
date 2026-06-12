import type { PracticeProject } from '../models/learning';

export const projects: PracticeProject[] = [
  {
    id: 'python-todo-cli',
    courseId: 'python',
    title: 'To-do CLI',
    difficulty: 'basic',
    duration: '45-60 Min.',
    summary: 'Baue ein Kommandozeilen-Tool, mit dem du Aufgaben anlegst, auflistest und abhakst — gespeichert wird alles in einer JSON-Datei.',
    requirements: ['Speichere die Aufgaben dauerhaft in einer JSON-Datei.', 'Unterstütze die drei Befehle add, list und complete.', 'Gib bei unbekannten Befehlen eine hilfreiche Fehlermeldung aus.'],
    hints: ['Nutze pathlib für den Dateizugriff.', 'Trenne das Einlesen der Befehle von der eigentlichen Task-Logik.'],
    solutionNotes: ['Eine gute Lösung hat einen eigenen Task-Typ, kleine load/save-Helfer und einen zentralen Befehls-Verteiler.']
  },
  {
    id: 'python-fastapi-mini-api',
    courseId: 'python',
    title: 'FastAPI Mini API',
    difficulty: 'intermediate',
    duration: '90 Min.',
    summary: 'Erstelle eine kleine REST API, die Lektionen ausliefert und abgeschlossenen Lernfortschritt entgegennimmt.',
    requirements: ['Biete GET /lessons an und liefere alle Lektionen als JSON.', 'Biete POST /progress an und speichere eine abgeschlossene Lektion.', 'Validiere eingehende Request Bodies mit Pydantic-Modellen.'],
    hints: ['Starte mit Daten im Arbeitsspeicher — eine Datenbank kommt später.', 'Nutze typisierte Response Models für saubere Antworten.'],
    solutionNotes: ['Lege den Datenzugriff hinter ein Repository, damit später PostgreSQL einspringen kann, ohne dass sich die Routen ändern.']
  },
  {
    id: 'csharp-console-tracker',
    courseId: 'csharp',
    title: 'Console XP Tracker',
    difficulty: 'basic',
    duration: '45 Min.',
    summary: 'Baue eine C#-Konsolen-App, die abgeschlossene Lektionen und gesammelte XP verwaltet.',
    requirements: ['Modelliere die Klassen LessonProgress und UserProfile.', 'Vergib XP für jede Lektion nur ein einziges Mal.', 'Gib am Ende eine Zusammenfassung mit Level und Gesamt-XP aus.'],
    hints: ['Nutze List<T> und LINQ für die Auswertungen.', 'Bündle die XP-Regeln in einer eigenen Service-Klasse.'],
    solutionNotes: ['Der Lektionsabschluss sollte idempotent sein: Mehrfaches Abschließen darf keine zusätzlichen XP vergeben — genau wie in dieser App.']
  },
  {
    id: 'csharp-aspnet-api',
    courseId: 'csharp',
    title: 'ASP.NET Core Progress API',
    difficulty: 'intermediate',
    duration: '2 Std.',
    summary: 'Entwirf eine ASP.NET Core API, die Kursfortschritt speichert und für Entity Framework Core vorbereitet ist.',
    requirements: ['Erstelle einen ProgressController mit klaren Routen.', 'Lege DTOs für eingehende Completion-Requests an.', 'Antworte bei erfolgreichem Abschluss mit Status 204 (No Content).'],
    hints: ['Halte den Controller schlank und delegiere die Regeln an einen Service.', 'Entscheide bewusst, welche Felder ins DTO gehören und welche intern bleiben.'],
    solutionNotes: ['Die Datenbank sollte doppelte Abschlüsse über einen Unique Constraint verhindern — nicht nur der Anwendungscode.']
  },
  {
    id: 'java-oop-kata',
    courseId: 'java',
    title: 'OOP Badge Kata',
    difficulty: 'basic',
    duration: '60 Min.',
    summary: 'Schreibe ein kleines Java-Programm, das Lernenden anhand ihrer abgeschlossenen Lektionen Badges verleiht.',
    requirements: ['Modelliere die Klassen Badge, Learner und BadgeService.', 'Verleihe das Starter-Badge ab 3 abgeschlossenen Lektionen.', 'Stelle sicher, dass niemand dasselbe Badge doppelt erhält.'],
    hints: ['Ein Set eignet sich, um Duplikate strukturell auszuschließen.', 'Ein paar kleine Tests für den BadgeService geben dir Sicherheit.'],
    solutionNotes: ['Komposition — der Service nutzt Learner und Badges — ist hier robuster als eine Vererbungshierarchie.']
  },
  {
    id: 'java-spring-rest',
    courseId: 'java',
    title: 'Spring Boot REST API',
    difficulty: 'intermediate',
    duration: '2 Std.',
    summary: 'Baue eine Spring-Boot-API, die Lektionen ausliefert und Quizversuche entgegennimmt.',
    requirements: ['Erstelle je einen Controller für Lektionen und Quizversuche.', 'Verschiebe die Fachlogik in eigene Service-Klassen.', 'Antworte mit passenden HTTP-Statuscodes wie 200, 201 und 404.'],
    hints: ['Trenne die DTOs der API von den internen Entities.', 'Starte ohne Datenbank — Daten im Speicher reichen für den Anfang.'],
    solutionNotes: ['In einer späteren Ausbaustufe übernehmen Spring Data Repositories die Persistenz.']
  },
  {
    id: 'html-landing-page',
    courseId: 'html',
    title: 'Semantische Landingpage',
    difficulty: 'basic',
    duration: '45 Min.',
    summary: 'Baue die Landingpage für einen fiktiven Programmierkurs — mit sauberer, semantischer HTML-Struktur.',
    requirements: ['Strukturiere die Seite mit header, main, section, article und footer.', 'Baue eine Navigation, die auch mit Tastatur und Screenreader funktioniert.', 'Verwende eine logische Überschriften-Hierarchie ohne übersprungene Level.'],
    hints: ['Schreibe zuerst die komplette Struktur und gestalte erst danach.', 'Lies deine Überschriften wie ein Inhaltsverzeichnis — ergibt es Sinn?'],
    solutionNotes: ['Eine gute Lösung bleibt auch ganz ohne CSS lesbar und verständlich.']
  },
  {
    id: 'css-responsive-cards',
    courseId: 'css',
    title: 'Responsive Card Layout',
    difficulty: 'basic',
    duration: '60 Min.',
    summary: 'Baue ein Karten-Layout, das sich von einer Spalte auf dem Handy bis zu zwei Spalten auf größeren Screens anpasst.',
    requirements: ['Auf dem Handy stehen die Karten untereinander in einer Spalte.', 'Ab Tablet-Breite ordnen sich die Karten in zwei Spalten an.', 'Alle interaktiven Elemente haben sichtbare Focus-Zustände.'],
    hints: ['gap und minmax() ersparen dir mühsame Margin-Rechnereien.', 'Vermeide feste Kartenbreiten — lass das Grid die Größen verteilen.'],
    solutionNotes: ['Gleichmäßige Abstände und ruhige Proportionen wirken hochwertiger als auffällige Dekoration.']
  },
  {
    id: 'javascript-quiz-app',
    courseId: 'javascript',
    title: 'Quiz App',
    difficulty: 'basic',
    duration: '90 Min.',
    summary: 'Baue ein Quiz im Browser, das Fragen anzeigt und Antworten sofort bewertet.',
    requirements: ['Rendere die Fragen aus einem Daten-Array statt aus festem HTML.', 'Merke dir die ausgewählten Antworten in einem State-Objekt.', 'Zeige nach der Auswertung Punktzahl und Erklärungen an.'],
    hints: ['Halte Fragendaten und UI-Code strikt getrennt.', 'Event Delegation erspart dir viele einzelne Listener.'],
    solutionNotes: ['Dieses Projekt ist die ideale Vorstufe zum State-Management in React.']
  },
  {
    id: 'javascript-fetch-app',
    courseId: 'javascript',
    title: 'Fetch API Explorer',
    difficulty: 'intermediate',
    duration: '90 Min.',
    summary: 'Lade Daten von einer öffentlichen API und zeige Lade-, Erfolgs- und Fehlerzustand sauber an.',
    requirements: ['Nutze async/await für die Anfragen.', 'Prüfe response.ok, bevor du die Antwort weiterverarbeitest.', 'Biete nach einem Fehler einen Retry-Button an.'],
    hints: ['Ein kleiner Fetch-Helfer vermeidet kopierten Code.', 'Modelliere den Ladezustand explizit, statt ihn aus Nebeneffekten zu erraten.'],
    solutionNotes: ['Zuverlässige Oberflächen entstehen vor allem durch sauber modellierte Zustände.']
  },
  {
    id: 'typescript-domain-models',
    courseId: 'typescript',
    title: 'Typed Learning Domain',
    difficulty: 'intermediate',
    duration: '75 Min.',
    summary: 'Modelliere Kurse, Lektionen, Fortschritt und API-Ergebnisse mit sicheren TypeScript-Typen.',
    requirements: ['Definiere Union Types für Statuswerte.', 'Nutze Interfaces für Course, Lesson und Progress.', 'Modelliere API-Erfolg und Fehler als discriminated union.'],
    hints: ['Starte mit den echten Begriffen aus der App.', 'Vermeide any an API-Grenzen.'],
    solutionNotes: ['Eine starke Lösung macht ungültige Zustände schwer darstellbar und zwingt Fehlerfälle sichtbar in die UI.']
  },
  {
    id: 'react-lesson-dashboard',
    courseId: 'react',
    title: 'Lesson Dashboard',
    difficulty: 'intermediate',
    duration: '2 Std.',
    summary: 'Baue ein React-Dashboard mit Kurskarten, Fortschritt, Loading State und Antwortauswahl.',
    requirements: ['Rendere Kurskarten aus Props.', 'Verwalte ausgewählte Antworten mit State.', 'Zeige Loading, Error und Success State.'],
    hints: ['Halte Card, List und Page getrennt.', 'Berechne Fortschritt aus vorhandenen Daten.'],
    solutionNotes: ['Die beste Lösung trennt Datenfluss und UI-Komponenten, ohne unnötig viele Wrapper zu erzeugen.']
  },
  {
    id: 'git-release-workflow',
    courseId: 'git',
    title: 'Feature Release Workflow',
    difficulty: 'basic',
    duration: '45 Min.',
    summary: 'Simuliere einen sauberen Git-Workflow von Branch über Commit bis Pull Request.',
    requirements: ['Erstelle einen Feature-Branch.', 'Stage nur zusammengehörige Dateien.', 'Formuliere eine klare PR-Beschreibung mit Tests.'],
    hints: ['Nutze git status vor jedem großen Schritt.', 'Prüfe lokale Commits vor dem Push.'],
    solutionNotes: ['Ein guter Workflow macht nachvollziehbar, warum eine Änderung passiert ist und wie sie geprüft wurde.']
  },
  {
    id: 'sql-progress-schema',
    courseId: 'sql',
    title: 'Progress Database Schema',
    difficulty: 'intermediate',
    duration: '90 Min.',
    summary: 'Entwirf Tabellen und Queries für gespeicherten Lernfortschritt.',
    requirements: ['Erstelle Tabellen für Profile, Lessons und Progress.', 'Verhindere doppelte Completions per Primary Key.', 'Schreibe Queries für Dashboard und Streak-Auswertung.'],
    hints: ['Starte mit Zugriffsmustern der App.', 'Indexiere User- und Zeitfilter bewusst.'],
    solutionNotes: ['Das Schema sollte Fachregeln in Constraints ausdrücken, nicht nur im Anwendungscode.']
  },
  {
    id: 'backend-progress-api',
    courseId: 'backend',
    title: 'Progress API Slice',
    difficulty: 'advanced',
    duration: '2-3 Std.',
    summary: 'Implementiere einen API-Slice für Lesson Completion mit Validierung, Service und Repository-Grenze.',
    requirements: ['Expose POST /lessons/:lessonId/complete.', 'Validiere Request Body und Auth-Kontext.', 'Kapsle Speicherung hinter einem Repository Interface.'],
    hints: ['Teste die Service-Funktion ohne HTTP.', 'Plane klare Fehler für Not Found und Validation.'],
    solutionNotes: ['Eine robuste Lösung trennt Route, Validation, Service und Persistence so, dass Supabase später sauber angeschlossen werden kann.']
  },
  {
    id: 'automation-lead-router',
    courseId: 'automation',
    title: 'Lead Routing Automation',
    difficulty: 'basic',
    duration: '60 Min.',
    summary: 'Plane einen Make- oder Zapier-Flow, der neue Leads prüft, mapped und als CRM-Aufgabe anlegt.',
    requirements: ['Definiere Trigger, Actions und Zielsystem.', 'Mappe Name, E-Mail und Lead-Quelle sauber.', 'Lege eine Fehlerbenachrichtigung für fehlende Pflichtfelder an.'],
    hints: ['Starte mit einem kleinen JSON-Flow.', 'Trenne Datenmapping von der eigentlichen CRM-Action.'],
    solutionNotes: ['Ein guter Flow ist nachvollziehbar, idempotent und lässt sich mit einem Beispiel-Lead testen.']
  },
  {
    id: 'automation-ai-ticket-agent',
    courseId: 'automation',
    title: 'AI Ticket Agent',
    difficulty: 'intermediate',
    duration: '2 Std.',
    summary: 'Entwirf einen Agentic Workflow, der Supporttickets zusammenfasst und Aufgaben mit menschlicher Freigabe vorbereitet.',
    requirements: ['Formuliere System-Prompt und dynamischen Input.', 'Definiere einen Tool Call zum Erstellen einer Aufgabe.', 'Baue Human-in-the-loop vor dem Versand ein.'],
    hints: ['Begrenze Tool-Parameter auf klare Felder.', 'Logge Ergebnis und Fehler, aber keine sensiblen Daten.'],
    solutionNotes: ['Die beste Lösung lässt KI Entwürfe vorbereiten, aber riskante Aktionen erst nach Approval ausführen.']
  }
];
