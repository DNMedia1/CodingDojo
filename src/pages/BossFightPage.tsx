import { CheckCircle2, ChevronLeft, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExerciseRenderer } from '../components/exercises/ExerciseRenderer';
import { Header } from '../components/Header';
import { ProgressBar } from '../components/ProgressBar';
import { getCourse } from '../data/courses';
import { getBossFightScore, isBossFightPassed } from '../services/bossFightService';
import { calculateLevel } from '../services/progressService';
import { useLearningActivity } from '../store/LearningActivityContext';
import { useProgress } from '../store/ProgressContext';

export function BossFightPage() {
  const { courseId, moduleId } = useParams();
  const course = getCourse(courseId ?? '');
  const module = course?.modules.find((item) => item.id === moduleId);
  const { progress, completeBossFight } = useProgress();
  const { recordExerciseResult } = useLearningActivity();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [awarded, setAwarded] = useState(false);

  if (!course || !module) return <Header title="Boss-Fight nicht gefunden" subtitle="Gehe zur Kursübersicht und wähle ein anderes Modul." />;

  const bossFight = module.bossFight;
  const score = getBossFightScore(bossFight, answers);
  const completed = progress.completedBossFights.includes(bossFight.id);
  const canFinish = isBossFightPassed(bossFight, answers);
  const hasAward = completed || awarded;

  const finish = () => {
    if (hasAward || !canFinish) return;
    completeBossFight(bossFight.id, bossFight.xp);
    setAwarded(true);
  };

  return (
    <div>
      <Link to={`/courses/${course.id}/modules/${module.id}`} className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-2xl border border-white/10 bg-panel px-4 text-sm font-extrabold text-muted">
        <ChevronLeft size={17} /> Zurück zum Modul
      </Link>
      <Header title={`Boss-Fight: ${module.title}`} subtitle={bossFight.description} />

      <section className="rounded-3xl border border-yellow-300/25 bg-yellow-300/10 p-5 shadow-glow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-yellow-100">Abschluss-Challenge</p>
            <h2 className="mt-1 text-2xl font-black">{bossFight.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Kombiniert {bossFight.skillTags.slice(0, 4).join(', ')} und gibt {bossFight.xp} XP.
            </p>
          </div>
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-yellow-300/20 text-yellow-100">
            <Trophy size={25} />
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-muted">
            <span>Fortschritt</span>
            <span>{score.answered}/{score.total}</span>
          </div>
          <ProgressBar value={score.total === 0 ? 0 : (score.answered / score.total) * 100} accent="#fde047" />
        </div>
      </section>

      <section className="mt-5 space-y-4">
        {bossFight.exercises.map((exercise) => (
          <div key={exercise.id} className="rounded-3xl border border-white/10 bg-panel p-5">
            <ExerciseRenderer
              exercise={exercise}
              onAnswered={(result, rating) => {
                setAnswers((current) => ({ ...current, [exercise.id]: result.correct }));
                recordExerciseResult({ result, exercise, lessonId: bossFight.id, courseId: course.id, rating });
              }}
            />
          </div>
        ))}
      </section>

      <section className="mt-5 rounded-3xl border border-white/10 bg-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-black">Ergebnis</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              {score.correct}/{score.total} richtig · {score.percent}% · Level {calculateLevel(progress.xp).level}
            </p>
          </div>
          {hasAward ? (
            <span className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 font-extrabold text-emerald-100">
              <CheckCircle2 size={18} /> XP erhalten
            </span>
          ) : (
            <button onClick={finish} disabled={!canFinish} className="min-h-11 rounded-2xl bg-text px-5 font-extrabold text-ink disabled:opacity-40">
              {bossFight.xp} XP abholen
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
