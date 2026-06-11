import { CheckCircle2, Clock } from 'lucide-react';
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
      <div className="space-y-3">
        {module.lessons.map((lesson) => {
          const completed = isLessonCompleted(progress, course.id, lesson.id);
          return (
            <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="block rounded-2xl border border-white/10 bg-panel p-4">
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
    </div>
  );
}
