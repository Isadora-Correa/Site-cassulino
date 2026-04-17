import React from "react";
import { Cloud, Database, Radio, Server } from "lucide-react";

const iconMap = {
  "Broker MQTT": Radio,
  "Node-RED": Server,
  InfluxDB: Database,
  "API Node.js": Server,
  MySQL: Database,
  Grafana: Cloud,
};

export default function SystemStatus({ services = [] }) {
  return (
    <div className="glass-strong rounded-3xl p-5 h-full">
      <h3 className="text-base font-semibold mb-4">Status do Sistema</h3>
      <div className="space-y-3">
        {services.map((service, index) => {
          const Icon = iconMap[service.name] || Server;

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/50 flex items-center justify-center">
                <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{service.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {service.detail} • {service.latency}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    service.status === "online"
                      ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                      : "bg-rose-500"
                  }`}
                />
                <span className="text-xs text-muted-foreground capitalize">{service.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
