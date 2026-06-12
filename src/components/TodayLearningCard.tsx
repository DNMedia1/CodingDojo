import { Code2, RotateCcw, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TodayLearningRecommendation } from '../services/recommendationService';
import { ProgressBar } from './ProgressBar';

type TodayLearningCardProps = {
  recommendation: TodayLearningRecommendation;
};

export function TodayLearningCard({ recommendation }: TodayLearningCardProps) {
  const primaryHref = recommendation.primaryAction === 'review'
    ? '/mistakes'
    : `/lessons/${recommendation.primaryAction === 'challenge' ? recommendation.miniChallengeLessonId : recommendation.nextLessonId}`;

  return (
    <section className="rounded-3xl border border-white/10 bg-panel p-5 shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-muted">Heute lernen</p>
          <h2 className="mt-1 text-2xl font-black">Dein nächster sinnvoller Schritt</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Reviews zuerst, danach eine passende Lektion und eine kleine Code-Challenge.
          </p>
        </div>
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-yellow-300/15 text-yellow-100">
          <Sparkles size={24} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-y border-white/10 py-4 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-extrabold text-sky-100">
            <RotateCcw size={17} /> Wiederholen
          </div>
          <p className="mt-2 text-xl font-black">{recommendation.dueReviewCount} fällig</p>
          <p className="mt-1 text-xs leading-5 text-muted">Aufgaben aus deinem Fehlerbuch.</p>
        </div>
        <div className="border-t border-white/10 pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
          <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-100">
            <Target size={17} /> Nächste Lektion
          </div>
          <p className="mt-2 text-base font-black">{recommendation.nextLessonTitle}</p>
          <p className="mt-1 text-xs leading-5 text-muted">{recommendation.nextCourseTitle} · {recommendation.nextModuleTitle}</p>
        </div>
        <div className="border-t border-white/10 pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
          <div className="flex items-center gap-2 text-sm font-extrabold text-yellow-100">
            <Code2 size={17} /> Mini-Code
          </div>
          <p className="mt-2 text-base font-black">{recommendation.miniChallengeTitle}</p>
          <p className="mt-1 text-xs leading-5 text-muted">Kurz üben, ohne direkt eine ganze Lektion zu beenden.</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-muted">
          <span>Tagesziel</span>
          <span>{Math.min(recommendation.dailyGoalCurrent, recommendation.dailyGoalTarget)}/{recommendation.dailyGoalTarget}</span>
        </div>
        <ProgressBar value={recommendation.dailyGoalPercent} accent="#ffd94d" />
      </div>

      <Link to={primaryHref} className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-text px-4 font-extrabold text-ink">
        {recommendation.primaryActionLabel}
      </Link>
    </section>
  );
}
