import React from 'react';
import { AlertTriangle, Info, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const alertIcons = {
  warning: AlertTriangle,
  info: Info,
  critical: AlertCircle,
};

const alertColors = {
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  info: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  critical: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' },
};

export default function AlertsList({ alerts }) {
  return (
    <div className="glass-strong rounded-3xl p-5 flex flex-col h-full min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Alertas Recentes</h3>
        <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 h-7 px-2.5 rounded-lg">
          Ver Todos
        </Button>
      </div>

      {/* Alerts List */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {alerts.slice(0, 4).map((alert) => {
          const AlertIcon = alertIcons[alert.type];
          const colors = alertColors[alert.type];
          return (
            <div
              key={alert.id}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-accent/50 transition-all duration-300 cursor-pointer group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colors.bg}`}>
                <AlertIcon className={`w-4 h-4 ${colors.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{alert.sensor}</span>
                  <span className={`
                    text-[10px] font-medium px-2 py-0.5 rounded-full
                    ${alert.status === 'Ativo'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {alert.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-medium">{alert.value}</p>
                <p className="text-[10px] text-muted-foreground">{alert.time}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}