import { Award, Flame, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProgressBar } from '../components/ProgressBar';
import { StatTile } from '../components/StatTile';
import { courses } from '../data/courses';
import { useProgress } from '../store/ProgressContext';
import { getCourseProgress, getOverallProgress } from '../utils/learning';

export function ProfilePage() {
  const { progress, levelInfo } = useProgress();
  const overall = getOverallProgress(progress);
  const completedCourses = courses.filter((course) => getCourseProgress(course, progress).percent === 100).length;

  return (
    <div>
      <Header title="Profil" subtitle="Dein lokales Lernprofil als Entwickler." />
      <section className="rounded-3xl border border-white/10 bg-panel p-5 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-sky-300 to-violet-300 text-3xl font-black text-ink">
          {progress.displayName.slice(0, 1).toUpperCase()}
        </div>
        <h2 className="mt-4 text-2xl font-black">{progress.displayName}</h2>
        <p className="mt-1 text-sm text-muted">Level {levelInfo.level} Entwickler · {progress.xp} XP</p>
        <div className="mt-5">
          <ProgressBar value={levelInfo.progress} accent="#7dd3fc" />
          <p className="mt-2 text-xs font-bold text-muted">{levelInfo.nextLevelXp - progress.xp} XP bis zum naechsten Level</p>
        </div>
      </section>
      <section className="mt-4 grid grid-cols-3 gap-3">
        <StatTile label="Streak" value={progress.streak} tone="yellow" />
        <StatTile label="Kurse" value={completedCourses} tone="green" />
        <StatTile label="Total" value={`${overall.percent}%`} tone="purple" />
      </section>
      <div className="mt-5 grid gap-3">
        <Link to="/progress" className="profile-link"><GraduationCap size={20} /> Fortschritt ansehen</Link>
        <Link to="/projects" className="profile-link"><Award size={20} /> Praxisprojekte</Link>
        <Link to="/quiz" className="profile-link"><Flame size={20} /> Fehler wiederholen</Link>
      </div>
    </div>
  );
}
