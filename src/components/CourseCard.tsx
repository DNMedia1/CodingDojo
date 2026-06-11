import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Course } from '../models/learning';
import { useProgress } from '../store/ProgressContext';
import { getCourseProgress } from '../utils/learning';
import { ProgressBar } from './ProgressBar';

export function CourseCard({ course }: { course: Course }) {
  const { progress } = useProgress();
  const stats = getCourseProgress(course, progress);

  return (
    <Link to={`/courses/${course.id}`} className="block rounded-2xl border border-white/10 bg-panel/90 p-4 shadow-glow transition hover:-translate-y-0.5 hover:border-white/20">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${course.gradient} text-sm font-black text-ink`}>
          {course.icon}
        </div>
        <ArrowRight className="text-muted" size={18} />
      </div>
      <h3 className="text-lg font-extrabold">{course.title}</h3>
      <p className="mt-1 min-h-[48px] text-sm leading-6 text-muted">{course.description}</p>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-muted">
          <span>{stats.completed}/{stats.total} Lektionen</span>
          {stats.percent === 100 ? <CheckCircle2 size={16} className="text-emerald-300" /> : <span>{stats.percent}%</span>}
        </div>
        <ProgressBar value={stats.percent} accent={course.accent} />
      </div>
    </Link>
  );
}
