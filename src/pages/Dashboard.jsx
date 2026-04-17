import React, { useEffect, useState } from "react";
import { Droplets, Sun, Thermometer, Wind } from "lucide-react";
import AlertsList from "@/components/dashboard/AlertsList";
import BusinessMetrics from "@/components/dashboard/BusinessMetrics";
import Header from "@/components/dashboard/Header";
import MobileNav from "@/components/dashboard/MobileNav";
import PipelineOverview from "@/components/dashboard/PipelineOverview";
import QuickActions from "@/components/dashboard/QuickActions";
import SensorCard from "@/components/dashboard/SensorCard";
import Sidebar from "@/components/dashboard/Sidebar";
import SystemStatus from "@/components/dashboard/SystemStatus";
import { fetchDashboardData, getFallbackDashboardData } from "@/lib/sensorData";

const sensors = [
  { key: "temperature", title: "Temperatura", icon: Thermometer, color: "#F97316", gradientFrom: "#F97316", gradientTo: "#FB923C", dataKey: "temperature" },
  { key: "humidity", title: "Umidade", icon: Droplets, color: "#3B82F6", gradientFrom: "#3B82F6", gradientTo: "#60A5FA", dataKey: "humidity" },
  { key: "co2", title: "CO2", icon: Wind, color: "#22C55E", gradientFrom: "#22C55E", gradientTo: "#4ADE80", dataKey: "co2" },
  { key: "luminosity", title: "Luminosidade", icon: Sun, color: "#EAB308", gradientFrom: "#EAB308", gradientTo: "#FACC15", dataKey: "luminosity" },
];

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [dashboardData, setDashboardData] = useState(getFallbackDashboardData());

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      const nextData = await fetchDashboardData();
      if (!active) return;
      setDashboardData(nextData);
      setIsConnected(nextData.meta?.dataSource !== "Simulacao local");
    };

    loadDashboard();
    const interval = setInterval(
      loadDashboard,
      dashboardData.meta?.pollingIntervalMs || 10000
    );

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [dashboardData.meta?.pollingIntervalMs]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-chart-2/5 rounded-full blur-3xl" />
      </div>

      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
      <MobileNav />

      <main className="lg:ml-[72px] p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <Header
            isConnected={isConnected}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            meta={dashboardData.meta}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {sensors.map((sensor) => (
              <SensorCard
                key={sensor.key}
                title={sensor.title}
                icon={sensor.icon}
                value={dashboardData.currentValues?.[sensor.key]?.value || 0}
                unit={dashboardData.currentValues?.[sensor.key]?.unit || ""}
                min={dashboardData.currentValues?.[sensor.key]?.min || 0}
                max={dashboardData.currentValues?.[sensor.key]?.max || 100}
                target={dashboardData.currentValues?.[sensor.key]?.target || 50}
                color={sensor.color}
                gradientFrom={sensor.gradientFrom}
                gradientTo={sensor.gradientTo}
                timeSeriesData={dashboardData.timeSeriesData || []}
                barData={dashboardData.barData || []}
                dataKey={sensor.dataKey}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            <div className="lg:col-span-5">
              <AlertsList alerts={dashboardData.alerts || []} />
            </div>
            <div className="lg:col-span-4">
              <BusinessMetrics metrics={dashboardData.processedMetrics || []} />
            </div>
            <div className="lg:col-span-3 flex flex-col gap-4">
              <QuickActions dashboardData={dashboardData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch mt-4">
            <div className="lg:col-span-7">
              <PipelineOverview steps={dashboardData.pipelineSteps || []} />
            </div>
            <div className="lg:col-span-5">
              <SystemStatus services={dashboardData.services || []} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
