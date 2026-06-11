import { BookOpen, FolderKanban, Home, PieChart, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Start', icon: Home },
  { to: '/courses', label: 'Kurse', icon: BookOpen },
  { to: '/quiz', label: 'Quiz', icon: PieChart },
  { to: '/projects', label: 'Projekte', icon: FolderKanban },
  { to: '/profile', label: 'Profil', icon: UserRound }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-text">
      <div className="app-bg" />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[480px] flex-col px-4 pb-28 pt-safe-top">
        <div className="flex-1 py-5">{children}</div>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] border-t border-white/10 bg-[#0b0f14]/92 px-3 pb-safe-bottom pt-2 backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
                <Icon size={20} strokeWidth={2.2} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
