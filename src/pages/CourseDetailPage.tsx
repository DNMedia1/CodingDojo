import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProgressBar } from '../components/ProgressBar';
import { getCourse } from '../data/courses';
import { useProgress } from '../store/ProgressContext';
import { getCourseProgress } from '../utils/learning';

export function CourseDetailPage() {
  const { courseId } = useParams();
  const course = getCourse(courseId ?? '');
  const { progress } = useProgress();
  if (!course) return <Header title="Kurs nicht gefunden" subtitle="Wähle einen anderen Lernpfad in der Kursübersicht." />;
  const stats = getCourseProgress(course, progress);

  return (
    <div>
      <Header title={course.title} subtitle={course.description} />
      <section className={`rounded-3xl bg-gradient-to-br ${course.gradient} p-5 text-ink shadow-glow`}>
        <div className="flex items-center justify-between">
          <div className="text-5xl font-black">{course.icon}</div>
          <div className="text-right">
            <p className="text-3xl font-black">{stats.percent}%</p>
            <p className="text-sm font-bold">abgeschlossen</p>
          </div>
        </div>
        <div className="mt-5 rounded-full bg-ink/20 p-1">
          <ProgressBar value={stats.percent} accent="#0b0f14" />
        </div>
      </section>

      <div className="mt-5 space-y-3">
        {course.modules.map((module, index) => {
          const completed = module.lessons.filter((lesson) => progress.completedLessons[course.id]?.includes(lesson.id)).length;
          return (
            <Link key={module.id} to={`/courses/${course.id}/modules/${module.id}`} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-panel p-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 font-black">{index + 1}</div>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold">{module.title}</h2>
                <p className="mt-1 text-sm text-muted">{completed}/{module.lessons.length} Lektionen · {module.description}</p>
              </div>
              <ArrowRight size={18} className="text-muted" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
