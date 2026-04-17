import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Sun, Moon, Radio } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, path: '/', label: 'Dashboard' },
];

export default function Sidebar({ darkMode, setDarkMode }) {
  return (
    <aside className="glass-sidebar fixed left-0 top-0 bottom-0 w-[72px] flex flex-col items-center py-6 z-50 lg:flex hidden">
      <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center mb-8">
        <Radio className="w-5 h-5 text-primary-foreground" />
      </div>
      <nav className="flex-1 flex flex-col items-center gap-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${index === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}
          >
            <item.icon className="w-5 h-5" />
          </Link>
        ))}
      </nav>
      <button onClick={() => setDarkMode(!darkMode)} className="w-11 h-11 mb-2 text-muted-foreground hover:bg-accent rounded-xl flex items-center justify-center">
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </aside>
  );
}
