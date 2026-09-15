"use client";

import React, { useState } from "react";
import { PlayerDeathIncident, MetricFrame } from "@/core/domain/entities/analysis-entities";
import { AlertCircle, Crosshair } from "lucide-react";

interface RiftMinimapProps {
  incidents: PlayerDeathIncident[];
  progression: MetricFrame[];
}

export const RiftMinimap: React.FC<RiftMinimapProps> = ({ incidents, progression }) => {
  const [selectedIncident, setSelectedIncident] = useState<PlayerDeathIncident | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-rose-600 border-rose-400 shadow-rose-500/50";
      case "high":
        return "bg-amber-500 border-amber-300 shadow-amber-500/50";
      case "medium":
        return "bg-yellow-400 border-yellow-200 shadow-yellow-400/50";
      default:
        return "bg-blue-400 border-blue-200 shadow-blue-400/50";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <line x1="0" y1="100%" x2="100%" y2="0" stroke="#475569" strokeWidth="2" strokeDasharray="4" />
          <path d="M 0,0 L 500,500" stroke="#334155" strokeWidth="1" />
          <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#334155" strokeWidth="1" />
        </svg>

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {progression.map((frame, index) => {
            if (index === 0) return null;
            const prev = progression[index - 1];
            return (
              <line
                key={index}
                x1={`${prev.position.xPercent}%`}
                y1={`${prev.position.yPercent}%`}
                x2={`${frame.position.xPercent}%`}
                y2={`${frame.position.yPercent}%`}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="3 3"
                opacity={0.6}
              />
            );
          })}
        </svg>

        {progression.map((frame, idx) => (
          <div
            key={`prog-${idx}`}
            className="absolute w-2 h-2 rounded-full bg-cyan-400 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${frame.position.xPercent}%`,
              top: `${frame.position.yPercent}%`,
            }}
            title={`Minuto ${frame.minute} - Nivel ${frame.level}`}
          />
        ))}

        {incidents.map((incident, idx) => (
          <button
            key={`inc-${idx}`}
            onClick={() => setSelectedIncident(incident)}
            className={`absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 cursor-pointer transition-transform hover:scale-125 shadow-lg flex items-center justify-center animate-pulse ${getSeverityColor(
              incident.severity
            )}`}
            style={{
              left: `${incident.position.xPercent}%`,
              top: `${incident.position.yPercent}%`,
            }}
          >
            <Crosshair className="w-3 h-3 text-white" />
          </button>
        ))}
      </div>

      {selectedIncident && (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-slate-200">
              Incidente en Minuto {selectedIncident.gameMinute} ({selectedIncident.severity.toUpperCase()})
            </div>
            <p className="text-slate-400 mt-1">
              {selectedIncident.nearObjectiveWindow
                ? `Muerte crítica previa al control de ${selectedIncident.objectiveTypeNear || "objetivo neutral"}.`
                : "Pérdida de posición sin soporte de aliados."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};