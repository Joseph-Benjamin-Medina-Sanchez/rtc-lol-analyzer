"use client";

import React from "react";
import { PlayerEvaluationReport } from "@/core/domain/entities/evaluation-entities";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface ScoreCardProps {
  evaluation: PlayerEvaluationReport;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ evaluation }) => {
  const getRankColor = (rank: string) => {
    if (rank.startsWith("S")) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (rank === "A") return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
    if (rank === "B") return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Calificación Algorítmica
          </span>
          <div className="text-4xl font-extrabold text-white mt-1">
            {evaluation.score}
            <span className="text-lg text-slate-500 font-normal"> / 100</span>
          </div>
        </div>

        <div
          className={`w-16 h-16 rounded-xl border flex items-center justify-center text-3xl font-black ${getRankColor(
            evaluation.rank
          )}`}
        >
          {evaluation.rank}
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Resumen Ejecutivo
        </h3>
        <p className="text-slate-300 leading-relaxed text-sm">{evaluation.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Aciertos Clave
          </h4>
          <ul className="space-y-2">
            {evaluation.strengths.map((item, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Áreas de Error Crítico
          </h4>
          <ul className="space-y-2">
            {evaluation.weaknesses.map((item, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" /> Línea de Tiempo de Decisiones
        </h3>
        <div className="space-y-3">
          {evaluation.tacticalInsights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 text-sm"
            >
              <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-xs font-bold shrink-0">
                {insight.minute}:00
              </span>
              <p className="text-slate-300">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};