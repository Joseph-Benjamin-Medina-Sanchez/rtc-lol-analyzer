export interface SummonerAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface PositionCoordinate {
  x: number;
  y: number;
}

export interface ParticipantFrame {
  participantId: number;
  level: number;
  currentGold: number;
  totalGold: number;
  xp: number;
  minionsKilled: number;
  jungleMinionsKilled: number;
  position: PositionCoordinate;
}

export interface TimelineEvent {
  type: string;
  timestamp: number;
  participantId?: number;
  killerId?: number;
  victimId?: number;
  assistingParticipantIds?: number[];
  position?: PositionCoordinate;
  wardType?: string;
  itemId?: number;
  monsterType?: string;
  monsterSubType?: string;
  buildingType?: string;
  towerType?: string;
  laneType?: string;
}

export interface TimelineFrame {
  timestamp: number;
  events: TimelineEvent[];
  participantFrames: Record<string, ParticipantFrame>;
}

export interface MatchTimeline {
  matchId: string;
  frameInterval: number;
  frames: TimelineFrame[];
}

export interface ParticipantSummary {
  puuid: string;
  participantId: number;
  championId: number;
  championName: string;
  role: string;
  lane: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
}

export interface MatchSummary {
  matchId: string;
  gameDuration: number;
  gameMode: string;
  participants: ParticipantSummary[];
}