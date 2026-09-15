import { MatchSummary, MatchTimeline } from "@/core/domain/entities/riot-entities";

export const sampleMatchSummary: MatchSummary = {
  matchId: "LA1_1589420182",
  gameDuration: 1845,
  gameMode: "CLASSIC",
  participants: [
    {
      puuid: "sample-player-puuid",
      participantId: 1,
      championId: 238,
      championName: "Zed",
      role: "SOLO",
      lane: "MIDDLE",
      kills: 7,
      deaths: 4,
      assists: 5,
      win: true,
    },
    {
      puuid: "opponent-mid-puuid",
      participantId: 6,
      championId: 103,
      championName: "Ahri",
      role: "SOLO",
      lane: "MIDDLE",
      kills: 3,
      deaths: 6,
      assists: 4,
      win: false,
    },
  ],
};

export const sampleMatchTimeline: MatchTimeline = {
  matchId: "LA1_1589420182",
  frameInterval: 60000,
  frames: [
    {
      timestamp: 0,
      events: [],
      participantFrames: {
        "1": {
          participantId: 1,
          level: 1,
          currentGold: 500,
          totalGold: 500,
          xp: 0,
          minionsKilled: 0,
          jungleMinionsKilled: 0,
          position: { x: 400, y: 400 },
        },
      },
    },
    {
      timestamp: 300000,
      events: [],
      participantFrames: {
        "1": {
          participantId: 1,
          level: 4,
          currentGold: 850,
          totalGold: 1450,
          xp: 1600,
          minionsKilled: 32,
          jungleMinionsKilled: 0,
          position: { x: 7200, y: 7200 },
        },
      },
    },
    {
      timestamp: 600000,
      events: [
        {
          type: "CHAMPION_KILL",
          timestamp: 580000,
          killerId: 6,
          victimId: 1,
          assistingParticipantIds: [7, 8],
          position: { x: 8900, y: 4500 },
        },
        {
          type: "ELITE_MONSTER_KILL",
          timestamp: 610000,
          killerId: 7,
          monsterType: "DRAGON",
          monsterSubType: "WATER_DRAGON",
        },
      ],
      participantFrames: {
        "1": {
          participantId: 1,
          level: 7,
          currentGold: 450,
          totalGold: 3100,
          xp: 3800,
          minionsKilled: 75,
          jungleMinionsKilled: 0,
          position: { x: 7400, y: 7300 },
        },
      },
    },
    {
      timestamp: 1200000,
      events: [
        {
          type: "CHAMPION_KILL",
          timestamp: 1185000,
          killerId: 1,
          victimId: 6,
          assistingParticipantIds: [2],
          position: { x: 7100, y: 7000 },
        },
        {
          type: "ELITE_MONSTER_KILL",
          timestamp: 1220000,
          killerId: 1,
          monsterType: "RIFTHERALD",
        },
      ],
      participantFrames: {
        "1": {
          participantId: 1,
          level: 11,
          currentGold: 1200,
          totalGold: 7800,
          xp: 8200,
          minionsKilled: 160,
          jungleMinionsKilled: 4,
          position: { x: 7300, y: 7100 },
        },
      },
    },
  ],
};