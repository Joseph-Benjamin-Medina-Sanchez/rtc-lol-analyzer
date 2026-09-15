import { AiAnalyzerPort } from "@/core/ports/ai-analyzer.port";
import { PlayerMatchMetrics } from "@/core/domain/entities/analysis-entities";
import {
  PlayerEvaluationReport,
  PerformanceRank,
} from "@/core/domain/entities/evaluation-entities";

export class AiAnalyzerClient implements AiAnalyzerPort {
  async evaluateMatch(metrics: PlayerMatchMetrics): Promise<PlayerEvaluationReport> {
    const baseScore = this.calculateHeuristicScore(metrics);
    const rank = this.determineRank(baseScore);

    const tacticalInsights = metrics.deathIncidents.map((incident) => {
      const isNegative = incident.severity === "high" || incident.severity === "critical";

      return {
        minute: incident.gameMinute,
        category: incident.nearObjectiveWindow ? ("objective" as const) : ("positioning" as const),
        impact: isNegative ? ("negative" as const) : ("positive" as const),
        description: incident.nearObjectiveWindow
          ? `Muerte aislada en el minuto ${incident.gameMinute} antes de la disputa de ${incident.objectiveTypeNear || "objetivo mayor"}.`
          : `Desconexión de posicionamiento en el mapa en el minuto ${incident.gameMinute}.`,
      };
    });

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (metrics.kda.ratio >= 3) {
      strengths.push("Excelente participación y eficiencia de eliminación.");
    } else if (metrics.kda.ratio < 1.5) {
      weaknesses.push("Ratio de KDA deficitario con alta tasa de muertes.");
    }

    if (metrics.criticalMistakesCount === 0) {
      strengths.push("Control de oleadas y posicionamiento seguro en fases de objetivos.");
    } else {
      weaknesses.push(`Cometió ${metrics.criticalMistakesCount} errores críticos cerca de ventanas de objetivos neutrales.`);
    }

    const summary = `Rendimiento de grado ${rank} con ${metrics.championName}. Se registraron ${metrics.kda.kills} asesinatos y ${metrics.criticalMistakesCount} fallos de posicionamiento de alta severidad.`;

    return {
      score: baseScore,
      rank,
      summary,
      strengths,
      weaknesses,
      tacticalInsights,
    };
  }

  private calculateHeuristicScore(metrics: PlayerMatchMetrics): number {
    let score = 70;

    score += Math.min(metrics.kda.ratio * 5, 20);
    score -= metrics.criticalMistakesCount * 12;

    if (metrics.win) {
      score += 10;
    } else {
      score -= 5;
    }

    return Math.max(10, Math.min(Math.round(score), 100));
  }

  private determineRank(score: number): PerformanceRank {
    if (score >= 95) return "S+";
    if (score >= 88) return "S";
    if (score >= 78) return "A";
    if (score >= 65) return "B";
    if (score >= 50) return "C";
    return "D";
  }
}