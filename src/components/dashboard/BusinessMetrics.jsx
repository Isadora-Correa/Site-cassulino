import React from "react";

export default function BusinessMetrics({ metrics = [] }) {
  return (
    <div className="glass-strong rounded-3xl p-5 h-full">
      <div className="mb-4">
        <h3 className="text-base font-semibold">Regras de Negocio</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Dados processados pela API antes da exibicao no painel.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border/70 bg-card/60 p-4">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="text-xl font-semibold mt-1">{metric.value}</p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {metric.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
