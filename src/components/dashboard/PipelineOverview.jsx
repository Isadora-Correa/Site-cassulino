import React from "react";
import { ArrowRight, Cloud, Database, Radio, Server, Smartphone } from "lucide-react";

const icons = [Smartphone, Radio, Server, Database, Cloud];

export default function PipelineOverview({ steps = [] }) {
  return (
    <div className="glass-strong rounded-3xl p-5 h-full">
      <div className="mb-4">
        <h3 className="text-base font-semibold">Pipeline IoT</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Fluxo do dispositivo ate a camada de inteligencia.
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = icons[Math.min(index, icons.length - 1)];

          return (
            <div key={step} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/70 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-foreground/80" strokeWidth={1.7} />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm leading-relaxed">{step}</p>
              </div>
              {index < steps.length - 1 ? (
                <ArrowRight className="w-4 h-4 text-muted-foreground mt-2 shrink-0" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
