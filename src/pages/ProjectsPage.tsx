import { Header } from '../components/Header';
import { courses } from '../data/courses';
import { projects } from '../data/projects';

export function ProjectsPage() {
  return (
    <div>
      <Header title="Projekte" subtitle="Kleine Portfolio-Uebungen mit Anforderungen, Hinweisen und Lösungsnotizen." />
      <div className="space-y-4">
        {projects.map((project) => {
          const course = courses.find((item) => item.id === project.courseId)!;
          return (
            <article key={project.id} className="rounded-3xl border border-white/10 bg-panel p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{course.title} · {difficultyLabel(project.difficulty)}</p>
                  <h2 className="mt-1 text-xl font-black">{project.title}</h2>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-muted">{project.duration}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">{project.summary}</p>
              <div className="mt-4 grid gap-3">
                <DetailList title="Anforderungen" items={project.requirements} />
                <DetailList title="Hinweise" items={project.hints} />
                <DetailList title="Lösungsnotizen" items={project.solutionNotes} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function difficultyLabel(difficulty: string) {
  if (difficulty === 'basic') return 'Basis';
  if (difficulty === 'intermediate') return 'Mittel';
  return 'Fortgeschritten';
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <details className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <summary className="cursor-pointer text-sm font-extrabold">{title}</summary>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </details>
  );
}
