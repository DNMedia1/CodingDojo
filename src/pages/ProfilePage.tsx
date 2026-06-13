import { Award, Flame, GraduationCap, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProgressBar } from '../components/ProgressBar';
import { StatTile } from '../components/StatTile';
import { courses } from '../data/courses';
import { getBadgeStates } from '../services/badgeService';
import { useProgress } from '../store/ProgressContext';
import { formatDayCount, getCourseProgress, getOverallProgress } from '../utils/learning';

export function ProfilePage() {
  const { progress, levelInfo } = useProgress();
  const overall = getOverallProgress(progress);
  const completedCourses = courses.filter((course) => getCourseProgress(course, progress).percent === 100).length;
  const badgeStates = getBadgeStates(progress);
  const earnedCount = badgeStates.filter((state) => state.earned).length;

  return (
    // Identity lives in the hero card only — no duplicate page header above it.
    <div className="space-y-4">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-4">
        <div className="space-y-4">
          <section className="relative rounded-3xl border border-white/10 bg-panel p-6 text-center">
            <Link to="/settings" aria-label="Einstellungen" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-panelSoft text-muted">
              <Settings size={18} />
            </Link>
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-[#ffd94d] to-[#50a7ff] text-3xl font-black text-ink">
              {progress.displayName.slice(0, 1).toUpperCase()}
            </div>
            <h2 className="mt-4 text-2xl font-black">{progress.displayName}</h2>
            <p className="mt-1 text-sm font-bold text-muted">Level {levelInfo.level} Entwickler · {progress.xp} XP</p>
            <div className="mt-5">
              <ProgressBar value={levelInfo.progress} accent="#ffd94d" />
              <p className="mt-2 text-xs font-bold text-muted">{levelInfo.nextLevelXp - progress.xp} XP bis zum nächsten Level</p>
            </div>
          </section>
          <section className="grid grid-cols-3 gap-3">
            <StatTile label="Streak" value={formatDayCount(progress.streak)} tone="yellow" />
            <StatTile label="Kurse" value={completedCourses} tone="green" />
            <StatTile label="Gesamt" value={`${overall.percent}%`} tone="blue" />
          </section>
        </div>
        <section className="mt-4 rounded-3xl border border-white/10 bg-panel p-6 lg:mt-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Badges</h2>
            <span className="text-sm font-bold text-muted">{earnedCount}/{badgeStates.length}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {badgeStates.map(({ badge, earned }) => (
              <div
                key={badge.id}
                title={badge.description}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition ${earned ? 'border-yellow-300/40 bg-yellow-300/10' : 'border-white/10 bg-white/5 opacity-40 grayscale'}`}
              >
                <span className="text-2xl" aria-hidden>{badge.icon}</span>
                <span className="text-[11px] font-extrabold leading-4">{badge.title}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">Bester Streak bisher: {formatDayCount(progress.bestStreak)} · {progress.quizCorrectTotal} richtige Quizantworten</p>
        </section>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <Link to="/progress" className="profile-link"><GraduationCap size={20} /> Fortschritt ansehen</Link>
        <Link to="/projects" className="profile-link"><Award size={20} /> Praxisprojekte</Link>
        <Link to="/mistakes" className="profile-link"><Flame size={20} /> Meine Fehler</Link>
      </div>
    </div>
  );
}
