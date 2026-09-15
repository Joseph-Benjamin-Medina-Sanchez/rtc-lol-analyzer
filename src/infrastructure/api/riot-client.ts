import axios, { AxiosInstance } from "axios";
import { RiotRepositoryPort } from "@/core/ports/riot-repository.port";
import {
  SummonerAccount,
  MatchSummary,
  MatchTimeline,
} from "@/core/domain/entities/riot-entities";
import { env } from "../config/env";

export class RiotApiClient implements RiotRepositoryPort {
  private regionalClient: AxiosInstance;
  private platformClient: AxiosInstance;

  constructor(
    regionalRouting: string = env.DEFAULT_REGION,
    platformRouting: string = env.DEFAULT_PLATFORM
  ) {
    this.regionalClient = axios.create({
      baseURL: `https://${regionalRouting}.api.riotgames.com`,
      headers: {
        "X-Riot-Token": env.RIOT_API_KEY,
      },
    });

    this.platformClient = axios.create({
      baseURL: `https://${platformRouting}.api.riotgames.com`,
      headers: {
        "X-Riot-Token": env.RIOT_API_KEY,
      },
    });
  }

  async getAccountByRiotId(gameName: string, tagLine: string): Promise<SummonerAccount> {
    const encodedName = encodeURIComponent(gameName);
    const encodedTag = encodeURIComponent(tagLine);

    const response = await this.regionalClient.get(
      `/riot/account/v1/accounts/by-riot-id/${encodedName}/${encodedTag}`
    );

    return {
      puuid: response.data.puuid,
      gameName: response.data.gameName,
      tagLine: response.data.tagLine,
    };
  }

  async getRecentMatchIdsByPuuid(puuid: string, count: number = 5): Promise<string[]> {
    const response = await this.regionalClient.get(
      `/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      {
        params: {
          start: 0,
          count,
        },
      }
    );

    return response.data;
  }

  async getMatchById(matchId: string): Promise<MatchSummary> {
    const response = await this.regionalClient.get(
      `/lol/match/v5/matches/${matchId}`
    );

    const info = response.data.info;

    return {
      matchId: response.data.metadata.matchId,
      gameDuration: info.gameDuration,
      gameMode: info.gameMode,
      participants: info.participants.map((p: any) => ({
        puuid: p.puuid,
        participantId: p.participantId,
        championId: p.championId,
        championName: p.championName,
        role: p.role,
        lane: p.lane,
        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,
        win: p.win,
      })),
    };
  }

  async getMatchTimelineById(matchId: string): Promise<MatchTimeline> {
    const response = await this.regionalClient.get(
      `/lol/match/v5/matches/${matchId}/timeline`
    );

    const info = response.data.info;

    return {
      matchId: response.data.metadata.matchId,
      frameInterval: info.frameInterval,
      frames: info.frames.map((frame: any) => ({
        timestamp: frame.timestamp,
        events: frame.events,
        participantFrames: frame.participantFrames,
      })),
    };
  }
}