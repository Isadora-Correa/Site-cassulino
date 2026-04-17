import React from 'react';
import { LayoutDashboard, Activity, Bell, Settings, BarChart3 } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Home' },
  { icon: Activity, label: 'MQTT' },
  { icon: BarChart3, label: 'API' },
  { icon: Bell, label: 'Alertas' },
  { icon: Settings, label: 'AWS' },
];

export default function MobileNav() {
  return (
    <nav className="glass-strong fixed bottom-0 left-0 right-0 z-50 lg:hidden flex items-center justify-around px-2 py-2 safe-area-bottom">
      {navItems.map((item, index) => {
        const isActive = index === 0;
        return (
          <button
            key={index}
            className={`
              flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300
              ${isActive
                ? 'text-primary'
                : 'text-muted-foreground'
              }
            `}
          >
            <item.icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
