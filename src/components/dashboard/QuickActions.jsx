import React from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function QuickActions({ dashboardData }) {
  const handleExportJson = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      meta: dashboardData?.meta ?? {},
      currentValues: dashboardData?.currentValues ?? {},
      timeSeriesData: dashboardData?.timeSeriesData ?? [],
      alerts: dashboardData?.alerts ?? [],
      processedMetrics: dashboardData?.processedMetrics ?? [],
      summary: dashboardData?.summary ?? {},
      services: dashboardData?.services ?? [],
      pipelineSteps: dashboardData?.pipelineSteps ?? [],
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `smart-greenhouse-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success("JSON exportado", {
      description: "Os dados atuais do dashboard foram baixados com sucesso.",
    });
  };

  return (
    <div className="glass-strong rounded-3xl p-5 h-full">
      <h3 className="text-base font-semibold mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-1 gap-2.5">
        <button
          onClick={handleExportJson}
          className="
            flex flex-col items-center gap-2 p-5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-400/10
            border border-transparent hover:border-border/50 transition-all duration-300
            hover:scale-[1.02] active:scale-[0.98]
          "
        >
          <Download className="w-5 h-5 text-foreground/80" strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-sm font-medium">Exportar JSON</p>
            <p className="text-[11px] text-muted-foreground">Baixar dados atuais do dashboard</p>
          </div>
        </button>
      </div>
    </div>
  );
}
