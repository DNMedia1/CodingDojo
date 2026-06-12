import { CheckCircle2, Clock, Trophy } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { getCourse } from '../data/courses';
import { useProgress } from '../store/ProgressContext';
import { isLessonCompleted } from '../utils/learning';

export function ModulePage() {
  const { courseId, moduleId } = useParams();
  const course = getCourse(courseId ?? '');
  const module = course?.modules.find((item) => item.id === moduleId);
  const { progress } = useProgress();
  if (!course || !module) return <Header title="Modul nicht gefunden" subtitle="Gehe zur Kursübersicht und wähle ein anderes Modul." />;

  return (
    <div>
      <Header title={module.title} subtitle={module.description} />
      <div className="grid gap-3 lg:grid-cols-2">
        {module.lessons.map((lesson) => {
          const completed = isLessonCompleted(progress, course.id, lesson.id);
          return (
            <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="block rounded-2xl border border-white/10 bg-panel p-4 transition hover:-translate-y-0.5 hover:border-white/20">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold">{lesson.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{lesson.theory}</p>
                </div>
                {completed ? <CheckCircle2 className="shrink-0 text-emerald-300" /> : null}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                <span className="flex items-center gap-1"><Clock size={14} /> {lesson.estimatedMinutes} min</span>
                <span>{lesson.xp} XP</span>
              </div>
            </Link>
          );
        })}
      </div>

      <Link to={`/courses/${course.id}/modules/${module.id}/boss-fight`} className="mt-4 block rounded-3xl border border-yellow-300/30 bg-yellow-300/10 p-5 transition hover:-translate-y-0.5 hover:border-yellow-200/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold text-yellow-100">Abschluss-Challenge</p>
            <h2 className="mt-1 text-xl font-black">Boss-Fight: {module.bossFight.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{module.bossFight.description}</p>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-yellow-300/20 text-yellow-100">
            <Trophy size={22} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em] text-muted">
          <span>{module.bossFight.exercises.length} Aufgaben</span>
          <span>{module.bossFight.xp} XP</span>
          <span>{module.bossFight.skillTags.slice(0, 3).join(', ')}</span>
        </div>
      </Link>
    </div>
  );
}
