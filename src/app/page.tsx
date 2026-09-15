"use client";

import React, { useState } from "react";
import { RiftMinimap } from "@/presentation/components/map/rift-minimap";
import { ScoreCard } from "@/presentation/components/score/score-card";
import { Search, Play, ShieldAlert } from "lucide-react";

export default function DashboardPage() {
  const [summonerInput, setSummonerInput] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (useMock = false) => {
    setLoading(true);
    setError(null);

    try {
      let url = "/api/analyze?mock=true";

      if (!useMock) {
        const [gameName, tagLine] = summonerInput.split("#");

        if (!gameName || !tagLine) {
          setError("El formato debe ser Nombre#TAG (ej. Faker#KR1)");
          setLoading(false);
          return;
        }

        url = `/api/analyze?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.details || json.error || "Error al analizar partida");
      }

      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-block px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-bold tracking-wider uppercase mb-2">
              RTC • Road to Challenger
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              AI Performance Analyzer
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Detección algorítmica de fallos tácticos, posicionamiento y evaluación de macrojuego.
            </p>
          </div>

          <button
            onClick={() => fetchAnalysis(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-colors shadow-lg shadow-cyan-950"
          >
            <Play className="w-4 h-4 fill-white" /> Cargar Partida Demo
          </button>
        </header>

        <section className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por Riot ID (Nombre#TAG)"
              value={summonerInput}
              onChange={(e) => setSummonerInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-200 placeholder-slate-500"
            />
          </div>
          <button
            onClick={() => fetchAnalysis(false)}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Analizando..." : "Buscar Partida"}
          </button>
        </section>

        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-900 rounded-xl text-rose-300 text-sm flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Mapa Táctico de Errores
              </h2>
              <RiftMinimap
                incidents={data.metrics.deathIncidents}
                progression={data.metrics.progressionFrames}
              />
            </div>

            <div className="lg:col-span-7">
              <ScoreCard evaluation={data.evaluation} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}