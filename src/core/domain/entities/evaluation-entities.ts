export type PerformanceRank = "S+" | "S" | "A" | "B" | "C" | "D";

export interface TacticalInsight {
  minute: number;
  category: "positioning" | "objective" | "resource_management" | "tempo";
  impact: "positive" | "negative";
  description: string;
}

export interface PlayerEvaluationReport {
  score: number;
  rank: PerformanceRank;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  tacticalInsights: TacticalInsight[];
}