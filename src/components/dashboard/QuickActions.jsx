import React from "react";
import { Download, FileText, RefreshCw, Zap } from "lucide-react";
import { toast } from "sonner";

const actions = [
  { icon: Download, label: "Exportar CSV", desc: "Dados consolidados", color: "from-blue-500/20 to-blue-400/10" },
  { icon: RefreshCw, label: "Reprocessar", desc: "Janela de 1h", color: "from-emerald-500/20 to-emerald-400/10" },
  { icon: FileText, label: "Pitch", desc: "Resumo tecnico", color: "from-violet-500/20 to-violet-400/10" },
  { icon: Zap, label: "Healthcheck", desc: "MQTT / API / DB", color: "from-amber-500/20 to-amber-400/10" },
];

export default function QuickActions() {
  const handleAction = (label) => {
    toast.success(`${label} - Ação iniciada`, {
      description: "Fluxo demonstrativo para a apresentacao do projeto.",
    });
  };

  return (
    <div className="glass-strong rounded-3xl p-5 h-full">
      <h3 className="text-base font-semibold mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleAction(action.label)}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${action.color}
              border border-transparent hover:border-border/50 transition-all duration-300
              hover:scale-[1.02] active:scale-[0.98]
            `}
          >
            <action.icon className="w-5 h-5 text-foreground/80" strokeWidth={1.5} />
            <div className="text-center">
              <p className="text-xs font-medium">{action.label}</p>
              <p className="text-[10px] text-muted-foreground">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
