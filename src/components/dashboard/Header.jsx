import React from "react";
import { Wifi, WifiOff, Sun, Moon, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header({ isConnected, darkMode, setDarkMode, meta }) {
  const lastUpdate = meta?.lastUpdate
    ? new Date(meta.lastUpdate).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Sem dados";

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {meta?.projectName || "IoT Data Pipeline"}
          </h1>
          <span className="text-xs font-medium text-muted-foreground bg-accent px-2.5 py-1 rounded-full">
            AWS + MING
          </span>
        </div>
        <p className="text-sm text-muted-foreground font-light">
          {meta?.scenario || "Painel de monitoramento ambiental em tempo real"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Ultima atualizacao: {lastUpdate} • Fonte: {meta?.dataSource || "API Node.js"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`
            glass flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium
            ${isConnected ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}
          `}
        >
          {isConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Conectado</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modo demo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="glass w-9 h-9 rounded-xl hover:bg-accent"
          title="Exportar dados consolidados"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="glass w-9 h-9 rounded-xl hover:bg-accent"
          title="Sincronizar pipeline"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="glass w-9 h-9 rounded-xl hover:bg-accent lg:hidden"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </header>
  );
}
