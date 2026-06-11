import { useState } from 'react';
import { Header } from '../components/Header';
import { useProgress } from '../store/ProgressContext';

export function SettingsPage() {
  const { progress, updateProfile, setTheme, resetProgress } = useProgress();
  const [name, setName] = useState(progress.displayName);
  const [goal, setGoal] = useState(progress.dailyGoal);

  return (
    <div>
      <Header title="Einstellungen" subtitle="Lokale Einstellungen für das MVP." />
      <section className="rounded-3xl border border-white/10 bg-panel p-5">
        <label className="block text-sm font-bold text-muted" htmlFor="name">Anzeigename</label>
        <input id="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-ink px-4 font-bold outline-none focus:border-sky-300" />
        <label className="mt-5 block text-sm font-bold text-muted" htmlFor="goal">Tägliches Lektionsziel</label>
        <input id="goal" type="number" min={1} max={8} value={goal} onChange={(event) => setGoal(Number(event.target.value))} className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-ink px-4 font-bold outline-none focus:border-sky-300" />
        <button onClick={() => updateProfile(name.trim() || 'Entwickler', goal)} className="mt-5 min-h-12 w-full rounded-2xl bg-text font-extrabold text-ink">Profil speichern</button>
      </section>
      <section className="mt-4 rounded-3xl border border-white/10 bg-panel p-5">
        <h2 className="font-extrabold">Darstellung</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button onClick={() => setTheme('dark')} className={`min-h-11 rounded-2xl font-bold ${progress.theme === 'dark' ? 'bg-text text-ink' : 'bg-white/5 text-muted'}`}>Dunkel</button>
          <button onClick={() => setTheme('light')} className={`min-h-11 rounded-2xl font-bold ${progress.theme === 'light' ? 'bg-text text-ink' : 'bg-white/5 text-muted'}`}>Hell</button>
        </div>
      </section>
      <section className="mt-4 rounded-3xl border border-red-300/20 bg-red-300/10 p-5">
        <h2 className="font-extrabold text-red-100">Lokalen Fortschritt zurücksetzen</h2>
        <p className="mt-2 text-sm leading-6 text-red-100/70">Das löscht nur den localStorage-Fortschritt auf diesem Gerät.</p>
        <button onClick={resetProgress} className="mt-4 min-h-11 w-full rounded-2xl border border-red-200/30 font-extrabold text-red-100">Zurücksetzen</button>
      </section>
    </div>
  );
}
