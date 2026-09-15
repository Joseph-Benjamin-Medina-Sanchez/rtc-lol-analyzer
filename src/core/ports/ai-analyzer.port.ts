import { PlayerMatchMetrics } from "../domain/entities/analysis-entities";
import { PlayerEvaluationReport } from "../domain/entities/evaluation-entities";

export interface AiAnalyzerPort {
  evaluateMatch(metrics: PlayerMatchMetrics): Promise<PlayerEvaluationReport>;
}