import {
  SummonerAccount,
  MatchSummary,
  MatchTimeline,
} from "../domain/entities/riot-entities";

export interface RiotRepositoryPort {
  getAccountByRiotId(gameName: string, tagLine: string): Promise<SummonerAccount>;
  getRecentMatchIdsByPuuid(puuid: string, count?: number): Promise<string[]>;
  getMatchById(matchId: string): Promise<MatchSummary>;
  getMatchTimelineById(matchId: string): Promise<MatchTimeline>;
}