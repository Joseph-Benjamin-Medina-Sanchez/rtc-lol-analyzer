import { NormalizedCoordinate } from "../services/coordinate-normalizer";

export type EventSeverity = "low" | "medium" | "high" | "critical";

export interface PlayerDeathIncident {
  timestamp: number;
  gameMinute: number;
  killerId: number;
  assistingParticipantIds: number[];
  position: NormalizedCoordinate;
  isIsolated: boolean;
  nearObjectiveWindow: boolean;
  objectiveTypeNear?: string;
  severity: EventSeverity;
}

export interface MetricFrame {
  minute: number;
  currentGold: number;
  totalGold: number;
  xp: number;
  cs: number;
  level: number;
  position: NormalizedCoordinate;
}

export interface PlayerMatchMetrics {
  participantId: number;
  puuid: string;
  championName: string;
  role: string;
  lane: string;
  win: boolean;
  kda: {
    kills: number;
    deaths: number;
    assists: number;
    ratio: number;
  };
  deathIncidents: PlayerDeathIncident[];
  progressionFrames: MetricFrame[];
  criticalMistakesCount: number;
}